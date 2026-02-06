import { type Models } from 'node-appwrite'

export type Students = Models.Row & {
  createdBy: string
  firstName: string
  lastName: string
  studentId: string | null
  grade: string | null
  active: boolean
}

export type HabitEntries = Models.Row & {
  createdBy: string
  studentId: string
  entryDate: number
  selfReflection: number
  timeManagement: number
  organization: number
  taskCompletion: number
  attention: number
  followDirections: number
  problemSolving: number
  independence: number
  cooperation: number
  socialSkills: number
  workQuality: number
  workPace: number
  notes: string | null
}
