import { NextResponse } from 'next/server'
import { supabase } from '../../../../lib/supabase'

export async function DELETE() {
  try {
    // Delete all matches
    const { error } = await supabase
      .from('Match')
      .delete()
      .neq('id', '')

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing schedule:', error)
    return NextResponse.json(
      { error: 'Failed to clear schedule' },
      { status: 500 }
    )
  }
}