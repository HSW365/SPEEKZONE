const REMINDERS_KEY = 'speekzone_room_reminders';

function readList(): string[] {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeList(list: string[]) {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(list));
  } catch {}
}

export function hasReminder(roomId: string): boolean {
  return readList().includes(roomId);
}

export function toggleReminder(roomId: string): boolean {
  const list = readList();
  const has = list.includes(roomId);
  writeList(has ? list.filter(id => id !== roomId) : [...list, roomId]);
  return !has;
}
