require('dotenv').config();
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

app.get('/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/rooms', buildRoomsRouter(io));
app.use('/api/gifts', buildGiftsRouter(io));

app.use((err, req, res, next) => {
  console.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => console.log(`SpeekZone live server on :${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  });
