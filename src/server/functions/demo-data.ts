import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from './auth'
import { db } from '@/server/lib/db'
import { Query } from 'node-appwrite'

/**
 * Demo Data Seeder
 * Creates sample students and habit entries for demonstration purposes
 */

const DEMO_STUDENTS = [
  { firstName: 'Emma', lastName: 'Johnson', studentId: 'STU001', grade: '5th' },
  {
    firstName: 'Liam',
    lastName: 'Williams',
    studentId: 'STU002',
    grade: '5th',
  },
  { firstName: 'Olivia', lastName: 'Brown', studentId: 'STU003', grade: '6th' },
  { firstName: 'Noah', lastName: 'Davis', studentId: 'STU004', grade: '6th' },
  { firstName: 'Ava', lastName: 'Miller', studentId: 'STU005', grade: '5th' },
]

/**
 * Generate realistic habit scores with some variation
 * Creates students with different performance profiles
 */
function generateHabitScores(studentIndex: number, entryIndex: number) {
  // Create different student profiles
  const profiles = [
    // High performer - mostly 3s and 4s
    { base: 3.5, variance: 0.7 },
    // Struggling student - mostly 2s and 3s
    { base: 2.3, variance: 0.8 },
    // Excellent student - mostly 4s
    { base: 3.8, variance: 0.4 },
    // Inconsistent student - wide range
    { base: 2.8, variance: 1.2 },
    // Improving student - starts low, trends up
    { base: 2.5 + entryIndex * 0.15, variance: 0.6 },
  ]

  const profile = profiles[studentIndex % profiles.length]

  // Generate scores for each habit with some randomness
  const habits = [
    'selfReflection',
    'timeManagement',
    'organization',
    'taskCompletion',
    'attention',
    'followDirections',
    'problemSolving',
    'independence',
    'cooperation',
    'socialSkills',
    'workQuality',
    'workPace',
  ]

  const scores: Record<string, number> = {}

  habits.forEach((habit, index) => {
    // Add some variation per skill (some students are better at certain things)
    const skillModifier = Math.sin(index + studentIndex) * 0.5
    let score =
      profile.base + skillModifier + (Math.random() - 0.5) * profile.variance

    // Clamp to 1-4 range
    score = Math.max(1, Math.min(4, Math.round(score)))

    scores[habit] = score
  })

  return scores
}

/**
 * Generate entries over the past 30 days with some gaps (realistic)
 */
function generateEntryDates(count: number): number[] {
  const dates: number[] = []
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000

  for (let i = 0; i < count; i++) {
    // Go back in time, but skip some days (weekends, absences)
    const daysBack = i * 1.5 // Creates gaps
    const timestamp = now - Math.floor(daysBack * oneDay)
    dates.push(timestamp)
  }

  return dates.reverse() // Oldest first
}

/**
 * Seed demo data for the current user
 */
export const seedDemoDataFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    try {
      // Check if demo data already exists
      const existingStudents = await db.students.list([
        Query.equal('createdBy', [currentUser.$id]),
      ])

      if (existingStudents.rows.length > 0) {
        return {
          success: false,
          message: 'Demo data already exists. Clear your data first to reseed.',
          studentsCreated: 0,
          entriesCreated: 0,
        }
      }

      const createdStudents = []
      let totalEntries = 0

      // Create demo students
      for (const studentData of DEMO_STUDENTS) {
        const student = await db.students.create({
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          studentId: studentData.studentId,
          grade: studentData.grade,
          active: true,
          createdBy: currentUser.$id,
        })

        createdStudents.push(student)
      }

      // Create habit entries for each student (20 entries over ~30 days)
      const entryDates = generateEntryDates(20)

      for (
        let studentIndex = 0;
        studentIndex < createdStudents.length;
        studentIndex++
      ) {
        const student = createdStudents[studentIndex]

        for (let entryIndex = 0; entryIndex < entryDates.length; entryIndex++) {
          const scores = generateHabitScores(studentIndex, entryIndex)

          await db.habitEntries.create({
            studentId: student.$id,
            entryDate: entryDates[entryIndex],
            selfReflection: scores.selfReflection,
            timeManagement: scores.timeManagement,
            organization: scores.organization,
            taskCompletion: scores.taskCompletion,
            attention: scores.attention,
            followDirections: scores.followDirections,
            problemSolving: scores.problemSolving,
            independence: scores.independence,
            cooperation: scores.cooperation,
            socialSkills: scores.socialSkills,
            workQuality: scores.workQuality,
            workPace: scores.workPace,
            notes: entryIndex % 5 === 0 ? 'Great progress this week!' : null,
            createdBy: currentUser.$id,
          })

          totalEntries++
        }
      }

      return {
        success: true,
        message: 'Demo data created successfully!',
        studentsCreated: createdStudents.length,
        entriesCreated: totalEntries,
      }
    } catch (error) {
      console.error('Error seeding demo data:', error)
      throw new Error(
        `Failed to seed demo data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  },
)

/**
 * Clear all data for the current user
 */
export const clearAllDataFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    try {
      // Delete all habit entries
      const entries = await db.habitEntries.list([
        Query.equal('createdBy', [currentUser.$id]),
      ])

      for (const entry of entries.rows) {
        await db.habitEntries.delete(entry.$id)
      }

      // Delete all students
      const students = await db.students.list([
        Query.equal('createdBy', [currentUser.$id]),
      ])

      for (const student of students.rows) {
        await db.students.delete(student.$id)
      }

      return {
        success: true,
        message: 'All data cleared successfully',
        studentsDeleted: students.rows.length,
        entriesDeleted: entries.rows.length,
      }
    } catch (error) {
      console.error('Error clearing data:', error)
      throw new Error(
        `Failed to clear data: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  },
)
