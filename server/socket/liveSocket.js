const { verifySocketToken } = require('../middleware/auth');
const Message = require('../models/Message');
const LiveRoom = require('../models/LiveRoom');

function attachLiveSocket(io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    const payload = token ? verifySocketToken(token) : null;
    if (!payload) return next(new Error('Unauthorized'));
    socket.user = payload; // { id, username }
    next();
  });

  io.on('connection', socket => {
    socket.on('room:join', ({ roomId }) => {
      if (!roomId) return;
      socket.join(roomId);
      socket.to(roomId).emit('room:presence', { username: socket.user.username, joined: true });
    });

    socket.on('room:leave', ({ roomId }) => {
      if (!roomId) return;
      socket.leave(roomId);
      socket.to(roomId).emit('room:presence', { username: socket.user.username, joined: false });
    });

    socket.on('chat:message', async ({ roomId, text }) => {
      if (!roomId || !text || !text.trim()) return;
      const trimmed = text.trim().slice(0, 500);

      const message = await Message.create({
        type: 'room',
        threadId: roomId,
        senderId: socket.user.id,
        senderName: socket.user.username,
        text: trimmed,
      });

      io.to(roomId).emit('chat:message', {
        id: message._id,
        senderName: message.senderName,
        text: message.text,
        createdAt: message.createdAt,
      });
    });

    socket.on('stage:raise-hand', async ({ roomId }) => {
      const room = await LiveRoom.findOne({ roomId, isLive: true });
      if (!room) return;
      io.to(room.hostId ? roomId : roomId).emit('stage:hand-raised', {
        userId: socket.user.id,
        username: socket.user.username,
      });
    });

    socket.on('disconnect', () => {
      // Room membership cleanup (listenerCount decrement) is handled by the
      // REST leave/leave-stage endpoints — sockets here are presence/chat only.
    });
  });
}

module.exports = { attachLiveSocket };
