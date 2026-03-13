-- Fix infinite recursion in admin_users RLS policies.
-- Policies that check "is current user super_admin?" by querying admin_users
-- trigger RLS on admin_users again, causing recursion.
-- Solution: a SECURITY DEFINER function that reads admin_users without RLS.

-- 1. Function to get current user's role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.current_user_admin_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.admin_users WHERE id = auth.uid()
$$;

-- 2. Drop the admin_users policies that cause recursion
DROP POLICY IF EXISTS "Super admins can view all admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can insert admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can update admin users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can delete admin users" ON public.admin_users;

-- 3. Recreate them using the function (no subquery on admin_users)
CREATE POLICY "Super admins can view all admin users" ON public.admin_users
  FOR SELECT USING (public.current_user_admin_role() = 'super_admin');

CREATE POLICY "Super admins can insert admin users" ON public.admin_users
  FOR INSERT WITH CHECK (public.current_user_admin_role() = 'super_admin');

CREATE POLICY "Super admins can update admin users" ON public.admin_users
  FOR UPDATE USING (public.current_user_admin_role() = 'super_admin');

CREATE POLICY "Super admins can delete admin users" ON public.admin_users
  FOR DELETE USING (public.current_user_admin_role() = 'super_admin');

-- 4. Update other tables' policies to use the function (avoids any RLS on admin_users)
-- Board members
DROP POLICY IF EXISTS "Admins can view all board members" ON public.board_members;
DROP POLICY IF EXISTS "Admins can insert board members" ON public.board_members;
DROP POLICY IF EXISTS "Admins can update board members" ON public.board_members;
DROP POLICY IF EXISTS "Super admins can delete board members" ON public.board_members;

CREATE POLICY "Admins can view all board members" ON public.board_members
  FOR SELECT USING (public.current_user_admin_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can insert board members" ON public.board_members
  FOR INSERT WITH CHECK (public.current_user_admin_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can update board members" ON public.board_members
  FOR UPDATE USING (public.current_user_admin_role() IN ('super_admin', 'admin'));

CREATE POLICY "Super admins can delete board members" ON public.board_members
  FOR DELETE USING (public.current_user_admin_role() = 'super_admin');

-- Events
DROP POLICY IF EXISTS "Admins can view all events" ON public.events;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;

CREATE POLICY "Admins can view all events" ON public.events
  FOR SELECT USING (public.current_user_admin_role() IN ('super_admin', 'admin', 'editor'));

CREATE POLICY "Admins can insert events" ON public.events
  FOR INSERT WITH CHECK (public.current_user_admin_role() IN ('super_admin', 'admin', 'editor'));

CREATE POLICY "Admins can update events" ON public.events
  FOR UPDATE USING (public.current_user_admin_role() IN ('super_admin', 'admin', 'editor'));

CREATE POLICY "Admins can delete events" ON public.events
  FOR DELETE USING (public.current_user_admin_role() IN ('super_admin', 'admin'));

-- Gallery images
DROP POLICY IF EXISTS "Admins can insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can delete gallery images" ON public.gallery_images;

CREATE POLICY "Admins can insert gallery images" ON public.gallery_images
  FOR INSERT WITH CHECK (public.current_user_admin_role() IN ('super_admin', 'admin', 'editor'));

CREATE POLICY "Admins can update gallery images" ON public.gallery_images
  FOR UPDATE USING (public.current_user_admin_role() IN ('super_admin', 'admin', 'editor'));

CREATE POLICY "Admins can delete gallery images" ON public.gallery_images
  FOR DELETE USING (public.current_user_admin_role() IN ('super_admin', 'admin'));

-- Announcements
DROP POLICY IF EXISTS "Admins can view all announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can insert announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Admins can delete announcements" ON public.announcements;

CREATE POLICY "Admins can view all announcements" ON public.announcements
  FOR SELECT USING (public.current_user_admin_role() IN ('super_admin', 'admin', 'editor'));

CREATE POLICY "Admins can insert announcements" ON public.announcements
  FOR INSERT WITH CHECK (public.current_user_admin_role() IN ('super_admin', 'admin', 'editor'));

CREATE POLICY "Admins can update announcements" ON public.announcements
  FOR UPDATE USING (public.current_user_admin_role() IN ('super_admin', 'admin', 'editor'));

CREATE POLICY "Admins can delete announcements" ON public.announcements
  FOR DELETE USING (public.current_user_admin_role() IN ('super_admin', 'admin'));

-- Contact submissions
DROP POLICY IF EXISTS "Admins can view contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can update contact submissions" ON public.contact_submissions;

CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions
  FOR SELECT USING (public.current_user_admin_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions
  FOR UPDATE USING (public.current_user_admin_role() IN ('super_admin', 'admin'));

-- Newsletter subscribers
DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can update newsletter subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Admins can view newsletter subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (public.current_user_admin_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can update newsletter subscribers" ON public.newsletter_subscribers
  FOR UPDATE USING (public.current_user_admin_role() IN ('super_admin', 'admin'));

-- Site settings
DROP POLICY IF EXISTS "Super admins can manage site settings" ON public.site_settings;

CREATE POLICY "Super admins can manage site settings" ON public.site_settings
  FOR ALL USING (public.current_user_admin_role() = 'super_admin');
