-- Simplify auth: any authenticated user (auth.uid() IS NOT NULL) can write.
-- No more admin_users roles. Access is controlled by Supabase login only.

-- Drop the helper function (no longer needed)
DROP FUNCTION IF EXISTS public.current_user_admin_role() CASCADE;

-- ─── Board Members ───────────────────────────────────────────────────────────
-- (CASCADE above already dropped the old role-based policies)

CREATE POLICY "Authenticated users can view all board members" ON public.board_members
  FOR SELECT USING (auth.uid() IS NOT NULL OR is_active = TRUE);

CREATE POLICY "Authenticated users can insert board members" ON public.board_members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update board members" ON public.board_members
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete board members" ON public.board_members
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ─── Events ──────────────────────────────────────────────────────────────────

CREATE POLICY "Authenticated users can view all events" ON public.events
  FOR SELECT USING (auth.uid() IS NOT NULL OR is_published = TRUE);

CREATE POLICY "Authenticated users can insert events" ON public.events
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update events" ON public.events
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete events" ON public.events
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ─── Gallery Images ───────────────────────────────────────────────────────────

CREATE POLICY "Authenticated users can insert gallery images" ON public.gallery_images
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update gallery images" ON public.gallery_images
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete gallery images" ON public.gallery_images
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ─── Announcements ────────────────────────────────────────────────────────────

CREATE POLICY "Authenticated users can view all announcements" ON public.announcements
  FOR SELECT USING (auth.uid() IS NOT NULL OR status = 'published');

CREATE POLICY "Authenticated users can insert announcements" ON public.announcements
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update announcements" ON public.announcements
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete announcements" ON public.announcements
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ─── Contact Submissions ──────────────────────────────────────────────────────

CREATE POLICY "Authenticated users can view contact submissions" ON public.contact_submissions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update contact submissions" ON public.contact_submissions
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ─── Newsletter Subscribers ───────────────────────────────────────────────────

CREATE POLICY "Authenticated users can view newsletter subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update newsletter subscribers" ON public.newsletter_subscribers
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- ─── Site Settings ────────────────────────────────────────────────────────────

CREATE POLICY "Authenticated users can manage site settings" ON public.site_settings
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Note: DROP FUNCTION ... CASCADE above already dropped all dependent policies,
-- including the admin_users role-based policies. Nothing more needed here.
