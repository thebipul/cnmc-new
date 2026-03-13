-- Seed initial data for CNMC website

-- Insert default site settings
INSERT INTO public.site_settings (key, value) VALUES
  ('site_name', '"Canadian Nepali Mahila Chautari"'),
  ('site_tagline', '"Empowering Women, Uniting Communities"'),
  ('contact_email', '"info@cnmc.ca"'),
  ('social_facebook', '"https://facebook.com/cnmc"'),
  ('social_instagram', '"https://instagram.com/cnmc"'),
  ('about_mission', '"Canadian Nepali Mahila Chautari (CNMC) is dedicated to empowering Nepali women in Canada through cultural unity, community support, and social activities. Founded in August 2017, we strive to create a supportive environment where women can thrive, connect, and make meaningful contributions to society."'),
  ('about_vision', '"To be the leading organization fostering Nepali women''s empowerment and cultural preservation in Canada, creating lasting positive impact in our communities."')
ON CONFLICT (key) DO NOTHING;

-- Insert sample board members
INSERT INTO public.board_members (name, role, bio, display_order, is_active) VALUES
  ('Sample President', 'President', 'Leading CNMC with dedication and passion for community empowerment.', 1, true),
  ('Sample Vice President', 'Vice President', 'Supporting organizational growth and community initiatives.', 2, true),
  ('Sample Secretary', 'Secretary', 'Managing communications and organizational records.', 3, true),
  ('Sample Treasurer', 'Treasurer', 'Overseeing financial management and transparency.', 4, true)
ON CONFLICT DO NOTHING;

-- Insert sample events
INSERT INTO public.events (title, slug, description, content, event_date, location, is_featured, is_published) VALUES
  ('Annual General Meeting 2024', 'annual-general-meeting-2024', 
   'Join us for our Annual General Meeting where we discuss the year''s achievements and future plans.',
   'The Annual General Meeting is an important event where all members come together to review the organization''s progress, discuss financial reports, and plan for the upcoming year. All members are encouraged to attend and participate.',
   '2024-12-15', 'Toronto Community Center', true, true),
  ('Teej Celebration 2024', 'teej-celebration-2024',
   'Celebrate the vibrant festival of Teej with traditional songs, dances, and cultural activities.',
   'Teej is a significant festival for Nepali women, celebrating the bond between husband and wife. Join us for an evening of traditional songs, dances, delicious food, and cultural activities.',
   '2024-09-06', 'Nepali Community Hall', true, true),
  ('Women Empowerment Workshop', 'women-empowerment-workshop-2024',
   'A workshop focused on skill development and empowerment for women in our community.',
   'This workshop covers various topics including financial literacy, professional development, mental health awareness, and networking opportunities.',
   '2024-10-20', 'Virtual Event', false, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample announcements
INSERT INTO public.announcements (title, slug, excerpt, content, status, published_at) VALUES
  ('Welcome to Our New Website', 'welcome-new-website',
   'We are excited to launch our new website with improved features and design.',
   'Dear members and supporters,\n\nWe are thrilled to announce the launch of our brand new website! This modern platform will help us better connect with our community, share updates about our activities, and celebrate our achievements together.\n\nKey features include:\n- Easy event registration\n- Photo galleries from our events\n- Latest news and announcements\n- Member information portal\n\nThank you for your continued support!\n\nWarm regards,\nCNMC Team',
   'published', NOW()),
  ('Membership Registration Open', 'membership-registration-2024',
   'Annual membership registration for 2024 is now open. Join our growing community!',
   'We are pleased to announce that membership registration for 2024 is now open. As a member, you will enjoy:\n\n- Access to all CNMC events and programs\n- Voting rights at Annual General Meetings\n- Networking opportunities with fellow community members\n- Discounts on event registrations\n\nTo register, please contact us at info@cnmc.ca or visit our upcoming events.',
   'published', NOW() - INTERVAL '7 days')
ON CONFLICT (slug) DO NOTHING;
