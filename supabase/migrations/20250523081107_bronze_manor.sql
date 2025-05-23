/*
  # Create storage bucket and policies for user files

  1. New Storage Bucket
    - `user_files` bucket for storing user uploaded files
  
  2. Security
    - Enable public access with appropriate policies
    - Allow authenticated users to manage only their own files
    - Prevent unauthorized access to files
*/

-- Create the storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('user_files', 'User Files', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow users to read their own files
CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'user_files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy to allow users to upload their own files
CREATE POLICY "Users can upload their own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user_files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy to allow users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user_files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy to allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user_files' AND auth.uid()::text = (storage.foldername(name))[1]);