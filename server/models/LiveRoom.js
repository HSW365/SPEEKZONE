const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    role: { type: String, enum: ['host', 'guest', 'listener'], default: 'guest' },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const LiveRoomSchema = new mongoose.Schema(
  {
    // Doubles as the Agora channel name — must be unique per active room.
    roomId: { type: String, required: true, unique: true },

    name: { type: String, required: true },
    topic: { type: String, default: '' },
    category: { type: String, enum: ['Talk', 'Music', 'Business', 'Stories'], default: 'Talk' },

    // 'audio' = legacy voice-room behavior. 'video' = camera-on multi-guest streaming.
    mode: { type: String, enum: ['audio', 'video'], default: 'video' },

    hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hostName: { type: String, required: true },

    isLive: { type: Boolean, default: true },

    // Host + up to maxGuests on stage with camera/mic. Matches Bigo's 1+8 grid by default.
    maxGuests: { type: Number, default: 8 },
    guests: { type: [GuestSchema], default: [] },

    listenerCount: { type: Number, default: 0 },

    // PK battle state — two rooms compete, gifts sent during the battle count as score.
    pk: {
      active: { type: Boolean, default: false },
      opponentRoomId: { type: String, default: null },
      scoreSelf: { type: Number, default: 0 },
      scoreOpponent: { type: Number, default: 0 },
      startedAt: { type: Date, default: null },
      endsAt: { type: Date, default: null },
    },

    endedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

LiveRoomSchema.methods.hasOpenSlot = function () {
  return this.guests.length < this.maxGuests;
};

module.exports = mongoose.model('LiveRoom', LiveRoomSchema);
