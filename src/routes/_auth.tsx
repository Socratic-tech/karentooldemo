import { redirect } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { authMiddleware } from '@/server/functions/auth'

export const Route = createFileRoute('/_auth')({
  loader: async () => {
    const { currentUser } = await authMiddleware()

    if (currentUser) {
      throw redirect({ to: '/entry' })
    }

    return {
      currentUser,
    }
  },
})
