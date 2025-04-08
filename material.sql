-- Create custom ENUM types for our material table
CREATE TYPE file_type AS ENUM ('img', 'video', 'pdf');
CREATE TYPE material_type AS ENUM ('material', 'pyq', 'solution');
CREATE TYPE material_category AS ENUM ('jee', 'ncert', 'neet', 'olympiad', 'cuet', 'ntse');

-- Create the materials table
CREATE TABLE materials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  file_type file_type NOT NULL,
  file_url TEXT NOT NULL,
  chapter INTEGER,
  class INTEGER,
  type material_type NOT NULL,
  category material_category NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for common query patterns
CREATE INDEX materials_type_idx ON materials(type);
CREATE INDEX materials_category_idx ON materials(category);
CREATE INDEX materials_class_idx ON materials(class);
CREATE INDEX materials_chapter_idx ON materials(chapter);

-- Enable Row Level Security (RLS)
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all users to view materials
CREATE POLICY "Materials are viewable by everyone" 
ON materials FOR SELECT 
USING (true);

-- Create a policy that allows only authenticated users to insert materials
CREATE POLICY "Authenticated users can insert materials"
ON materials FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create a policy that allows only authenticated users to update their own materials
-- Note: This assumes you add a user_id column if you want proper ownership
-- CREATE POLICY "Users can update their own materials"
-- ON materials FOR UPDATE
-- TO authenticated
-- USING (auth.uid() = user_id);
