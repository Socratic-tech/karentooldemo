import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from './auth'
import { db } from '@/server/lib/db'
import { Query } from 'node-appwrite'

// Schema for creating a habit entry
const createHabitEntrySchema = z.object({
  studentId: z.string(),
  entryDate: z.number(), // Unix timestamp
  selfReflection: z.number().min(1).max(4).optional(),
  timeManagement: z.number().min(1).max(4).optional(),
  organization: z.number().min(1).max(4).optional(),
  taskCompletion: z.number().min(1).max(4).optional(),
  attention: z.number().min(1).max(4).optional(),
  followDirections: z.number().min(1).max(4).optional(),
  problemSolving: z.number().min(1).max(4).optional(),
  independence: z.number().min(1).max(4).optional(),
  cooperation: z.number().min(1).max(4).optional(),
  socialSkills: z.number().min(1).max(4).optional(),
  workQuality: z.number().min(1).max(4).optional(),
  workPace: z.number().min(1).max(4).optional(),
  notes: z.string().max(1000).nullable().optional(),
})

// Schema for updating a habit entry
const updateHabitEntrySchema = z.object({
  id: z.string(),
  selfReflection: z.number().min(1).max(4).optional(),
  timeManagement: z.number().min(1).max(4).optional(),
  organization: z.number().min(1).max(4).optional(),
  taskCompletion: z.number().min(1).max(4).optional(),
  attention: z.number().min(1).max(4).optional(),
  followDirections: z.number().min(1).max(4).optional(),
  problemSolving: z.number().min(1).max(4).optional(),
  independence: z.number().min(1).max(4).optional(),
  cooperation: z.number().min(1).max(4).optional(),
  socialSkills: z.number().min(1).max(4).optional(),
  workQuality: z.number().min(1).max(4).optional(),
  workPace: z.number().min(1).max(4).optional(),
  notes: z.string().max(1000).nullable().optional(),
})

// Create a new habit entry
export const createHabitEntryFn = createServerFn({ method: 'POST' })
  .inputValidator(createHabitEntrySchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Verify student ownership
    const student = await db.students.get(data.studentId)
    if (student.createdBy !== currentUser.$id) {
      throw new Error('Unauthorized')
    }

    const entry = await db.habitEntries.create({
      studentId: data.studentId,
      entryDate: data.entryDate,
      selfReflection: data.selfReflection ?? 0,
      timeManagement: data.timeManagement ?? 0,
      organization: data.organization ?? 0,
      taskCompletion: data.taskCompletion ?? 0,
      attention: data.attention ?? 0,
      followDirections: data.followDirections ?? 0,
      problemSolving: data.problemSolving ?? 0,
      independence: data.independence ?? 0,
      cooperation: data.cooperation ?? 0,
      socialSkills: data.socialSkills ?? 0,
      workQuality: data.workQuality ?? 0,
      workPace: data.workPace ?? 0,
      notes: data.notes?.trim() || null,
      createdBy: currentUser.$id,
    })

    return { entry }
  })

// List habit entries for a student
export const listHabitEntriesFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ studentId: z.string() }))
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Verify student ownership
    const student = await db.students.get(data.studentId)
    if (student.createdBy !== currentUser.$id) {
      throw new Error('Unauthorized')
    }

    const result = await db.habitEntries.list([
      Query.equal('studentId', [data.studentId]),
      Query.orderDesc('entryDate'),
    ])

    return { entries: result.rows }
  })

// List all habit entries for current user
export const listAllHabitEntriesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    const result = await db.habitEntries.list([
      Query.equal('createdBy', [currentUser.$id]),
      Query.orderDesc('entryDate'),
    ])

    return { entries: result.rows }
  },
)

// Get a single habit entry
export const getHabitEntryFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    const entry = await db.habitEntries.get(data.id)

    // Verify ownership
    if (entry.createdBy !== currentUser.$id) {
      throw new Error('Unauthorized')
    }

    return { entry }
  })

// Update a habit entry
export const updateHabitEntryFn = createServerFn({ method: 'POST' })
  .inputValidator(updateHabitEntrySchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    const { id, ...updates } = data

    // Verify ownership
    const existing = await db.habitEntries.get(id)
    if (existing.createdBy !== currentUser.$id) {
      throw new Error('Unauthorized')
    }

    // Clean notes field
    const cleanUpdates: Record<string, unknown> = { ...updates }
    if (updates.notes !== undefined) {
      cleanUpdates.notes = updates.notes?.trim() || null
    }

    const entry = await db.habitEntries.update(id, cleanUpdates)

    return { entry }
  })

// Delete a habit entry
export const deleteHabitEntryFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Verify ownership
    const existing = await db.habitEntries.get(data.id)
    if (existing.createdBy !== currentUser.$id) {
      throw new Error('Unauthorized')
    }

    await db.habitEntries.delete(data.id)

    return { success: true }
  })
