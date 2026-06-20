// Type definitions for Tiantian Cat Care Diary

export interface User {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface MotherCat {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  age_months?: number;
  breed?: string;
  weight?: number;
  birth_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Kitten {
  id: string;
  user_id: string;
  number: number;
  name: string;
  gender: 'male' | 'female' | 'unknown';
  fur_color?: string;
  birth_date?: string;
  birth_weight?: number;
  current_weight?: number;
  avatar_url?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FeedingLog {
  id: string;
  user_id: string;
  cat_id?: string;
  food_type: string;
  custom_food_name?: string;
  amount: number;
  unit: string;
  notes?: string;
  tags?: string[];
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export interface MedicineLog {
  id: string;
  user_id: string;
  cat_id?: string;
  kitten_id?: string;
  medicine_name: string;
  dosage: string;
  dosage_unit?: string;
  notes?: string;
  tags?: string[];
  recorded_at: string;
  created_at: string;
  updated_at: string;
}

export interface NursingLog {
  id: string;
  user_id: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  kitten_ids: string[];
  notes?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface Photo {
  id: string;
  user_id: string;
  url: string;
  thumbnail_url?: string;
  category: 'mother' | 'feeding' | 'medicine' | 'kittens' | 'general';
  title?: string;
  description?: string;
  tags?: string[];
  related_log_id?: string;
  related_log_type?: string;
  width?: number;
  height?: number;
  file_size?: number;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  title: string;
  type: 'feeding' | 'medicine' | 'nursing' | 'custom';
  description?: string;
  reminder_time: string;
  repeat_days: number[];
  interval_minutes?: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  notification_sent: boolean;
  last_triggered_at?: string;
  created_at: string;
  updated_at: string;
}

export interface WeightRecord {
  id: string;
  user_id: string;
  kitten_id?: string;
  cat_id?: string;
  weight: number;
  recorded_at: string;
  notes?: string;
  created_at: string;
}

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  user_agent?: string;
  created_at: string;
}

export type FoodType = 'kibble' | 'canned' | 'chicken' | 'milk' | 'custom';

export const FOOD_TYPES: { value: FoodType; label: string }[] = [
  { value: 'kibble', label: '幼猫粮' },
  { value: 'canned', label: '猫罐头' },
  { value: 'chicken', label: '鸡胸肉' },
  { value: 'milk', label: '羊奶粉' },
  { value: 'custom', label: '自定义' },
];

export const PHOTO_CATEGORIES: { value: Photo['category']; label: string }[] = [
  { value: 'mother', label: '甜甜' },
  { value: 'feeding', label: '喂食' },
  { value: 'medicine', label: '喂药' },
  { value: 'kittens', label: '幼崽成长' },
  { value: 'general', label: '全部' },
];

export interface TimelineItem {
  id: string;
  type: 'feeding' | 'medicine' | 'nursing' | 'photo';
  time: string;
  title: string;
  description: string;
  photoUrl?: string;
}

export interface DailyStats {
  feedingCount: number;
  medicineCount: number;
  nursingCount: number;
  lastRecordTime?: string;
}

export interface OfflineQueueItem {
  id: string;
  table: string;
  data: any;
  action: 'insert' | 'update' | 'delete';
  timestamp: number;
}
