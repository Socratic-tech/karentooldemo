import { createFileRoute } from '@tanstack/react-router'
import { listStudentsFn } from '@/server/functions/students'
import { StudentManagement } from '@/components/student-management'
import { AppNavigation } from '@/components/app-navigation'
import { DemoDataControls } from '@/components/demo-data-controls'

export const Route = createFileRoute('/_protected/admin')({
  loader: async () => {
    const { students } = await listStudentsFn()
    return { students }
  },
  component: AdminPage,
})

function AdminPage() {
  const { students } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50">
      <AppNavigation />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-green-900 mb-2">
            Admin Panel
          </h2>
          <p className="text-gray-600 text-lg">
            Manage student roster and system settings
          </p>
        </div>

        {/* Demo Data Controls */}
        <div className="mb-6">
          <DemoDataControls />
        </div>

        <StudentManagement students={students} />
      </div>
    </div>
  )
}
