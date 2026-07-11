import { Room, RoomEvent, RemoteParticipant, RemoteTrack, Track } from 'livekit-client';

/**
 * Wraps LiveKit's client SDK for multi-guest live video (host + up to 8 guests,
 * matching SpeekZone's stage cap) and PK battles. Runs fine inside Capacitor's
 * iOS WKWebView — no native plugin needed since iOS 14.3+ supports WebRTC in-webview.
 *
 * Participant identity = the Mongo user id string (set server-side when the
 * LiveKit token is issued), so the client never has to derive or track a
 * separate numeric id — just match on `participant.identity`.
 *
 * One instance per active Room screen. Call join() on mount, leave() on unmount.
 */
interface LiveKitCallbacks {
  onRemoteTrackChanged?: () => void;
}

export class LiveKitService {
  private room: Room;
  private callbacks: LiveKitCallbacks;
  private videoElements = new Map<string, HTMLVideoElement>();

  constructor(callbacks: LiveKitCallbacks = {}) {
    this.callbacks = callbacks;
    this.room = new Room();
    this.registerRoomEvents();
  }

  private registerRoomEvents() {
    this.room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _pub, participant: RemoteParticipant) => {
      if (track.kind === Track.Kind.Video) {
        const el = this.videoElements.get(participant.identity);
        if (el) track.attach(el);
      } else if (track.kind === Track.Kind.Audio) {
        track.attach(); // audio just needs to play, no visible element required
      }
      this.callbacks.onRemoteTrackChanged?.();
    });

    this.room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
      track.detach();
      this.callbacks.onRemoteTrackChanged?.();
    });

    this.room.on(RoomEvent.ParticipantDisconnected, () => this.callbacks.onRemoteTrackChanged?.());
  }

  /**
   * Joins the room. role 'host' publishes camera+mic immediately (host or on-stage
   * guest). role 'audience' joins subscribe-only (listener watching the stream).
   */
  async join(params: { wsUrl: string; token: string; role: 'host' | 'audience' }) {
    await this.room.connect(params.wsUrl, params.token);

    if (params.role === 'host') {
      await this.publishLocalTracks();
    }
  }

  async publishLocalTracks() {
    await this.room.localParticipant.setMicrophoneEnabled(true);
    await this.room.localParticipant.setCameraEnabled(true);

    const el = this.videoElements.get(this.room.localParticipant.identity);
    if (el) {
      this.room.localParticipant.videoTrackPublications.forEach(pub => pub.videoTrack?.attach(el));
    }
  }

  /** Used when a listener is invited onto the stage mid-room — publishes camera+mic. */
  async promoteToHost() {
    await this.publishLocalTracks();
  }

  /** Used when a guest steps back down to listener. */
  async demoteToAudience() {
    await this.room.localParticipant.setCameraEnabled(false);
    await this.room.localParticipant.setMicrophoneEnabled(false);
  }

  /** Registers the DOM node a participant's video should render into. Call this
   *  from the tile's effect before (or right after) tracks start arriving —
   *  safe to call repeatedly, e.g. on every render, since it just updates the map. */
  registerVideoElement(identity: string, el: HTMLVideoElement | null) {
    if (!el) return;
    this.videoElements.set(identity, el);

    // If a track for this identity already arrived before the element existed
    // (common for the local participant, whose tile mounts before publish
    // finishes), attach it now instead of waiting for the next event.
    if (identity === this.room.localParticipant.identity) {
      this.room.localParticipant.videoTrackPublications.forEach(pub => pub.videoTrack?.attach(el));
    } else {
      const participant = this.room.remoteParticipants.get(identity);
      participant?.videoTrackPublications.forEach(pub => pub.videoTrack?.attach(el));
    }
  }

  setMicMuted(muted: boolean) {
    this.room.localParticipant.setMicrophoneEnabled(!muted);
  }

  setCameraMuted(muted: boolean) {
    this.room.localParticipant.setCameraEnabled(!muted);
  }

  async leave() {
    await this.room.disconnect();
    this.videoElements.clear();
  }
}
