-- Seed About Us text and Objectives into site_settings.
-- Safe to re-run: ON CONFLICT updates existing values.

-- About text (subquery gives 'txt' an explicit text type, resolving to_jsonb polymorphism)
INSERT INTO public.site_settings (key, value)
SELECT 'about_text', to_jsonb(txt)
FROM (SELECT 'Canadian Nepali Mahila Chautari (CNMC) is a non-profit social organization that was inaugurated by MPP Harinder Malli on August, 2017 with Miss Gita Dawadi (Dhakal) and Miss Gita Sharma acting as President and Vice President respectively in the inaugural convention. Initially 14 individual comprised the board members and 10 other members. Currently, 16 members comprise the board and 97 members constitute mostly life members.

This social organization strives on serving the Nepalese community that is residing and facing problems in regards to their Canadian residence. Most recently, Miss Ambika Gyawali was elected as the president with the founding president Miss Gita Dawadi elected as the Chairman.

This organization strives on delivering its service as a non-profit organization in helping Nepalese individuals. We are continually focused on expanding our services to further Nepalese across Canada. As per our name, we conduct meetings & seminars to discuss potential activities in serving the community.'::text AS txt) t
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- Objectives (plain jsonb cast, no polymorphic function needed)
INSERT INTO public.site_settings (key, value)
SELECT 'objectives', '[
  {"icon": "Globe",         "text": "To provide a range of supports to newcomers that help with the transition of adjusting to socio cultural life in Canada."},
  {"icon": "Users",         "text": "To focus programming which promote community strengths and resident engagement to foster positive change."},
  {"icon": "HeartHandshake","text": "To focus programming to as per communities change and grow, given this situation, main priority is to provide responsive, culturally-sensitive and effective programs, and services."},
  {"icon": "Network",       "text": "Help establishing synergies of collaboration between women\u2019s organization, organizations having similar objectives for networking, exchange of knowledge, and best practices."},
  {"icon": "Heart",         "text": "Help to understand always women hold the key role to family\u2019s well-being in community. So, given the fact create a support system, we offer a discussion, and interaction opportunities realizing what\u2019s most important."},
  {"icon": "PartyPopper",   "text": "To focus programming International women day, Canada day, Nepali Women festival TEEJ, New year celebration, family day, mother day, festivals in order to promote Canadian Nepali culture."}
]'::jsonb
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();
