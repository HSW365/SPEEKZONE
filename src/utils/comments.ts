import { Comment, MOCK_COMMENTS } from './data';

const COMMENTS_KEY = 'speekzone_clip_comments';

interface StoredComment extends Comment {
  clipId: string;
}

function readComments(): StoredComment[] {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeComments(list: StoredComment[]) {
  try {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(list));
  } catch {}
}

/**
 * Every clip starts seeded with the same handful of mock comments (there's
 * no backend yet to have real per-clip history), then any comments actually
 * posted in-app are layered on top and persist across sessions.
 */
export function getCommentsForClip(clipId: string): Comment[] {
  const posted = readComments().filter(c => c.clipId === clipId);
  return [...posted, ...MOCK_COMMENTS];
}

export function postComment(clipId: string, userId: string, username: string, text: string): Comment {
  const comment: StoredComment = {
    id: `${Date.now()}`,
    clipId,
    userId,
    username,
    text,
    likes: 0,
    createdAt: 'now',
  };
  writeComments([comment, ...readComments()]);
  return comment;
}
