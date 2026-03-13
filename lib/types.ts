export interface BoardMember {
  id: string
  name: string
  position: string
  bio: string | null
  image_url: string | null
  email: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string | null
  content: string | null
  event_date: string
  event_time: string | null
  location: string | null
  image_url: string | null
  is_featured: boolean
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: string
  title: string | null
  description: string | null
  image_url: string
  event_id: string | null
  display_order: number
  is_published: boolean
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  is_active: boolean
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  is_active: boolean
  subscribed_at: string
}

export interface SiteSettings {
  id: string
  key: string
  value: string | null
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  full_name: string | null
  role: 'super_admin' | 'admin' | 'editor'
  is_active: boolean
  created_at: string
  updated_at: string
}
