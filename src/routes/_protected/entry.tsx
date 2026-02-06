import { createFileRoute } from '@tanstack/react-router'
import { listActiveStudentsFn } from '@/server/functions/students'
import { HabitEntryForm } from '@/components/habit-entry-form'
import { AppNavigation } from '@/components/app-navigation'

export const Route = createFileRoute('/_protected/entry')({
  loader: async () => {
    const { students } = await listActiveStudentsFn()
    return { students }
  },
  component: EntryPage,
})

function EntryPage() {
  const { students } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppNavigation />

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-indigo-900 mb-2">
            Daily Habit Entry
          </h2>
          <p className="text-gray-600 text-lg">
            Record work habits for a student using the 1-4 rating scale
          </p>
        </div>

        <HabitEntryForm students={students} />
      </div>
    </div>
  )
}
