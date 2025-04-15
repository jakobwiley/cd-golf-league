require('cross-fetch/polyfill')
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function clearMatches() {
  try {
    console.log('Clearing all matches...')

    // Delete in order to respect foreign key constraints
    console.log('Deleting match scores...')
    const { error: scoreError } = await supabase
      .from('MatchScore')
      .delete()
      .neq('id', '')
    
    if (scoreError) {
      throw new Error(`Error deleting match scores: ${scoreError.message}`)
    }
    console.log('Match scores deleted')

    console.log('Deleting match points...')
    const { error: pointsError } = await supabase
      .from('MatchPoints')
      .delete()
      .neq('id', '')
    
    if (pointsError) {
      throw new Error(`Error deleting match points: ${pointsError.message}`)
    }
    console.log('Match points deleted')

    console.log('Deleting match players...')
    const { error: playersError } = await supabase
      .from('MatchPlayer')
      .delete()
      .neq('id', '')
    
    if (playersError) {
      throw new Error(`Error deleting match players: ${playersError.message}`)
    }
    console.log('Match players deleted')

    console.log('Deleting matches...')
    const { error: matchError } = await supabase
      .from('Match')
      .delete()
      .neq('id', '')
    
    if (matchError) {
      throw new Error(`Error deleting matches: ${matchError.message}`)
    }
    console.log('Matches deleted')

    console.log('Successfully cleared all matches and related data')
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

clearMatches() 