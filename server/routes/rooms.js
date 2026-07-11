const express = require('express');
const crypto = require('crypto');
const LiveRoom = require('../models/LiveRoom');
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const { buildLiveKitToken } = require('../utils/livekitToken');

function makeRoomId(name) {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${slug}-${crypto.randomBytes(3).toString('hex')}`;
}

module.exports = function buildRoomsRouter(io) {
  const router = express.Router();

  // List currently live rooms.
  router.get('/', async (req, res) => {
    const rooms = await LiveRoom.find({ isLive: true }).sort({ createdAt: -1 }).limit(100);
    res.json({ rooms });
  });

  router.get('/:roomId', async (req, res) => {
    const room = await LiveRoom.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json({ room });
  });

  // Create + immediately go live as host.
  router.post('/', requireAuth, async (req, res) => {
    try {
      const { name, topic, category, mode, maxGuests } = req.body;
      if (!name) return res.status(400).json({ error: 'name is required' });

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const roomId = makeRoomId(name);
      const room = await LiveRoom.create({
        roomId,
        name: name.trim(),
        topic: topic || '',
        category: category || 'Talk',
        mode: mode === 'audio' ? 'audio' : 'video',
        maxGuests: Math.min(Math.max(Number(maxGuests) || 8, 1), 8),
        hostId: user._id,
        hostName: user.username,
        guests: [{ userId: user._id, username: user.username, role: 'host' }],
      });

      const rtc = await buildLiveKitToken({
        roomName: roomId,
        identity: user._id.toString(),
        name: user.username,
        role: 'host',
      });

      res.status(201).json({ room, rtc });
    } catch (err) {
      console.error('create room error', err);
      res.status(500).json({ error: 'Could not create room' });
    }
  });

  // Join a room. If there's an open guest slot AND asRole=guest was requested, join on-stage
  // publishing audio/video. Otherwise join as a subscribe-only listener/viewer.
  router.post('/:roomId/join', requireAuth, async (req, res) => {
    try {
      const room = await LiveRoom.findOne({ roomId: req.params.roomId, isLive: true });
      if (!room) return res.status(404).json({ error: 'Room not found or has ended' });

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const wantsGuestSlot = req.body?.asRole === 'guest';
      const alreadyOnStage = room.guests.some(g => g.userId.toString() === user._id.toString());

      let role = 'listener';
      if (wantsGuestSlot || alreadyOnStage) {
        if (!alreadyOnStage) {
          if (!room.hasOpenSlot()) {
            return res.status(409).json({ error: 'Stage is full — no open guest slots' });
          }
          room.guests.push({ userId: user._id, username: user.username, role: 'guest' });
          await room.save();
        }
        role = 'guest';
      } else {
        room.listenerCount += 1;
        await room.save();
      }

      const rtc = await buildLiveKitToken({
        roomName: room.roomId,
        identity: user._id.toString(),
        name: user.username,
        role: role === 'listener' ? 'audience' : 'host',
      });

      io.to(room.roomId).emit('room:guests-updated', { guests: room.guests, listenerCount: room.listenerCount });

      res.json({ room, rtc, role });
    } catch (err) {
      console.error('join room error', err);
      res.status(500).json({ error: 'Could not join room' });
    }
  });

  // Host pulls a listener up onto the stage (the "invite to multi-guest" action).
  router.post('/:roomId/invite', requireAuth, async (req, res) => {
    try {
      const { targetUserId } = req.body;
      const room = await LiveRoom.findOne({ roomId: req.params.roomId, isLive: true });
      if (!room) return res.status(404).json({ error: 'Room not found' });
      if (room.hostId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Only the host can invite guests' });
      }
      if (!room.hasOpenSlot()) {
        return res.status(409).json({ error: 'Stage is full' });
      }

      const targetUser = await User.findById(targetUserId);
      if (!targetUser) return res.status(404).json({ error: 'Target user not found' });

      const already = room.guests.some(g => g.userId.toString() === targetUserId);
      if (!already) {
        room.guests.push({ userId: targetUser._id, username: targetUser.username, role: 'guest' });
        await room.save();
      }

      io.to(room.roomId).emit('room:guests-updated', { guests: room.guests, listenerCount: room.listenerCount });
      io.to(room.roomId).emit('room:invited', { userId: targetUserId, username: targetUser.username });

      res.json({ room });
    } catch (err) {
      console.error('invite error', err);
      res.status(500).json({ error: 'Could not invite guest' });
    }
  });

  // Guest steps down from the stage back to listener.
  router.post('/:roomId/leave-stage', requireAuth, async (req, res) => {
    const room = await LiveRoom.findOne({ roomId: req.params.roomId, isLive: true });
    if (!room) return res.status(404).json({ error: 'Room not found' });

    room.guests = room.guests.filter(g => g.userId.toString() !== req.user.id || g.role === 'host');
    await room.save();

    io.to(room.roomId).emit('room:guests-updated', { guests: room.guests, listenerCount: room.listenerCount });
    res.json({ room });
  });

  // Host ends the room entirely.
  router.post('/:roomId/end', requireAuth, async (req, res) => {
    const room = await LiveRoom.findOne({ roomId: req.params.roomId });
    if (!room) return res.status(404).json({ error: 'Room not found' });
    if (room.hostId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Only the host can end the room' });
    }

    room.isLive = false;
    room.endedAt = new Date();
    await room.save();

    io.to(room.roomId).emit('room:ended');
    res.json({ room });
  });

  // --- PK Battle: two rooms merge into a head-to-head, gifts sent count as score. ---

  router.post('/:roomId/pk/start', requireAuth, async (req, res) => {
    try {
      const { opponentRoomId, durationSeconds } = req.body;
      const room = await LiveRoom.findOne({ roomId: req.params.roomId, isLive: true });
      const opponent = await LiveRoom.findOne({ roomId: opponentRoomId, isLive: true });

      if (!room || !opponent) return res.status(404).json({ error: 'Both rooms must be live' });
      if (room.hostId.toString() !== req.user.id) {
        return res.status(403).json({ error: 'Only the host can start a PK battle' });
      }

      const endsAt = new Date(Date.now() + (Number(durationSeconds) || 180) * 1000);

      room.pk = { active: true, opponentRoomId: opponent.roomId, scoreSelf: 0, scoreOpponent: 0, startedAt: new Date(), endsAt };
      opponent.pk = { active: true, opponentRoomId: room.roomId, scoreSelf: 0, scoreOpponent: 0, startedAt: new Date(), endsAt };
      await room.save();
      await opponent.save();

      io.to(room.roomId).emit('pk:started', { opponentRoomId: opponent.roomId, endsAt });
      io.to(opponent.roomId).emit('pk:started', { opponentRoomId: room.roomId, endsAt });

      res.json({ room, opponent });
    } catch (err) {
      console.error('pk start error', err);
      res.status(500).json({ error: 'Could not start PK battle' });
    }
  });

  router.post('/:roomId/pk/end', requireAuth, async (req, res) => {
    const room = await LiveRoom.findOne({ roomId: req.params.roomId });
    if (!room || !room.pk.active) return res.status(404).json({ error: 'No active PK battle' });

    const opponent = await LiveRoom.findOne({ roomId: room.pk.opponentRoomId });
    const winner = room.pk.scoreSelf >= room.pk.scoreOpponent ? room.roomId : room.pk.opponentRoomId;

    room.pk = { active: false, opponentRoomId: null, scoreSelf: 0, scoreOpponent: 0, startedAt: null, endsAt: null };
    await room.save();
    if (opponent) {
      opponent.pk = { active: false, opponentRoomId: null, scoreSelf: 0, scoreOpponent: 0, startedAt: null, endsAt: null };
      await opponent.save();
    }

    io.to(room.roomId).emit('pk:ended', { winner });
    if (opponent) io.to(opponent.roomId).emit('pk:ended', { winner });

    res.json({ winner });
  });

  return router;
};
