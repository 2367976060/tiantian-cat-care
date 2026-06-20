import { generateId } from '@/utils';
import type {
  MotherCat,
  Kitten,
  FeedingLog,
  MedicineLog,
  NursingLog,
  Photo,
  Reminder,
  WeightRecord,
  OfflineQueueItem,
} from '@/types';

const STORAGE_KEYS = {
  motherCat: 'tiantian_mother_cat',
  kittens: 'tiantian_kittens',
  feedingLogs: 'tiantian_feeding_logs',
  medicineLogs: 'tiantian_medicine_logs',
  nursingLogs: 'tiantian_nursing_logs',
  photos: 'tiantian_photos',
  reminders: 'tiantian_reminders',
  weightRecords: 'tiantian_weight_records',
  offlineQueue: 'tiantian_offline_queue',
  user: 'tiantian_user',
  theme: 'tiantian_theme',
};

function getStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

// Mother Cat
export function getMotherCat(): MotherCat | null {
  return getStorage<MotherCat | null>(STORAGE_KEYS.motherCat, null);
}

export function saveMotherCat(cat: Partial<MotherCat>): MotherCat {
  const existing = getMotherCat();
  const now = new Date().toISOString();
  const updated: MotherCat = {
    id: existing?.id || generateId(),
    user_id: existing?.user_id || 'local-user',
    name: cat.name || '甜甜',
    avatar_url: cat.avatar_url || existing?.avatar_url,
    age_months: cat.age_months ?? existing?.age_months,
    breed: cat.breed || existing?.breed,
    weight: cat.weight ?? existing?.weight,
    birth_date: cat.birth_date || existing?.birth_date,
    notes: cat.notes ?? existing?.notes,
    created_at: existing?.created_at || now,
    updated_at: now,
  };
  setStorage(STORAGE_KEYS.motherCat, updated);
  return updated;
}

