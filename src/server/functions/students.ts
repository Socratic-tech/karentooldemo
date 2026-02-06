import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { authMiddleware } from './auth'
import { db } from '@/server/lib/db'
import { Query } from 'node-appwrite'

// Schema for creating a student
const createStudentSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  studentId: z.string().max(50).nullable().optional(),
  grade: z.string().max(20).nullable().optional(),
  active: z.boolean().default(true),
})

// Schema for updating a student
const updateStudentSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  studentId: z.string().max(50).nullable().optional(),
  grade: z.string().max(20).nullable().optional(),
  active: z.boolean().optional(),
})

// Create a new student
export const createStudentFn = createServerFn({ method: 'POST' })
  .inputValidator(createStudentSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    const student = await db.students.create({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      studentId: data.studentId?.trim() || null,
      grade: data.grade?.trim() || null,
      active: data.active,
      createdBy: currentUser.$id,
    })

    return { student }
  })

// List all students for current user
export const listStudentsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    const result = await db.students.list([
      Query.equal('createdBy', [currentUser.$id]),
      Query.orderDesc('$createdAt'),
    ])

    return { students: result.rows }
  },
)

// List only active students
export const listActiveStudentsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    const result = await db.students.list([
      Query.equal('createdBy', [currentUser.$id]),
      Query.equal('active', [true]),
      Query.orderAsc('lastName'),
    ])

    return { students: result.rows }
  },
)

// Get a single student
export const getStudentFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    const student = await db.students.get(data.id)

    // Verify ownership
    if (student.createdBy !== currentUser.$id) {
      throw new Error('Unauthorized')
    }

    return { student }
  })

// Update a student
export const updateStudentFn = createServerFn({ method: 'POST' })
  .inputValidator(updateStudentSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    const { id, ...updates } = data

    // Verify ownership
    const existing = await db.students.get(id)
    if (existing.createdBy !== currentUser.$id) {
      throw new Error('Unauthorized')
    }

    // Trim string fields
    const cleanUpdates: Record<string, unknown> = {}
    if (updates.firstName) cleanUpdates.firstName = updates.firstName.trim()
    if (updates.lastName) cleanUpdates.lastName = updates.lastName.trim()
    if (updates.studentId !== undefined)
      cleanUpdates.studentId = updates.studentId?.trim() || null
    if (updates.grade !== undefined)
      cleanUpdates.grade = updates.grade?.trim() || null
    if (updates.active !== undefined) cleanUpdates.active = updates.active

    const student = await db.students.update(id, cleanUpdates)

    return { student }
  })

// Delete a student
export const deleteStudentFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    // Verify ownership
    const existing = await db.students.get(data.id)
    if (existing.createdBy !== currentUser.$id) {
      throw new Error('Unauthorized')
    }

    await db.students.delete(data.id)

    return { success: true }
  })
