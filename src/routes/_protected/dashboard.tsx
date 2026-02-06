import { createFileRoute } from '@tanstack/react-router'
import { listAllHabitEntriesFn } from '@/server/functions/habit-entries'
import { listStudentsFn } from '@/server/functions/students'
import { HabitsDashboard } from '@/components/habits-dashboard'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_protected/dashboard')({
  loader: async () => {
    const [{ entries }, { students }] = await Promise.all([
      listAllHabitEntriesFn(),
      listStudentsFn(),
    ])
    return { entries, students }
  },
  component: DashboardPage,
})

function DashboardPage() {
  const { entries, students } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-purple-900">
              Work Habits Tracker
            </h1>
            <div className="flex gap-3">
              <Link to="/entry">
                <Button variant="outline">Entry</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="default">Dashboard</Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline">Admin</Button>
              </Link>
              <Link to="/sign-out">
                <Button variant="ghost">Sign Out</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-purple-900 mb-2">
            Work Habits Dashboard
          </h2>
          <p className="text-gray-600 text-lg">
            Visualize trends, identify strengths, and track areas for growth
          </p>
        </div>

        <HabitsDashboard entries={entries} students={students} />
      </div>
    </div>
  )
}
