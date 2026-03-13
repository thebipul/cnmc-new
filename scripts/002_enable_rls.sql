-- Enable Row Level Security on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Admin Users Policies
CREATE POLICY "Admin users can view their own profile" ON public.admin_users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Super admins can view all admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can insert admin users" ON public.admin_users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can update admin users" ON public.admin_users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can delete admin users" ON public.admin_users
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Board Members Policies (public read, admin write)
CREATE POLICY "Anyone can view active board members" ON public.board_members
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can view all board members" ON public.board_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admins can insert board members" ON public.board_members
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admins can update board members" ON public.board_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Super admins can delete board members" ON public.board_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- Events Policies (public read published, admin write)
CREATE POLICY "Anyone can view published events" ON public.events
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Admins can view all events" ON public.events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Admins can insert events" ON public.events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Admins can update events" ON public.events
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete events" ON public.events
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Gallery Images Policies
CREATE POLICY "Anyone can view gallery images" ON public.gallery_images
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can insert gallery images" ON public.gallery_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Admins can update gallery images" ON public.gallery_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete gallery images" ON public.gallery_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Announcements Policies
CREATE POLICY "Anyone can view published announcements" ON public.announcements
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can view all announcements" ON public.announcements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Admins can insert announcements" ON public.announcements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Admins can update announcements" ON public.announcements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete announcements" ON public.announcements
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Contact Submissions Policies
CREATE POLICY "Anyone can insert contact submissions" ON public.contact_submissions
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admins can update contact submissions" ON public.contact_submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Newsletter Subscribers Policies
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can view newsletter subscribers" ON public.newsletter_subscribers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admins can update newsletter subscribers" ON public.newsletter_subscribers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );

-- Site Settings Policies
CREATE POLICY "Anyone can view site settings" ON public.site_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "Super admins can manage site settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );
