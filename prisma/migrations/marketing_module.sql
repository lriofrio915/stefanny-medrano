-- ============================================================
--  Marketing Module Migration
--  Run in Supabase SQL Editor
-- ============================================================

-- 1. Add new enum values to PostStatus
ALTER TYPE "PostStatus" ADD VALUE IF NOT EXISTS 'APPROVED';
ALTER TYPE "PostStatus" ADD VALUE IF NOT EXISTS 'REJECTED';

-- 2. Create ContentType enum
DO $$ BEGIN
  CREATE TYPE "ContentType" AS ENUM ('POST', 'CAROUSEL', 'REEL', 'STORY');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Create SocialPlatform enum
DO $$ BEGIN
  CREATE TYPE "SocialPlatform" AS ENUM ('INSTAGRAM', 'FACEBOOK', 'BOTH');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4. Add marketing columns to SocialPost
ALTER TABLE "SocialPost"
  ADD COLUMN IF NOT EXISTS "contentType"    "ContentType"    NOT NULL DEFAULT 'POST',
  ADD COLUMN IF NOT EXISTS "targetPlatform" "SocialPlatform" NOT NULL DEFAULT 'INSTAGRAM',
  ADD COLUMN IF NOT EXISTS "topic"          TEXT,
  ADD COLUMN IF NOT EXISTS "carouselSlides" JSONB,
  ADD COLUMN IF NOT EXISTS "reelScript"     TEXT,
  ADD COLUMN IF NOT EXISTS "imagePrompt"    TEXT,
  ADD COLUMN IF NOT EXISTS "suggestedTime"  TEXT,
  ADD COLUMN IF NOT EXISTS "aiGenerated"    BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS "approvedAt"     TIMESTAMPTZ;

