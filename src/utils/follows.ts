const FOLLOWING_KEY = 'speekzone_following';

function readList(): string[] {
  try {
    const raw = localStorage.getItem(FOLLOWING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeList(list: string[]) {
  try {
    localStorage.setItem(FOLLOWING_KEY, JSON.stringify(list));
  } catch {}
}

export function getFollowing(): string[] {
  return readList();
}

export function isFollowing(username: string): boolean {
  return readList().includes(username);
}

export function followUser(username: string) {
  const list = readList();
  if (!list.includes(username)) writeList([...list, username]);
}

export function unfollowUser(username: string) {
  writeList(readList().filter(u => u !== username));
}
