import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createHabitEntryFn } from '@/server/functions/habit-entries'
import { useRouter } from '@tanstack/react-router'
import type { Students } from '@/server/lib/appwrite.types'
import { AlertTriangle, TrendingUp, CheckCircle2 } from 'lucide-react'

const habitEntrySchema = z.object({
  studentId: z.string().min(1, 'Please select a student'),
  selfReflection: z.string().optional(),
  timeManagement: z.string().optional(),
  organization: z.string().optional(),
  taskCompletion: z.string().optional(),
  attention: z.string().optional(),
  followDirections: z.string().optional(),
  problemSolving: z.string().optional(),
  independence: z.string().optional(),
  cooperation: z.string().optional(),
  socialSkills: z.string().optional(),
  workQuality: z.string().optional(),
  workPace: z.string().optional(),
  notes: z.string().optional(),
})

type HabitEntryFormData = z.infer<typeof habitEntrySchema>

const HABIT_FIELDS = [
  { key: 'selfReflection', label: 'Self-Reflection' },
  { key: 'timeManagement', label: 'Time Management' },
  { key: 'organization', label: 'Organization' },
  { key: 'taskCompletion', label: 'Task Completion' },
  { key: 'attention', label: 'Attention' },
  { key: 'followDirections', label: 'Follow Directions' },
  { key: 'problemSolving', label: 'Problem Solving' },
  { key: 'independence', label: 'Independence' },
  { key: 'cooperation', label: 'Cooperation' },
  { key: 'socialSkills', label: 'Social Skills' },
  { key: 'workQuality', label: 'Work Quality' },
  { key: 'workPace', label: 'Work Pace' },
] as const

const RATING_OPTIONS = [
  {
    value: '1',
    label: '1 - Needs Improvement',
    color: 'text-red-600',
    icon: AlertTriangle,
  },
  {
    value: '2',
    label: '2 - Developing',
    color: 'text-orange-600',
    icon: AlertTriangle,
  },
  {
    value: '3',
    label: '3 - Proficient',
    color: 'text-blue-600',
    icon: CheckCircle2,
  },
  {
    value: '4',
    label: '4 - Exemplary',
    color: 'text-green-600',
    icon: TrendingUp,
  },
]

interface HabitEntryFormProps {
  students: Students[]
}

export function HabitEntryForm({ students }: HabitEntryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<HabitEntryFormData>({
    resolver: zodResolver(habitEntrySchema),
    defaultValues: {
      studentId: '',
      selfReflection: '',
      timeManagement: '',
      organization: '',
      taskCompletion: '',
      attention: '',
      followDirections: '',
      problemSolving: '',
      independence: '',
      cooperation: '',
      socialSkills: '',
      workQuality: '',
      workPace: '',
      notes: '',
    },
  })

  // Watch all habit fields to show summary
  const watchedValues = form.watch()

  // Calculate current average
  const currentAverage = (() => {
    const habitValues = HABIT_FIELDS.map((field) => {
      const value = watchedValues[field.key as keyof HabitEntryFormData]
      return value ? parseInt(value as string) : 0
    }).filter((v) => v > 0)

    if (habitValues.length === 0) return null
    return (
      habitValues.reduce((sum, v) => sum + v, 0) / habitValues.length
    ).toFixed(2)
  })()

  const onSubmit = async (data: HabitEntryFormData) => {
    setIsSubmitting(true)
    try {
      await createHabitEntryFn({
        data: {
          studentId: data.studentId,
          entryDate: Date.now(),
          selfReflection: data.selfReflection
            ? parseInt(data.selfReflection)
            : undefined,
          timeManagement: data.timeManagement
            ? parseInt(data.timeManagement)
            : undefined,
          organization: data.organization
            ? parseInt(data.organization)
            : undefined,
          taskCompletion: data.taskCompletion
            ? parseInt(data.taskCompletion)
            : undefined,
          attention: data.attention ? parseInt(data.attention) : undefined,
          followDirections: data.followDirections
            ? parseInt(data.followDirections)
            : undefined,
          problemSolving: data.problemSolving
            ? parseInt(data.problemSolving)
            : undefined,
          independence: data.independence
            ? parseInt(data.independence)
            : undefined,
          cooperation: data.cooperation
            ? parseInt(data.cooperation)
            : undefined,
          socialSkills: data.socialSkills
            ? parseInt(data.socialSkills)
            : undefined,
          workQuality: data.workQuality
            ? parseInt(data.workQuality)
            : undefined,
          workPace: data.workPace ? parseInt(data.workPace) : undefined,
          notes: data.notes || null,
        },
      })

      // Reset form
      form.reset()

      // Refresh and show success
      await router.invalidate()
      alert('Habit entry saved successfully!')
    } catch (error) {
      console.error('Failed to save entry:', error)
      alert('Failed to save entry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (students.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">
            No students found. Please add students in the Admin panel first.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Student Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Student</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a student..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.$id} value={student.$id}>
                          {student.lastName}, {student.firstName}
                          {student.grade && ` (Grade ${student.grade})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Current Progress Indicator */}
        {currentAverage && (
          <Card
            className={
              parseFloat(currentAverage) < 3
                ? 'border-orange-200 bg-orange-50'
                : parseFloat(currentAverage) > 3
                  ? 'border-green-200 bg-green-50'
                  : 'border-blue-200 bg-blue-50'
            }
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {parseFloat(currentAverage) < 3 ? (
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  ) : parseFloat(currentAverage) > 3 ? (
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Current Average
                    </p>
                    <p className="text-2xl font-bold">{currentAverage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    {parseFloat(currentAverage) < 3
                      ? 'Needs attention - focus on improvement areas'
                      : parseFloat(currentAverage) > 3
                        ? 'Excellent work - celebrate these strengths!'
                        : 'Proficient - meeting expectations'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Habit Ratings */}
        <Card>
          <CardHeader>
            <CardTitle>Work Habits Assessment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {HABIT_FIELDS.map((habit) => {
                const currentValue = watchedValues[
                  habit.key as keyof HabitEntryFormData
                ] as string
                const numValue = currentValue ? parseInt(currentValue) : 0

                return (
                  <FormField
                    key={habit.key}
                    control={form.control}
                    name={habit.key as keyof HabitEntryFormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          {habit.label}
                          {numValue > 0 &&
                            (numValue < 3 ? (
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                            ) : numValue > 3 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 text-blue-600" />
                            ))}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value as string}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={
                                numValue > 0
                                  ? numValue < 3
                                    ? 'border-orange-300 bg-orange-50'
                                    : numValue > 3
                                      ? 'border-green-300 bg-green-50'
                                      : 'border-blue-300 bg-blue-50'
                                  : ''
                              }
                            >
                              <SelectValue placeholder="Rate..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RATING_OPTIONS.map((option) => {
                              const Icon = option.icon
                              return (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  className={option.color}
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4" />
                                    {option.label}
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Add any observations or comments..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