-- 5. Create BrandProfile table
CREATE TABLE IF NOT EXISTS "BrandProfile" (
  "id"             TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
  "doctorId"       TEXT        NOT NULL,
  "clinicName"     TEXT,
  "specialties"    TEXT[]      NOT NULL DEFAULT '{}',
  "slogan"         TEXT,
  "primaryColor"   TEXT        NOT NULL DEFAULT '#2563EB',
  "secondaryColor" TEXT        NOT NULL DEFAULT '#0D9488',
  "accentColor"    TEXT        NOT NULL DEFAULT '#F59E0B',
  "logoUrl"        TEXT,
  "logoPath"       TEXT,
  "tones"          TEXT[]      NOT NULL DEFAULT '{}',
  "targetAudience" TEXT,
  "excludedTopics" TEXT,
  "instagramUrl"   TEXT,
  "facebookUrl"    TEXT,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "BrandProfile_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BrandProfile_doctorId_key" UNIQUE ("doctorId"),
  CONSTRAINT "BrandProfile_doctorId_fkey"
    FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "BrandProfile_doctorId_idx" ON "BrandProfile"("doctorId");

-- 6. Create BrandImage table
CREATE TABLE IF NOT EXISTS "BrandImage" (
  "id"             TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
  "doctorId"       TEXT        NOT NULL,
  "brandProfileId" TEXT        NOT NULL,
  "url"            TEXT        NOT NULL,
  "storagePath"    TEXT        NOT NULL,
  "category"       TEXT        NOT NULL,
  "description"    TEXT,
  "createdAt"      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "BrandImage_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BrandImage_doctorId_fkey"
    FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE,
  CONSTRAINT "BrandImage_brandProfileId_fkey"
    FOREIGN KEY ("brandProfileId") REFERENCES "BrandProfile"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "BrandImage_doctorId_idx"       ON "BrandImage"("doctorId");
CREATE INDEX IF NOT EXISTS "BrandImage_brandProfileId_idx" ON "BrandImage"("brandProfileId");
CREATE INDEX IF NOT EXISTS "BrandImage_category_idx"       ON "BrandImage"("category");

-- 7. Create ContentCalendar table
CREATE TABLE IF NOT EXISTS "ContentCalendar" (
  "id"        TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
  "doctorId"  TEXT        NOT NULL,
  "title"     TEXT        NOT NULL,
  "startDate" TIMESTAMPTZ NOT NULL,
  "endDate"   TIMESTAMPTZ NOT NULL,
  "frequency" TEXT        NOT NULL DEFAULT 'MONTHLY',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "ContentCalendar_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ContentCalendar_doctorId_fkey"
    FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "ContentCalendar_doctorId_idx" ON "ContentCalendar"("doctorId");

-- 8. Create CalendarItem table
CREATE TABLE IF NOT EXISTS "CalendarItem" (
  "id"            TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
  "calendarId"    TEXT        NOT NULL,
  "socialPostId"  TEXT        NOT NULL,
  "scheduledDate" TIMESTAMPTZ NOT NULL,
  "order"         INTEGER     NOT NULL DEFAULT 0,
  "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "CalendarItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CalendarItem_calendarId_fkey"
    FOREIGN KEY ("calendarId") REFERENCES "ContentCalendar"("id") ON DELETE CASCADE,
  CONSTRAINT "CalendarItem_socialPostId_fkey"
    FOREIGN KEY ("socialPostId") REFERENCES "SocialPost"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "CalendarItem_calendarId_idx"   ON "CalendarItem"("calendarId");
CREATE INDEX IF NOT EXISTS "CalendarItem_socialPostId_idx" ON "CalendarItem"("socialPostId");
CREATE INDEX IF NOT EXISTS "CalendarItem_scheduledDate_idx" ON "CalendarItem"("scheduledDate");

-- 9. Add indexes for new SocialPost columns
CREATE INDEX IF NOT EXISTS "SocialPost_contentType_idx"    ON "SocialPost"("contentType");
CREATE INDEX IF NOT EXISTS "SocialPost_publishedAt_idx"    ON "SocialPost"("publishedAt");

-- 10. RLS Policies

-- BrandProfile
ALTER TABLE "BrandProfile" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors manage own brand profile" ON "BrandProfile"
  USING (
    "doctorId" = (SELECT id FROM "Doctor" WHERE email = auth.email() OR id = auth.uid()::text LIMIT 1)
  )
  WITH CHECK (
    "doctorId" = (SELECT id FROM "Doctor" WHERE email = auth.email() OR id = auth.uid()::text LIMIT 1)
  );

-- BrandImage
ALTER TABLE "BrandImage" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors manage own brand images" ON "BrandImage"
  USING (
    "doctorId" = (SELECT id FROM "Doctor" WHERE email = auth.email() OR id = auth.uid()::text LIMIT 1)
  )
  WITH CHECK (
    "doctorId" = (SELECT id FROM "Doctor" WHERE email = auth.email() OR id = auth.uid()::text LIMIT 1)
  );

-- ContentCalendar
ALTER TABLE "ContentCalendar" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors manage own calendars" ON "ContentCalendar"
  USING (
    "doctorId" = (SELECT id FROM "Doctor" WHERE email = auth.email() OR id = auth.uid()::text LIMIT 1)
  )
  WITH CHECK (
    "doctorId" = (SELECT id FROM "Doctor" WHERE email = auth.email() OR id = auth.uid()::text LIMIT 1)
  );

-- CalendarItem: accessible if you own the calendar
ALTER TABLE "CalendarItem" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Doctors manage own calendar items" ON "CalendarItem"
  USING (
    "calendarId" IN (
      SELECT id FROM "ContentCalendar"
      WHERE "doctorId" = (SELECT id FROM "Doctor" WHERE email = auth.email() OR id = auth.uid()::text LIMIT 1)
    )
  )
  WITH CHECK (
    "calendarId" IN (
      SELECT id FROM "ContentCalendar"
      WHERE "doctorId" = (SELECT id FROM "Doctor" WHERE email = auth.email() OR id = auth.uid()::text LIMIT 1)
    )
  );

-- 11. Storage bucket for brand-images (run once)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('brand-images', 'brand-images', true)
-- ON CONFLICT DO NOTHING;

-- Storage RLS for brand-images bucket
-- CREATE POLICY "Doctors upload own brand images" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'brand-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- CREATE POLICY "Public read brand images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'brand-images');

-- CREATE POLICY "Doctors delete own brand images" ON storage.objects
--   FOR DELETE TO authenticated
--   USING (bucket_id = 'brand-images' AND (storage.foldername(name))[1] = auth.uid()::text);
