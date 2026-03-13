import { createClient } from '@/lib/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', email)
      .single()

    if (existing) {
      if (existing.is_active) {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 400 }
        )
      }
      // Reactivate subscription
      await supabase
        .from('newsletter_subscribers')
        .update({ is_active: true })
        .eq('id', existing.id)
    } else {
      // Create new subscription
      const { error } = await supabase.from('newsletter_subscribers').insert({
        email,
      })

      if (error) {
        console.error('Database error:', error)
        return NextResponse.json(
          { error: 'Failed to subscribe' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
