import { useMemo } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
} from 'recharts'
import type { HabitEntries, Students } from '@/server/lib/appwrite.types'
import { format } from 'date-fns'
import { AlertTriangle, Trophy, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface HabitsDashboardProps {
  entries: HabitEntries[]
  students: Students[]
}

const HABIT_LABELS = {
  selfReflection: 'Self-Reflection',
  timeManagement: 'Time Management',
  organization: 'Organization',
  taskCompletion: 'Task Completion',
  attention: 'Attention',
  followDirections: 'Follow Directions',
  problemSolving: 'Problem Solving',
  independence: 'Independence',
  cooperation: 'Cooperation',
  socialSkills: 'Social Skills',
  workQuality: 'Work Quality',
  workPace: 'Work Pace',
}

export function HabitsDashboard({ entries, students }: HabitsDashboardProps) {
  // Calculate overall averages
  const overallAverages = useMemo(() => {
    if (entries.length === 0) return []

    const habits = Object.keys(HABIT_LABELS) as Array<keyof typeof HABIT_LABELS>

    return habits
      .map((habit) => {
        // Only include non-zero values (rated skills)
        const ratedValues = entries.map((e) => e[habit]).filter((v) => v > 0)
        if (ratedValues.length === 0) return null

        const sum = ratedValues.reduce((acc, val) => acc + val, 0)
        const avg = sum / ratedValues.length

        return {
          habit: HABIT_LABELS[habit],
          average: parseFloat(avg.toFixed(2)),
          status:
            avg < 3 ? 'needs-attention' : avg > 3 ? 'excellent' : 'proficient',
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  }, [entries])

  // Calculate monthly trends
  const monthlyTrends = useMemo(() => {
    if (entries.length === 0) return []

    // Group entries by month
    const monthlyData = entries.reduce(
      (acc, entry) => {
        const date = new Date(entry.entryDate)
        const monthKey = format(date, 'yyyy-MM')

        if (!acc[monthKey]) {
          acc[monthKey] = []
        }
        acc[monthKey].push(entry)
        return acc
      },
      {} as Record<string, typeof entries>,
    )

    // Calculate average for each month
    return Object.entries(monthlyData)
      .map(([month, monthEntries]) => {
        const habits = Object.keys(HABIT_LABELS) as Array<
          keyof typeof HABIT_LABELS
        >

        // Calculate overall average for the month (only rated skills)
        const allRatedValues = monthEntries.flatMap((entry) =>
          habits.map((h) => entry[h]).filter((v) => v > 0),
        )

        const monthAvg =
          allRatedValues.length > 0
            ? allRatedValues.reduce((sum, val) => sum + val, 0) /
              allRatedValues.length
            : 0

        return {
          month,
          average: parseFloat(monthAvg.toFixed(2)),
        }
      })
      .sort((a, b) => a.month.localeCompare(b.month))
  }, [entries])

  // Calculate student performance
  const studentPerformance = useMemo(() => {
    if (entries.length === 0 || students.length === 0) return []

    return students
      .map((student) => {
        const studentEntries = entries.filter(
          (e) => e.studentId === student.$id,
        )

        if (studentEntries.length === 0) return null

        const habits = Object.keys(HABIT_LABELS) as Array<
          keyof typeof HABIT_LABELS
        >
        const totalAvg =
          studentEntries.reduce((sum, entry) => {
            const entryAvg =
              habits.reduce((s, h) => s + entry[h], 0) / habits.length
            return sum + entryAvg
          }, 0) / studentEntries.length

        return {
          name: `${student.firstName} ${student.lastName}`,
          average: parseFloat(totalAvg.toFixed(2)),
          entries: studentEntries.length,
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => b.average - a.average)
  }, [entries, students])

  // Radar chart data for skill distribution
  const skillDistribution = useMemo(() => {
    if (entries.length === 0) return []

    const habits = Object.keys(HABIT_LABELS) as Array<keyof typeof HABIT_LABELS>

    return habits
      .map((habit) => {
        // Only include non-zero values (rated skills)
        const ratedValues = entries.map((e) => e[habit]).filter((v) => v > 0)
        if (ratedValues.length === 0) return null

        const sum = ratedValues.reduce((acc, val) => acc + val, 0)
        const avg = sum / ratedValues.length

        return {
          skill: HABIT_LABELS[habit],
          score: parseFloat(avg.toFixed(2)),
          status:
            avg < 3 ? 'needs-attention' : avg > 3 ? 'excellent' : 'proficient',
        }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  }, [entries])

  // Separate skills by performance level
  const skillsByPerformance = useMemo(() => {
    return {
      needsAttention: overallAverages.filter(
        (s) => s.status === 'needs-attention',
      ),
      excellent: overallAverages.filter((s) => s.status === 'excellent'),
      proficient: overallAverages.filter((s) => s.status === 'proficient'),
    }
  }, [overallAverages])

  if (entries.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-2">No data available yet</p>
            <p className="text-sm text-gray-500">
              Start entering habit data to see visualizations
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-purple-600">
              {entries.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600">
              {new Set(entries.map((e) => e.studentId)).size}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Overall Average</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">
              {overallAverages.length > 0
                ? (
                    overallAverages.reduce((sum, h) => sum + h.average, 0) /
                    overallAverages.length
                  ).toFixed(2)
                : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Alerts */}
      {(skillsByPerformance.needsAttention.length > 0 ||
        skillsByPerformance.excellent.length > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Needs Attention */}
          {skillsByPerformance.needsAttention.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <AlertTriangle className="h-5 w-5" />
                  Skills Needing Attention
                </CardTitle>
                <CardDescription>
                  Areas scoring below 3.0 - focus here for improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {skillsByPerformance.needsAttention.map((skill) => (
                    <div
                      key={skill.habit}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
                    >
                      <span className="font-medium text-gray-900">
                        {skill.habit}
                      </span>
                      <Badge variant="destructive" className="bg-orange-600">
                        {skill.average.toFixed(2)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Excellent Performance */}
          {skillsByPerformance.excellent.length > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Trophy className="h-5 w-5" />
                  Excellent Performance
                </CardTitle>
                <CardDescription>
                  Areas scoring above 3.0 - celebrate these strengths!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {skillsByPerformance.excellent.map((skill) => (
                    <div
                      key={skill.habit}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200"
                    >
                      <span className="font-medium text-gray-900">
                        {skill.habit}
                      </span>
                      <Badge className="bg-green-600">
                        {skill.average.toFixed(2)}{' '}
                        <TrendingUp className="ml-1 h-3 w-3 inline" />
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Skills Average Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Skills Average Overall</CardTitle>
          <CardDescription>
            Average rating for each work habit across all entries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={overallAverages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="habit"
                angle={-45}
                textAnchor="end"
                height={120}
                interval={0}
                style={{ fontSize: '12px' }}
              />
              <YAxis domain={[0, 4]} />
              <Tooltip />
              <Bar dataKey="average">
                {overallAverages.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.status === 'needs-attention'
                        ? '#ea580c'
                        : entry.status === 'excellent'
                          ? '#16a34a'
                          : '#8b5cf6'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-600 rounded"></div>
              <span>Needs Attention (&lt; 3.0)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-600 rounded"></div>
              <span>Proficient (= 3.0)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-600 rounded"></div>
              <span>Excellent (&gt; 3.0)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      {monthlyTrends.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>
              Average work habits performance by month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 4]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Average Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Skill Distribution Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Distribution</CardTitle>
          <CardDescription>
            Visual representation of strengths across all work habits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={skillDistribution}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" style={{ fontSize: '11px' }} />
              <PolarRadiusAxis domain={[0, 4]} />
              <Radar
                name="Average Score"
                dataKey="score"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Student Performance */}
      {studentPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Student Performance</CardTitle>
            <CardDescription>
              Average scores and entry count by student
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 4]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#10b981" name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
