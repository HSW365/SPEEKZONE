import { CHATS } from './rooms';

export interface ThreadMessage {
  id: string;
  from: 'me' | 'them';
  text: string;
  time: string;
}

const MESSAGES_KEY = 'speekzone_chat_messages';
const READ_KEY = 'speekzone_chat_read';

function readMessages(): Record<string, ThreadMessage[]> {
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeMessages(all: Record<string, ThreadMessage[]>) {
  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
  } catch {}
}

/** Seeds a thread with the preview message shown in the inbox list, the first time it's opened. */
export function getMessages(chatId: string): ThreadMessage[] {
  const all = readMessages();
  if (all[chatId]) return all[chatId];

  const preview = CHATS.find(c => c.id === chatId);
  const seeded: ThreadMessage[] = preview
    ? [{ id: 'seed', from: 'them', text: preview.message, time: preview.time }]
    : [];
  all[chatId] = seeded;
  writeMessages(all);
  return seeded;
}

export function sendMessage(chatId: string, text: string): ThreadMessage {
  const all = readMessages();
  const message: ThreadMessage = { id: `${Date.now()}`, from: 'me', text, time: 'now' };
  all[chatId] = [...(all[chatId] || []), message];
  writeMessages(all);
  return message;
}

function readRead(): string[] {
  try {
    const raw = localStorage.getItem(READ_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isRead(chatId: string): boolean {
  return readRead().includes(chatId);
}

export function markRead(chatId: string) {
  const list = readRead();
  if (!list.includes(chatId)) {
    try {
      localStorage.setItem(READ_KEY, JSON.stringify([...list, chatId]));
    } catch {}
  }
}
