const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    plan: { type: String, enum: ['free', 'creator', 'pro'], default: 'free' },

    // Spendable balance — purchased via Apple IAP, spent on gifts.
    coins: { type: Number, default: 500 },

    // Earned balance — accumulated from gifts received while live.
    // Cashed out separately via Stripe Connect (Phase 2), never purchasable directly.
    diamonds: { type: Number, default: 0 },
    lifetimeDiamonds: { type: Number, default: 0 },

    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
