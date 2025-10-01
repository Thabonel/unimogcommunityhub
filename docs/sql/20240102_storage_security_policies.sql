-- Storage Security Policies for all buckets

-- AVATARS bucket policies
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Avatars are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- PROFILE_PHOTOS bucket policies
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'profile_photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own profile photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'profile_photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own profile photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile_photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Profile photos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile_photos');

-- VEHICLE_PHOTOS bucket policies
CREATE POLICY "Users can upload their own vehicle photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'vehicle_photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own vehicle photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'vehicle_photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own vehicle photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'vehicle_photos' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Vehicle photos are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'vehicle_photos');

-- MANUALS bucket policies (private bucket)
CREATE POLICY "Users can upload manuals" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'manuals' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can view manuals if authenticated" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'manuals' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Only admins can update manuals" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'manuals' AND 
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete manuals" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'manuals' AND 
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- ARTICLE_FILES bucket policies
CREATE POLICY "Users can upload article files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'article_files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Article files are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'article_files');

CREATE POLICY "Users can update their own article files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'article_files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own article files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'article_files' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- SITE_ASSETS bucket policies (admin only)
CREATE POLICY "Only admins can upload site assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'site_assets' AND 
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Site assets are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'site_assets');

CREATE POLICY "Only admins can update site assets" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'site_assets' AND 
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete site assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'site_assets' AND 
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );