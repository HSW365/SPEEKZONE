require('dotenv').config();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

if (!process.env.JWT_SECRET) {
  // Keeps auth working if the secret was never set; sessions reset on restart until it is.
  console.warn('[SpeekZone] JWT_SECRET not set - using a random per-boot secret.');
  process.env.JWT_SECRET = crypto.randomBytes(48).toString('hex');
}
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const { router: authRouter } = require('./routes/auth');
const buildRoomsRouter = require('./routes/rooms');
const buildGiftsRouter = require('./routes/gifts');
const { attachLiveSocket } = require('./socket/liveSocket');

const app = express();
const server = http.createServer(app);

const allowedOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const io = new Server(server, { cors: corsOptions });
attachLiveSocket(io);

let dbMode = 'connecting';
app.get('/health', (req, res) => res.json({ ok: true, db: dbMode }));
app.use('/api/auth', authRouter);
app.use('/api/rooms', buildRoomsRouter(io));
app.use('/api/gifts', buildGiftsRouter(io));

// Serve the built web app (repo-root dist/) from the same origin as the API.
const WEB_DIST = path.resolve(__dirname, '..', 'dist');
if (fs.existsSync(path.join(WEB_DIST, 'index.html'))) {
  app.use(express.static(WEB_DIST, { index: false, maxAge: '1h' }));
  app.get(/^\/(?!api\/|socket\.io\/|health$).*/, (req, res) =>
    res.sendFile(path.join(WEB_DIST, 'index.html'))
  );
  console.log('Serving web app from', WEB_DIST);
}

app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 8080;

function isValidMongoUri(uri) {
  return typeof uri === 'string' && /^mongodb(\+srv)?:\/\//.test(uri.trim());
}

async function resolveMongoUri() {
  const uri = (process.env.MONGO_URI || '').trim();
  if (isValidMongoUri(uri)) {
    dbMode = 'mongodb';
    return uri;
  }
  // No real database configured: boot an embedded MongoDB so the service still runs.
  // Data does NOT survive restarts/redeploys. Set MONGO_URI to a real cluster to persist.
  console.warn('[SpeekZone] MONGO_URI missing or invalid - starting embedded MongoDB (non-persistent).');
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mem = await MongoMemoryServer.create({
    instance: { args: ['--wiredTigerCacheSizeGB', '0.25'] },
  });
  dbMode = 'embedded';
  return mem.getUri('speekzone');
}

(async () => {
  try {
    const uri = await resolveMongoUri();
    await mongoose.connect(uri);
    console.log(`MongoDB connected (${dbMode})`);
    server.listen(PORT, () => console.log(`SpeekZone live server on :${PORT}`));
  } catch (err) {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  }
})();
