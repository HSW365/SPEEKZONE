import { Clip } from './data';
import { saveMediaBlob, deleteMediaBlob } from './mediaStorage';

const USER_CLIPS_KEY = 'speekzone_user_clips';

function readUserClips(): Clip[] {
  try {
    const raw = localStorage.getItem(USER_CLIPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUserClips(clips: Clip[]) {
  try {
    localStorage.setItem(USER_CLIPS_KEY, JSON.stringify(clips));
  } catch {}
}

export function getUserClips(): Clip[] {
  return readUserClips();
}

export async function postClip(params: {
  userId: string;
  username: string;
  userVerified?: boolean;
  caption: string;
  tags: string[];
  mediaBlob: Blob;
  mediaType: 'video' | 'image';
}): Promise<Clip> {
  const id = `user-${Date.now()}`;
  await saveMediaBlob(id, params.mediaBlob);

  const clip: Clip = {
    id,
    userId: params.userId,
    username: params.username,
    userVerified: params.userVerified,
    caption: params.caption,
    videoUrl: id, // resolved to a real object URL at render time via mediaStorage
    mediaType: params.mediaType,
    waveform: [],
    duration: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    gifts: 0,
    tags: params.tags,
    createdAt: 'now',
  };

  writeUserClips([clip, ...readUserClips()]);
  return clip;
}

export async function deleteClip(id: string) {
  writeUserClips(readUserClips().filter(c => c.id !== id));
  await deleteMediaBlob(id);
}
