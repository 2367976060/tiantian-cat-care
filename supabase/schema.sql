-- 甜甜育儿记录本 - Supabase Database Schema
-- Tiantian Cat Care Diary - Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Mother Cat Table
-- ============================================
CREATE TABLE IF NOT EXISTS mother_cat (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT '甜甜',
    avatar_url TEXT,
    breed TEXT,
    age INTEGER,
    current_weight DECIMAL(10, 2),
    weight_unit TEXT DEFAULT 'g',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Kittens Table
-- ============================================
CREATE TABLE IF NOT EXISTS kittens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mother_id UUID REFERENCES mother_cat(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    name TEXT NOT NULL,
    gender TEXT,
    fur_color TEXT,
    birth_date DATE,
    current_weight DECIMAL(10, 2),
    weight_unit TEXT DEFAULT 'g',
    avatar_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Weight Records Table
-- ============================================
CREATE TABLE IF NOT EXISTS weight_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kitten_id UUID REFERENCES kittens(id) ON DELETE CASCADE,
    weight DECIMAL(10, 2) NOT NULL,
    weight_unit TEXT DEFAULT 'g',
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Feeding Logs Table
-- ============================================
CREATE TABLE IF NOT EXISTS feeding_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mother_id UUID REFERENCES mother_cat(id) ON DELETE CASCADE,
    food_type TEXT NOT NULL,
    custom_food_name TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    unit TEXT DEFAULT 'g',
    notes TEXT,
    photo_url TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Medicine Logs Table
-- ============================================
CREATE TABLE IF NOT EXISTS medicine_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mother_id UUID REFERENCES mother_cat(id) ON DELETE CASCADE,
    medicine_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    dosage_unit TEXT NOT NULL,
    notes TEXT,
    photo_url TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Nursing Logs Table
-- ============================================
CREATE TABLE IF NOT EXISTS nursing_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mother_id UUID REFERENCES mother_cat(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    kitten_ids UUID[] DEFAULT '{}',
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Photos Table
-- ============================================
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT DEFAULT 'general',
    title TEXT,
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    kitten_id UUID REFERENCES kittens(id) ON DELETE SET NULL,
    log_id UUID,
    log_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Reminders Table
-- ============================================
CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'custom',
    description TEXT,
    reminder_time TIME NOT NULL,
    repeat_days INTEGER[] DEFAULT '{0,1,2,3,4,5,6}',
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    notification_sent BOOLEAN DEFAULT false,
    last_notified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_mother_cat_user_id ON mother_cat(user_id);
CREATE INDEX IF NOT EXISTS idx_kittens_user_id ON kittens(user_id);
CREATE INDEX IF NOT EXISTS idx_kittens_mother_id ON kittens(mother_id);
CREATE INDEX IF NOT EXISTS idx_weight_records_kitten_id ON weight_records(kitten_id);
CREATE INDEX IF NOT EXISTS idx_feeding_logs_user_id ON feeding_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_feeding_logs_recorded_at ON feeding_logs(recorded_at);
CREATE INDEX IF NOT EXISTS idx_medicine_logs_user_id ON medicine_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_medicine_logs_recorded_at ON medicine_logs(recorded_at);
CREATE INDEX IF NOT EXISTS idx_nursing_logs_user_id ON nursing_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_nursing_logs_start_time ON nursing_logs(start_time);
CREATE INDEX IF NOT EXISTS idx_photos_user_id ON photos(user_id);
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_is_active ON reminders(is_active);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mother_cat ENABLE ROW LEVEL SECURITY;
ALTER TABLE kittens ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE feeding_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE nursing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Mother cat policies
CREATE POLICY "Users can view own mother cat" ON mother_cat
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mother cat" ON mother_cat
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mother cat" ON mother_cat
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mother cat" ON mother_cat
    FOR DELETE USING (auth.uid() = user_id);

-- Kittens policies
CREATE POLICY "Users can view own kittens" ON kittens
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kittens" ON kittens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own kittens" ON kittens
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own kittens" ON kittens
    FOR DELETE USING (auth.uid() = user_id);

-- Weight records policies
CREATE POLICY "Users can view own weight records" ON weight_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM kittens
            WHERE kittens.id = weight_records.kitten_id
            AND kittens.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own weight records" ON weight_records
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM kittens
            WHERE kittens.id = weight_records.kitten_id
            AND kittens.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own weight records" ON weight_records
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM kittens
            WHERE kittens.id = weight_records.kitten_id
            AND kittens.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own weight records" ON weight_records
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM kittens
            WHERE kittens.id = weight_records.kitten_id
            AND kittens.user_id = auth.uid()
        )
    );

-- Feeding logs policies
CREATE POLICY "Users can view own feeding logs" ON feeding_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feeding logs" ON feeding_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own feeding logs" ON feeding_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own feeding logs" ON feeding_logs
    FOR DELETE USING (auth.uid() = user_id);

-- Medicine logs policies
CREATE POLICY "Users can view own medicine logs" ON medicine_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medicine logs" ON medicine_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medicine logs" ON medicine_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medicine logs" ON medicine_logs
    FOR DELETE USING (auth.uid() = user_id);

-- Nursing logs policies
CREATE POLICY "Users can view own nursing logs" ON nursing_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nursing logs" ON nursing_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nursing logs" ON nursing_logs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own nursing logs" ON nursing_logs
    FOR DELETE USING (auth.uid() = user_id);

-- Photos policies
CREATE POLICY "Users can view own photos" ON photos
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own photos" ON photos
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photos" ON photos
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own photos" ON photos
    FOR DELETE USING (auth.uid() = user_id);

-- Reminders policies
CREATE POLICY "Users can view own reminders" ON reminders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders" ON reminders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders" ON reminders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders" ON reminders
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Storage Buckets
-- ============================================
-- Note: Storage buckets need to be created via Supabase dashboard or API
-- Bucket name: photos
-- Bucket name: avatars
-- Both should be set to private with RLS

-- ============================================
-- Realtime Publications
-- ============================================
-- Note: Realtime needs to be enabled via Supabase dashboard
-- Tables to enable: feeding_logs, medicine_logs, nursing_logs, photos, reminders
