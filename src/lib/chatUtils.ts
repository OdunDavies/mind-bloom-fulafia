import { Message } from '@/models/Message';

const STORAGE_KEY = 'mindbloom_chats';

export function getMessagesBetween(userA: string, userB: string): Message[] {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Message[];
  return all.filter(m => (m.from === userA && m.to === userB) || (m.from === userB && m.to === userA));
}

export function saveMessage(msg: Message) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Message[];
  all.push(msg);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}