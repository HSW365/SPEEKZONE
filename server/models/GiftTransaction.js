const mongoose = require('mongoose');

const GiftTransactionSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientName: { type: String, required: true },

    roomId: { type: String, default: null }, // null when sent as a DM gift, not during a live room

    giftId: { type: String, required: true },
    giftName: { type: String, required: true },
    giftEmoji: { type: String, required: true },

    coinsCost: { type: Number, required: true },
    diamondsEarned: { type: Number, required: true }, // recipient payout credit (50% split by default)

    // Set when a PK battle was active — lets the leaderboard/battle score attribute the gift.
    pkBattle: { type: Boolean, default: false },
  },
  { timestamps: true }
);

GiftTransactionSchema.index({ roomId: 1, createdAt: -1 });
GiftTransactionSchema.index({ recipientId: 1, createdAt: -1 });

module.exports = mongoose.model('GiftTransaction', GiftTransactionSchema);
