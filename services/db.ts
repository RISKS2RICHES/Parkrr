
import { User, ParkingSpace, Booking, AuditLog, Message, FlaggedMessage, SystemMessage, PendingAccount, UserType, Language } from '../types';

const KEYS = {
  USERS: 'parkr_v1_users',
  SPACES: 'parkr_v1_spaces',
  BOOKINGS: 'parkr_v1_bookings',
  LOGS: 'parkr_v1_logs',
  MESSAGES: 'parkr_v1_messages',
  CHAT: 'parkr_v1_chat',
  FLAGGED: 'parkr_v1_flagged',
  PENDING: 'parkr_v1_pending'
};

export const db = {
  get: <T>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    try {
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error parsing key ${key}:`, e);
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // USER OPS
  getUsers: (): User[] => db.get(KEYS.USERS, []),
  
  saveUser: (user: User) => {
    const users = db.getUsers();
    const existingIndex = users.findIndex(u => 
      u.id === user.id || 
      (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase())
    );
    
    let isNew = false;
    if (existingIndex > -1) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
      isNew = true;
    }
    
    db.set(KEYS.USERS, users);

    // If it's a new registration, log it in the audit trail for the Admin
    if (isNew) {
      db.addLog({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        action: 'USER_REGISTERED',
        details: `New account created: ${user.name} (${user.email}) as ${user.type}.`,
        userId: user.id,
        targetId: user.id
      });
    }

    // Trigger UI updates across the app (Admin Dashboard, Profile, etc.)
    window.dispatchEvent(new CustomEvent('parkr_audit_update'));
    window.dispatchEvent(new CustomEvent('parkr_users_updated'));
  },
  
  // GDPR: SOFT DELETE & SCRUBBING
  anonymizeUser: (userId: string, operatorId: string) => {
    const users = db.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx > -1) {
      const originalEmail = users[idx].email;
      users[idx].isDeleted = true;
      users[idx].name = "[REDACTED - RIGHT TO BE FORGOTTEN]";
      users[idx].email = `deleted_${userId}@parkr.internal`;
      users[idx].avatar = "";
      db.set(KEYS.USERS, users);
      
      db.addLog({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        action: 'GDPR_FORGET_ME',
        details: `User ${originalEmail} anonymized per GDPR request.`,
        userId: operatorId,
        targetId: userId
      });
      window.dispatchEvent(new CustomEvent('parkr_users_updated'));
    }
  },

  // BOOKING OPS
  getBookings: (): Booking[] => db.get(KEYS.BOOKINGS, []),
  saveBooking: (booking: Booking) => {
    const all = db.getBookings();
    const idx = all.findIndex(b => b.id === booking.id);
    if (idx > -1) all[idx] = booking; else all.push(booking);
    db.set(KEYS.BOOKINGS, all);
  },

  // CHAT MESSAGES
  getMessages: (bookingId: string): Message[] => {
    const all = db.get<Message[]>(KEYS.CHAT, []);
    return all.filter(m => m.bookingId === bookingId);
  },
  saveMessage: (msg: Message) => {
    const all = db.get<Message[]>(KEYS.CHAT, []);
    all.push(msg);
    db.set(KEYS.CHAT, all);
  },
  saveFlaggedMessage: (msg: FlaggedMessage) => {
    const all = db.get<FlaggedMessage[]>(KEYS.FLAGGED, []);
    all.push(msg);
    db.set(KEYS.FLAGGED, all);
  },

  // AUDIT LOGS
  addLog: (log: AuditLog) => {
    const logs = db.get(KEYS.LOGS, []);
    logs.unshift(log);
    db.set(KEYS.LOGS, logs.slice(0, 10000));
    window.dispatchEvent(new CustomEvent('parkr_audit_update'));
  },
  getLogs: (): AuditLog[] => db.get(KEYS.LOGS, []),

  // SYSTEM MESSAGES
  getSystemMessages: (): SystemMessage[] => db.get(KEYS.MESSAGES, []),
  saveSystemMessage: (msg: SystemMessage) => {
    const all = db.getSystemMessages();
    all.push(msg);
    db.set(KEYS.MESSAGES, all);
    window.dispatchEvent(new CustomEvent('parkr_new_mail'));
  },
  markAllRead: () => {
    const msgs = db.getSystemMessages();
    msgs.forEach(m => m.read = true);
    db.set(KEYS.MESSAGES, msgs);
  },

  // ASSETS
  getSpaces: (): ParkingSpace[] => db.get(KEYS.SPACES, []),
  setSpaces: (spaces: ParkingSpace[]) => db.set(KEYS.SPACES, spaces),
  saveSpace: (space: ParkingSpace) => {
    const all = db.getSpaces();
    const idx = all.findIndex(s => s.id === space.id);
    if (idx > -1) all[idx] = space; else all.push(space);
    db.set(KEYS.SPACES, all);
  },

  seedSpecialUser: () => {
    const users = db.getUsers();
    
    // 1. Master Compliance Admin
    // Ensure this user exists with correct credentials (upsert)
    db.saveUser({
      id: 'system-root-primary',
      name: 'Compliance Operations',
      email: 'compliance@parkr.co.uk',
      password: 'ParkrSecure2025!',
      type: UserType.ADMIN,
      verified: true,
      strikes: 0,
      isSuspended: false,
      isDeleted: false,
      mfaEnabled: true,
      language: Language.EN_GB,
      createdAt: new Date().toISOString()
    });

    // 2. Dev/Test Admin (Simplified for quick access)
    db.saveUser({
      id: 'admin-dev',
      name: 'Developer Admin',
      email: 'admin',
      password: 'admin',
      type: UserType.ADMIN,
      verified: true,
      strikes: 0,
      isSuspended: false,
      isDeleted: false,
      mfaEnabled: false,
      language: Language.EN_GB,
      createdAt: new Date().toISOString()
    });

    // 3. Standard Test User (Only create if missing to preserve manual edits)
    if (!users.find(u => u.name === 'Theo')) {
      db.saveUser({
        id: 'user-theo-parkee',
        name: 'Theo',
        email: 'theo@example.com',
        password: 'password123',
        type: UserType.PARKEE,
        verified: true,
        strikes: 0,
        isSuspended: false,
        isDeleted: false,
        mfaEnabled: false,
        language: Language.EN_GB,
        createdAt: new Date().toISOString()
      });
    }
  },

  getPendingAccounts: (): PendingAccount[] => db.get(KEYS.PENDING, []),
  savePendingAccount: (acc: PendingAccount) => {
    const all = db.getPendingAccounts();
    all.push(acc);
    db.set(KEYS.PENDING, all);
  },
  consumePendingAccount: (code: string): PendingAccount | null => {
    const all = db.getPendingAccounts();
    const idx = all.findIndex(a => a.code.toUpperCase() === code.toUpperCase());
    if (idx > -1) {
      const acc = all[idx];
      all.splice(idx, 1);
      db.set(KEYS.PENDING, all);
      return acc;
    }
    return null;
  }
};
