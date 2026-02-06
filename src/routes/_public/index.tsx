import { createFileRoute, redirect } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { authMiddleware } from '@/server/functions/auth'

export const Route = createFileRoute('/_public/')({
  loader: async () => {
    const { currentUser } = await authMiddleware()

    // Redirect authenticated users to entry page
    if (currentUser) {
      throw redirect({ to: '/entry' })
    }

    return {}
  },
  component: HomePage,
})

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
            Work Habits Dashboard
          </h1>
          <p className="text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
            Track, visualize, and improve student work habits with a
            privacy-first, school-owned system
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-white mb-3">Daily Entry</h3>
            <p className="text-purple-200">
              Quick habit tracking for 12 essential work skills with simple 1-4
              rating scales
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-3">
              Visual Dashboard
            </h3>
            <p className="text-purple-200">
              See trends, monthly averages, and skill breakdowns at a glance
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-3">Privacy First</h3>
            <p className="text-purple-200">
              School-owned data, secure authentication, full control over
              student information
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            to="/sign-in"
            className="inline-block bg-white text-purple-900 px-10 py-4 rounded-full text-lg font-bold hover:bg-purple-100 transition-all transform hover:scale-105 shadow-2xl"
          >
            Get Started
          </Link>
          <p className="text-purple-300 mt-6">
            New user?{' '}
            <Link to="/sign-up" className="text-white font-semibold underline">
              Create an account
            </Link>
          </p>
        </div>

        {/* Skills List */}
        <div className="mt-20 bg-white/5 backdrop-blur-lg rounded-2xl p-10 border border-white/10">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            12 Essential Work Habits
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Self-Reflection',
              'Time Management',
              'Organization',
              'Task Completion',
              'Attention',
              'Follow Directions',
              'Problem Solving',
              'Independence',
              'Cooperation',
              'Social Skills',
              'Work Quality',
              'Work Pace',
            ].map((skill) => (
              <div
                key={skill}
                className="flex items-center gap-3 text-purple-100"
              >
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-lg">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
