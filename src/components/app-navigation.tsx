import { Link, useRouterState } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function AppNavigation() {
  const router = useRouterState()
  const currentPath = router.location.pathname

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Work Habits Tracker
          </h1>
          <div className="flex gap-3">
            <Link to="/entry">
              <Button
                variant={currentPath === '/entry' ? 'default' : 'outline'}
              >
                Entry
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant={currentPath === '/dashboard' ? 'default' : 'outline'}
              >
                Dashboard
              </Button>
            </Link>
            <Link to="/admin">
              <Button
                variant={currentPath === '/admin' ? 'default' : 'outline'}
              >
                Admin
              </Button>
            </Link>
            <Link to="/sign-out">
              <Button variant="ghost">Sign Out</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
