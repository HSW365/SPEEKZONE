const express = require('express');
const User = require('../models/User');
const LiveRoom = require('../models/LiveRoom');
const GiftTransaction = require('../models/GiftTransaction');
const { requireAuth } = require('../middleware/auth');

// Keep this in sync with src/utils/data.ts GIFTS on the client.
// coinsCost is what the sender pays; recipient earns diamondSplit of that (payout balance).
const GIFT_CATALOG = [
  { id: '1', emoji: '🎤', name: 'Mic', coins: 10 },
  { id: '2', emoji: '🔥', name: 'Fire', coins: 50 },
  { id: '3', emoji: '💎', name: 'Diamond', coins: 200 },
  { id: '4', emoji: '👑', name: 'Crown', coins: 500 },
  { id: '5', emoji: '🚀', name: 'Rocket', coins: 1000 },
  { id: '6', emoji: '💰', name: 'Bag', coins: 2000 },
];

const DIAMOND_SPLIT = 0.5; // recipient's payout cut of each gift's coin value

module.exports = function buildGiftsRouter(io) {
  const router = express.Router();

  router.get('/catalog', (req, res) => {
    res.json({ gifts: GIFT_CATALOG });
  });

  router.post('/send', requireAuth, async (req, res) => {
    try {
      const { recipientId, giftId, roomId } = req.body;
      const gift = GIFT_CATALOG.find(g => g.id === giftId);
      if (!gift) return res.status(400).json({ error: 'Unknown gift' });
      if (!recipientId) return res.status(400).json({ error: 'recipientId is required' });

      const [sender, recipient] = await Promise.all([
        User.findById(req.user.id),
        User.findById(recipientId),
      ]);
      if (!sender || !recipient) return res.status(404).json({ error: 'User not found' });
      if (sender._id.toString() === recipient._id.toString()) {
        return res.status(400).json({ error: "You can't gift yourself" });
      }
      if (sender.coins < gift.coins) {
        return res.status(402).json({ error: 'Not enough coins', needed: gift.coins, have: sender.coins });
      }

      const diamondsEarned = Math.round(gift.coins * DIAMOND_SPLIT);

      let room = null;
      let pkBattle = false;
      if (roomId) {
        room = await LiveRoom.findOne({ roomId, isLive: true });
        pkBattle = !!room?.pk?.active;
      }

      sender.coins -= gift.coins;
      recipient.diamonds += diamondsEarned;
      recipient.lifetimeDiamonds += diamondsEarned;
      await sender.save();
      await recipient.save();

      const transaction = await GiftTransaction.create({
        senderId: sender._id,
        senderName: sender.username,
        recipientId: recipient._id,
        recipientName: recipient.username,
        roomId: roomId || null,
        giftId: gift.id,
        giftName: gift.name,
        giftEmoji: gift.emoji,
        coinsCost: gift.coins,
        diamondsEarned,
        pkBattle,
      });

      // If sent during an active PK battle, add to that room's score and sync the opponent room.
      if (room && pkBattle) {
        room.pk.scoreSelf += gift.coins;
        await room.save();
        if (room.pk.opponentRoomId) {
          io.to(room.pk.opponentRoomId).emit('pk:score-update', {
            roomId: room.roomId,
            scoreSelf: room.pk.scoreOpponent, // from the opponent's perspective, this room is "opponent"
            scoreOpponent: room.pk.scoreSelf,
          });
        }
        io.to(room.roomId).emit('pk:score-update', {
          roomId: room.roomId,
          scoreSelf: room.pk.scoreSelf,
          scoreOpponent: room.pk.scoreOpponent,
        });
      }

      if (roomId) {
        io.to(roomId).emit('gift:received', {
          senderName: sender.username,
          recipientName: recipient.username,
          giftEmoji: gift.emoji,
          giftName: gift.name,
          coins: gift.coins,
        });
      }

      res.json({
        transaction,
        senderCoins: sender.coins,
        recipientDiamonds: recipient.diamonds,
      });
    } catch (err) {
      console.error('send gift error', err);
      res.status(500).json({ error: 'Could not send gift' });
    }
  });

  // Top gifters/earners for a room (live leaderboard) or globally over a window.
  router.get('/leaderboard/:roomId', async (req, res) => {
    const { roomId } = req.params;
    const topSenders = await GiftTransaction.aggregate([
      { $match: { roomId } },
      { $group: { _id: '$senderName', totalCoins: { $sum: '$coinsCost' } } },
      { $sort: { totalCoins: -1 } },
      { $limit: 10 },
    ]);
    res.json({ topSenders });
  });

  router.get('/leaderboard', async (req, res) => {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // weekly
    const topEarners = await GiftTransaction.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: '$recipientName', totalDiamonds: { $sum: '$diamondsEarned' } } },
      { $sort: { totalDiamonds: -1 } },
      { $limit: 20 },
    ]);
    res.json({ topEarners, windowDays: 7 });
  });

  return router;
};

module.exports.GIFT_CATALOG = GIFT_CATALOG;