// Kittens
export function getKittens(): Kitten[] {
  const kittens = getStorage<Kitten[]>(STORAGE_KEYS.kittens, []);
  if (kittens.length === 0) {
    // Initialize with default 5 kittens
    const defaultKittens: Kitten[] = [
      { id: generateId(), user_id: 'local-user', number: 1, name: '奶油崽', gender: 'unknown', fur_color: '奶油色', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: generateId(), user_id: 'local-user', number: 2, name: '灰灰', gender: 'unknown', fur_color: '灰色', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: generateId(), user_id: 'local-user', number: 3, name: '团子', gender: 'unknown', fur_color: '白色', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: generateId(), user_id: 'local-user', number: 4, name: '奶糖', gender: 'unknown', fur_color: '橘色', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: generateId(), user_id: 'local-user', number: 5, name: '小白', gender: 'unknown', fur_color: '纯白色', is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    ];
    setStorage(STORAGE_KEYS.kittens, defaultKittens);
    return defaultKittens;
  }
  return kittens;
}

export function saveKitten(kitten: Partial<Kitten> & { id?: string }): Kitten {
  const kittens = getKittens();
  const now = new Date().toISOString();
  
  if (kitten.id) {
    const index = kittens.findIndex(k => k.id === kitten.id);
    if (index >= 0) {
      kittens[index] = { ...kittens[index], ...kitten, updated_at: now };
      setStorage(STORAGE_KEYS.kittens, kittens);
      return kittens[index];
    }
  }
  
  const newKitten: Kitten = {
    id: generateId(),
    user_id: 'local-user',
    number: kitten.number || kittens.length + 1,
    name: kitten.name || `幼崽${kittens.length + 1}`,
    gender: kitten.gender || 'unknown',
    fur_color: kitten.fur_color,
    birth_date: kitten.birth_date,
    birth_weight: kitten.birth_weight,
    current_weight: kitten.current_weight,
    avatar_url: kitten.avatar_url,
    notes: kitten.notes,
    is_active: true,
    created_at: now,
    updated_at: now,
  };
  kittens.push(newKitten);
  setStorage(STORAGE_KEYS.kittens, kittens);
  return newKitten;
}

export function deleteKitten(id: string): void {
  const kittens = getKittens().filter(k => k.id !== id);
  setStorage(STORAGE_KEYS.kittens, kittens);
}

// Feeding Logs
export function getFeedingLogs(): FeedingLog[] {
  return getStorage<FeedingLog[]>(STORAGE_KEYS.feedingLogs, []);
}

export function addFeedingLog(log: Omit<FeedingLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>): FeedingLog {
  const logs = getFeedingLogs();
  const now = new Date().toISOString();
  const newLog: FeedingLog = {
    ...log,
    id: generateId(),
    user_id: 'local-user',
    created_at: now,
    updated_at: now,
  };
  logs.unshift(newLog);
  setStorage(STORAGE_KEYS.feedingLogs, logs);
  return newLog;
}

export function deleteFeedingLog(id: string): void {
  const logs = getFeedingLogs().filter(l => l.id !== id);
  setStorage(STORAGE_KEYS.feedingLogs, logs);
}

// Medicine Logs
export function getMedicineLogs(): MedicineLog[] {
  return getStorage<MedicineLog[]>(STORAGE_KEYS.medicineLogs, []);
}

export function addMedicineLog(log: Omit<MedicineLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>): MedicineLog {
  const logs = getMedicineLogs();
  const now = new Date().toISOString();
  const newLog: MedicineLog = {
    ...log,
    id: generateId(),
    user_id: 'local-user',
    created_at: now,
    updated_at: now,
  };
  logs.unshift(newLog);
  setStorage(STORAGE_KEYS.medicineLogs, logs);
  return newLog;
}

export function deleteMedicineLog(id: string): void {
  const logs = getMedicineLogs().filter(l => l.id !== id);
  setStorage(STORAGE_KEYS.medicineLogs, logs);
}

// Nursing Logs
export function getNursingLogs(): NursingLog[] {
  return getStorage<NursingLog[]>(STORAGE_KEYS.nursingLogs, []);
}

export function addNursingLog(log: Omit<NursingLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>): NursingLog {
  const logs = getNursingLogs();
  const now = new Date().toISOString();
  const newLog: NursingLog = {
    ...log,
    id: generateId(),
    user_id: 'local-user',
    created_at: now,
    updated_at: now,
  };
  logs.unshift(newLog);
  setStorage(STORAGE_KEYS.nursingLogs, logs);
  return newLog;
}

export function deleteNursingLog(id: string): void {
  const logs = getNursingLogs().filter(l => l.id !== id);
  setStorage(STORAGE_KEYS.nursingLogs, logs);
}

// Photos
export function getPhotos(): Photo[] {
  return getStorage<Photo[]>(STORAGE_KEYS.photos, []);
}

export function addPhoto(photo: Omit<Photo, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Photo {
  const photos = getPhotos();
  const now = new Date().toISOString();
  const newPhoto: Photo = {
    ...photo,
    id: generateId(),
    user_id: 'local-user',
    created_at: now,
    updated_at: now,
  };
  photos.unshift(newPhoto);
  setStorage(STORAGE_KEYS.photos, photos);
  return newPhoto;
}

export function deletePhoto(id: string): void {
  const photos = getPhotos().filter(p => p.id !== id);
  setStorage(STORAGE_KEYS.photos, photos);
}

// Reminders
export function getReminders(): Reminder[] {
  return getStorage<Reminder[]>(STORAGE_KEYS.reminders, []);
}

export function addReminder(reminder: Omit<Reminder, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Reminder {
  const reminders = getReminders();
  const now = new Date().toISOString();
  const newReminder: Reminder = {
    ...reminder,
    id: generateId(),
    user_id: 'local-user',
    notification_sent: false,
    created_at: now,
    updated_at: now,
  };
  reminders.push(newReminder);
  setStorage(STORAGE_KEYS.reminders, reminders);
  return newReminder;
}

export function updateReminder(id: string, updates: Partial<Reminder>): void {
  const reminders = getReminders();
  const index = reminders.findIndex(r => r.id === id);
  if (index >= 0) {
    reminders[index] = { ...reminders[index], ...updates, updated_at: new Date().toISOString() };
    setStorage(STORAGE_KEYS.reminders, reminders);
  }
}

export function deleteReminder(id: string): void {
  const reminders = getReminders().filter(r => r.id !== id);
  setStorage(STORAGE_KEYS.reminders, reminders);
}

// Weight Records
export function getWeightRecords(kittenId?: string): WeightRecord[] {
  const records = getStorage<WeightRecord[]>(STORAGE_KEYS.weightRecords, []);
  if (kittenId) {
    return records.filter(r => r.kitten_id === kittenId);
  }
  return records;
}

export function addWeightRecord(record: Omit<WeightRecord, 'id' | 'user_id' | 'created_at'>): WeightRecord {
  const records = getStorage<WeightRecord[]>(STORAGE_KEYS.weightRecords, []);
  const now = new Date().toISOString();
  const newRecord: WeightRecord = {
    ...record,
    id: generateId(),
    user_id: 'local-user',
    created_at: now,
  };
  records.push(newRecord);
  setStorage(STORAGE_KEYS.weightRecords, records);
  return newRecord;
}

// Offline Queue
export function getOfflineQueue(): OfflineQueueItem[] {
  return getStorage<OfflineQueueItem[]>(STORAGE_KEYS.offlineQueue, []);
}

export function addToOfflineQueue(item: Omit<OfflineQueueItem, 'id' | 'timestamp'>): void {
  const queue = getOfflineQueue();
  queue.push({
    ...item,
    id: generateId(),
    timestamp: Date.now(),
  });
  setStorage(STORAGE_KEYS.offlineQueue, queue);
}

export function clearOfflineQueue(): void {
  setStorage(STORAGE_KEYS.offlineQueue, []);
}

export function removeFromOfflineQueue(id: string): void {
  const queue = getOfflineQueue().filter(item => item.id !== id);
  setStorage(STORAGE_KEYS.offlineQueue, queue);
}

// Theme
export function getTheme(): 'light' | 'dark' {
  return getStorage<'light' | 'dark'>(STORAGE_KEYS.theme, 'light');
}

export function setTheme(theme: 'light' | 'dark'): void {
  setStorage(STORAGE_KEYS.theme, theme);
}

// Export / Import
export function exportAllData(): string {
  const data = {
    motherCat: getMotherCat(),
    kittens: getKittens(),
    feedingLogs: getFeedingLogs(),
    medicineLogs: getMedicineLogs(),
    nursingLogs: getNursingLogs(),
    photos: getPhotos(),
    reminders: getReminders(),
    weightRecords: getStorage(STORAGE_KEYS.weightRecords, []),
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
  };
  return JSON.stringify(data, null, 2);
}

export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.motherCat) setStorage(STORAGE_KEYS.motherCat, data.motherCat);
    if (data.kittens) setStorage(STORAGE_KEYS.kittens, data.kittens);
    if (data.feedingLogs) setStorage(STORAGE_KEYS.feedingLogs, data.feedingLogs);
    if (data.medicineLogs) setStorage(STORAGE_KEYS.medicineLogs, data.medicineLogs);
    if (data.nursingLogs) setStorage(STORAGE_KEYS.nursingLogs, data.nursingLogs);
    if (data.photos) setStorage(STORAGE_KEYS.photos, data.photos);
    if (data.reminders) setStorage(STORAGE_KEYS.reminders, data.reminders);
    if (data.weightRecords) setStorage(STORAGE_KEYS.weightRecords, data.weightRecords);
    return true;
  } catch (e) {
    console.error('Import error:', e);
    return false;
  }
}
