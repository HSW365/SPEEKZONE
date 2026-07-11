const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['dm', 'room'], required: true },

    // For DMs: a deterministic thread id built from the two sorted user ids.
    // For room chat: the LiveRoom.roomId.
    threadId: { type: String, required: true, index: true },

    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

MessageSchema.index({ threadId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', MessageSchema);
