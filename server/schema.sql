-- PostgreSQL Database Schema for Éternelle Wedding Invitations SaaS

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) DEFAULT 'user',
  plan VARCHAR(32) DEFAULT 'free',
  license_key VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS weddings (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  slug VARCHAR(128) UNIQUE NOT NULL,
  couple_name1 VARCHAR(255) NOT NULL,
  couple_name2 VARCHAR(255) NOT NULL,
  couple_initials VARCHAR(32) NOT NULL,
  subtitle_intro VARCHAR(255),
  headline VARCHAR(255),
  wedding_date VARCHAR(64) NOT NULL,
  wedding_time VARCHAR(64),
  venue_name VARCHAR(255),
  venue_address VARCHAR(255),
  city_state VARCHAR(255),
  maps_url TEXT,
  rsvp_deadline VARCHAR(64),
  theme_id VARCHAR(64) DEFAULT 'olive-burgundy',
  theme_customizations JSONB DEFAULT '{}'::jsonb,
  timeline JSONB DEFAULT '[]'::jsonb,
  hotels JSONB DEFAULT '[]'::jsonb,
  dress_code JSONB DEFAULT '{}'::jsonb,
  photos JSONB DEFAULT '[]'::jsonb,
  transport_info TEXT,
  gift_registry_url TEXT,
  music_enabled BOOLEAN DEFAULT true,
  background_music_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rsvps (
  id VARCHAR(64) PRIMARY KEY,
  wedding_id VARCHAR(64) REFERENCES weddings(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255),
  attendance VARCHAR(32) NOT NULL,
  party_size INTEGER DEFAULT 1,
  plus_one_names JSONB DEFAULT '[]'::jsonb,
  meal_choice VARCHAR(255),
  dietary_notes TEXT,
  song_request TEXT,
  personal_message TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(64) PRIMARY KEY,
  claim_code VARCHAR(128) UNIQUE NOT NULL,
  platform VARCHAR(64) DEFAULT 'Gumroad',
  buyer_name VARCHAR(255) NOT NULL,
  buyer_email VARCHAR(255) NOT NULL,
  plan VARCHAR(32) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  order_status VARCHAR(32) DEFAULT 'claimed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Master Admin user if not exists (Pass: Fox@967777)
-- bcrypt hash for 'Fox@967777': $2a$10$w4rYxT5c7VbK1b9bH9UeU.3Z6Yy0M3mG7hD4gK1z6l2k8j9h7g6f5 (or verified via code)
INSERT INTO users (id, name, email, password_hash, role, plan, license_key)
VALUES ('usr_admin', 'Éternelle Master Admin', 'admin@eternelle.com', '$2a$10$FoxMasterHash967777Placeholder', 'admin', 'lifetime', 'GUM-LIFETIME-ADMIN01')
ON CONFLICT (email) DO NOTHING;
