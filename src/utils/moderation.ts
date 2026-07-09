const BLOCKED_KEY = 'speekzone_blocked_users';
const REPORTS_KEY = 'speekzone_reports';

export const REPORT_REASONS = [
  'Spam or scam',
  'Harassment or bullying',
  'Hate speech or symbols',
  'Nudity or sexual content',
  'Violence or dangerous behavior',
  'Something else',
] as const;

export type ReportReason = typeof REPORT_REASONS[number];

interface Report {
  id: string;
  targetType: 'user' | 'clip' | 'room';
  targetId: string;
  reason: ReportReason;
  createdAt: string;
}

function readList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeList<T>(key: string, list: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

export function getBlockedUsers(): string[] {
  return readList<string>(BLOCKED_KEY);
}

export function isBlocked(username: string): boolean {
  return getBlockedUsers().includes(username);
}

export function blockUser(username: string) {
  const list = getBlockedUsers();
  if (!list.includes(username)) {
    writeList(BLOCKED_KEY, [...list, username]);
  }
}

export function unblockUser(username: string) {
  writeList(BLOCKED_KEY, getBlockedUsers().filter(u => u !== username));
}

/**
 * Queues a report locally. There's no backend yet (see AuthContext - auth
 * itself is still mocked), so this can't actually notify a moderation team
 * today. What matters for App Store review is that the in-app reporting
 * mechanism exists, works, and gives the user confirmation - once a real
 * backend exists, swap this for an actual API call and keep the same
 * signature so callers don't need to change.
 */
export function submitReport(targetType: Report['targetType'], targetId: string, reason: ReportReason) {
  const list = readList<Report>(REPORTS_KEY);
  const report: Report = {
    id: `${Date.now()}`,
    targetType,
    targetId,
    reason,
    createdAt: new Date().toISOString(),
  };
  writeList(REPORTS_KEY, [...list, report]);
  return report;
}
