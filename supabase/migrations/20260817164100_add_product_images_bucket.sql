-- Create a new storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the bucket
-- Allow public read access to all files
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
TO public 
USING ( bucket_id = 'product-images' );

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'product-images' );

-- Allow authenticated users to update their files
CREATE POLICY "Authenticated users can update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( bucket_id = 'product-images' );

-- Allow authenticated users to delete their files
CREATE POLICY "Authenticated users can delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING ( bucket_id = 'product-images' );
