const { AccessToken } = require('livekit-server-sdk');

const TOKEN_TTL = '2h'; // client rejoins/refreshes if a session runs longer

/**
 * Builds a short-lived LiveKit access token scoped to one room + participant identity.
 * role 'host'/'guest' = can publish audio/video (on stage).
 * role 'audience' = subscribe-only (listener watching the stream, no publish grant).
 *
 * identity should be the Mongo user id string — LiveKit takes arbitrary string
 * identities natively, so unlike Agora there's no numeric uid to derive.
 */
async function buildLiveKitToken({ roomName, identity, name, role }) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.LIVEKIT_WS_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    throw new Error('LIVEKIT_API_KEY / LIVEKIT_API_SECRET / LIVEKIT_WS_URL not configured on the server');
  }

  const at = new AccessToken(apiKey, apiSecret, { identity, name, ttl: TOKEN_TTL });
  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: role !== 'audience',
    canSubscribe: true,
    canPublishData: true,
  });

  const token = await at.toJwt();
  return { token, wsUrl };
}

module.exports = { buildLiveKitToken };
