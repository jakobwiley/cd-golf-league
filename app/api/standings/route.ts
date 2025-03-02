import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    // Get all teams with their matches
    const teams = await prisma.team.findMany({
      include: {
        homeMatches: {
          include: {
            points: true,
          },
        },
        awayMatches: {
          include: {
            points: true,
          },
        },
      },
    })

    // Calculate standings for each team
    const standings = teams.map(team => {
      const allMatches = [...team.homeMatches, ...team.awayMatches]
      const matchesPlayed = allMatches.length

      // Group points by week
      const weeklyPoints = allMatches.reduce((acc, match) => {
        const points = match.points.find(p => p.teamId === team.id)?.points || 0
        const weekNumber = match.weekNumber

        if (!acc[weekNumber]) {
          acc[weekNumber] = 0
        }
        acc[weekNumber] += points
        return acc
      }, {} as Record<number, number>)

      // Convert weekly points to array format
      const weeklyPointsArray = Object.entries(weeklyPoints).map(([week, points]) => ({
        weekNumber: parseInt(week),
        points: Number(points),
      }))

      // Calculate total points
      const totalPoints = weeklyPointsArray.reduce((sum, week) => sum + week.points, 0)

      return {
        id: team.id,
        name: team.name,
        totalPoints,
        matchesPlayed,
        weeklyPoints: weeklyPointsArray,
      }
    })

    // Sort by total points (descending)
    standings.sort((a, b) => b.totalPoints - a.totalPoints)

    return NextResponse.json(standings)
  } catch (error) {
    console.error('Error calculating standings:', error)
    return NextResponse.json(
      { error: 'Failed to calculate standings' },
      { status: 500 }
    )
  }
} 