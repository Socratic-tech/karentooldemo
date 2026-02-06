import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Database, Trash2, Loader2, Sparkles } from 'lucide-react'
import { useServerFn } from '@tanstack/react-start'
import { seedDemoDataFn, clearAllDataFn } from '@/server/functions/demo-data'
import { toast } from 'sonner'
import { useRouter } from '@tanstack/react-router'

export function DemoDataControls() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const seedDemo = useServerFn(seedDemoDataFn)
  const clearData = useServerFn(clearAllDataFn)
  const router = useRouter()

  const handleSeedDemo = async () => {
    setIsSeeding(true)
    try {
      const result = await seedDemo()
      if (result.success) {
        toast.success(result.message, {
          description: `Created ${result.studentsCreated} students with ${result.entriesCreated} habit entries`,
        })
        await router.invalidate()
      } else {
        toast.warning(result.message)
      }
    } catch (error) {
      toast.error('Failed to seed demo data', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setIsSeeding(false)
    }
  }

  const handleClearData = async () => {
    setIsClearing(true)
    try {
      const result = await clearData()
      toast.success(result.message, {
        description: `Deleted ${result.studentsDeleted} students and ${result.entriesDeleted} entries`,
      })
      await router.invalidate()
    } catch (error) {
      toast.error('Failed to clear data', {
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <Card className="border-dashed border-2 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <CardTitle>Demo Data</CardTitle>
        </div>
        <CardDescription>
          Populate your dashboard with sample students and habit entries to
          explore all features
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleSeedDemo}
          disabled={isSeeding || isClearing}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isSeeding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Demo Data...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Load Demo Data
            </>
          )}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              disabled={isSeeding || isClearing}
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              {isClearing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All Data
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all students and habit entries from
                your account. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearData}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
