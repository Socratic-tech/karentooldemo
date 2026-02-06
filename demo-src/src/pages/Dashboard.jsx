import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { HABIT_LABELS } from '../mock-data.js';

const Dashboard = ({ students = [], entries = [], onNavigate }) => {
  // Memoized calculations for all dashboard data
  const dashboardData = useMemo(() => {
    if (!entries.length || !students.length) {
      return {
        totalStudents: 0,
        totalEntries: 0,
        overallAverage: 0,
        thisMonthEntries: 0,
        habitAverages: [],
        monthlyTrends: [],
        studentComparison: [],
        allHabitAverages: [],
        recentEntries: [],
      };
    }

    // Summary stats
    const totalStudents = students.length;
    const totalEntries = entries.length;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const thisMonthEntries = entries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
    }).length;

    // Calculate overall average across all entries
    let totalSum = 0;
    let totalRatings = 0;
    entries.forEach((entry) => {
      const habitValues = Object.values(entry.habits).filter(v => typeof v === 'number');
      totalSum += habitValues.reduce((a, b) => a + b, 0);
      totalRatings += habitValues.length;
    });
    const overallAverage = totalRatings > 0 ? (totalSum / totalRatings).toFixed(2) : 0;

    // Habit averages across all entries
    const habitTotals = {};
    const habitCounts = {};
    Object.keys(HABIT_LABELS).forEach((habitKey) => {
      habitTotals[habitKey] = 0;
      habitCounts[habitKey] = 0;
    });

    entries.forEach((entry) => {
      Object.keys(HABIT_LABELS).forEach((habitKey) => {
        if (entry.habits[habitKey] !== undefined) {
          habitTotals[habitKey] += entry.habits[habitKey];
          habitCounts[habitKey]++;
        }
      });
    });

    const habitAverages = Object.keys(HABIT_LABELS).map((habitKey) => ({
      name: HABIT_LABELS[habitKey],
      key: habitKey,
      value: habitCounts[habitKey] > 0 ? (habitTotals[habitKey] / habitCounts[habitKey]).toFixed(2) : 0,
    }));

    // Monthly trends
    const monthlyData = {};
    entries.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const monthKey = `${entryDate.toLocaleString('default', { month: 'short' })} ${entryDate.getFullYear()}`;

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, values: [], sum: 0, count: 0 };
      }

      const habitValues = Object.values(entry.habits).filter(v => typeof v === 'number');
      const monthAvg = habitValues.reduce((a, b) => a + b, 0) / habitValues.length;
      monthlyData[monthKey].sum += monthAvg;
      monthlyData[monthKey].count++;
    });

    const monthlyTrends = Object.values(monthlyData)
      .map((data) => ({
        month: data.month,
        average: (data.sum / data.count).toFixed(2),
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));

    // Student comparison
    const studentAverages = {};
    students.forEach((student) => {
      studentAverages[student.id] = { name: student.name, values: [] };
    });

    entries.forEach((entry) => {
      if (studentAverages[entry.studentId]) {
        const habitValues = Object.values(entry.habits).filter(v => typeof v === 'number');
        const avg = habitValues.reduce((a, b) => a + b, 0) / habitValues.length;
        studentAverages[entry.studentId].values.push(avg);
      }
    });

    const studentComparison = Object.values(studentAverages)
      .filter((s) => s.values.length > 0)
      .map((s) => ({
        name: s.name,
        average: (s.values.reduce((a, b) => a + b, 0) / s.values.length).toFixed(2),
      }))
      .sort((a, b) => b.average - a.average);

    // All habit averages for radar chart (all students)
    const allHabitAverages = habitAverages.map((habit) => ({
      name: habit.name,
      value: parseFloat(habit.value),
    }));

    // Recent entries
    const recentEntries = [...entries]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10)
      .map((entry) => {
        const student = students.find((s) => s.id === entry.studentId);
        const habitValues = Object.values(entry.habits).filter(v => typeof v === 'number');
        const avg = habitValues.reduce((a, b) => a + b, 0) / habitValues.length;
        return {
          id: entry.id,
          date: new Date(entry.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }),
          student: student?.name || 'Unknown',
          average: avg.toFixed(2),
          notes: entry.notes ? entry.notes.substring(0, 40) : '-',
        };
      });

    return {
      totalStudents,
      totalEntries,
      overallAverage,
      thisMonthEntries,
      habitAverages,
      monthlyTrends,
      studentComparison,
      allHabitAverages,
      recentEntries,
    };
  }, [entries, students]);

  // Get color for habit bar based on value
  const getHabitColor = (value) => {
    const val = parseFloat(value);
    if (val < 2) return '#ef4444'; // red
    if (val < 3) return '#f59e0b'; // amber
    if (val < 3.5) return '#6366f1'; // indigo
    return '#10b981'; // emerald
  };

  // Get color for average rating
  const getAverageColor = (value) => {
    const val = parseFloat(value);
    if (val < 2) return 'bg-red-100 text-red-800';
    if (val < 3) return 'bg-amber-100 text-amber-800';
    if (val < 3.5) return 'bg-indigo-100 text-indigo-800';
    return 'bg-emerald-100 text-emerald-800';
  };

  const [selectedStudent, setSelectedStudent] = React.useState('all');

  // Get radar data for selected student or all students
  const radarData = useMemo(() => {
    if (selectedStudent === 'all') {
      return dashboardData.allHabitAverages;
    }

    const student = dashboardData.studentComparison.find((s) =>
      students.find((st) => st.name === s.name && st.id === selectedStudent)
    );

    if (!student) return dashboardData.allHabitAverages;

    const studentEntries = entries.filter((e) => e.studentId === selectedStudent);
    const habitTotals = {};
    const habitCounts = {};

    Object.keys(HABIT_LABELS).forEach((habitKey) => {
      habitTotals[habitKey] = 0;
      habitCounts[habitKey] = 0;
    });

    studentEntries.forEach((entry) => {
      Object.keys(HABIT_LABELS).forEach((habitKey) => {
        if (entry.habits[habitKey] !== undefined) {
          habitTotals[habitKey] += entry.habits[habitKey];
          habitCounts[habitKey]++;
        }
      });
    });

    return Object.keys(HABIT_LABELS).map((habitKey) => ({
      name: HABIT_LABELS[habitKey],
      value: habitCounts[habitKey] > 0 ? habitTotals[habitKey] / habitCounts[habitKey] : 0,
    }));
  }, [selectedStudent, dashboardData, students, entries]);

  // Chart colors
  const chartColors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Insights into student work habits and trends
          </p>
        </div>

        {/* Empty State */}
        {dashboardData.totalEntries === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">
              No data available yet. Add some student entries to see analytics.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Students */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {dashboardData.totalStudents}
                    </p>
                  </div>
                  <div className="text-4xl text-indigo-500">👥</div>
                </div>
              </div>

              {/* Total Entries */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Entries</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {dashboardData.totalEntries}
                    </p>
                  </div>
                  <div className="text-4xl text-violet-500">📝</div>
                </div>
              </div>

              {/* Overall Average */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overall Average</p>
                    <div className="mt-2">
                      <p className={`text-3xl font-bold px-3 py-1 rounded-lg inline-block ${getAverageColor(dashboardData.overallAverage)}`}>
                        {dashboardData.overallAverage}
                      </p>
                    </div>
                  </div>
                  <div className="text-4xl text-pink-500">⭐</div>
                </div>
              </div>

              {/* This Month Entries */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">This Month</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {dashboardData.thisMonthEntries}
                    </p>
                  </div>
                  <div className="text-4xl text-emerald-500">📅</div>
                </div>
              </div>
            </div>

            {/* Overall Habit Averages */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Habit Averages Across All Students
              </h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={dashboardData.habitAverages} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 4]} />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 8, 8, 0]}>
                    {dashboardData.habitAverages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getHabitColor(entry.value)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Monthly Performance Trends
              </h2>
              {dashboardData.monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={dashboardData.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 4]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="average"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: '#6366f1', r: 6 }}
                      activeDot={{ r: 8 }}
                      name="Overall Average"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">No monthly data available</p>
              )}
            </div>

            {/* Student Performance Comparison */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Student Performance Comparison
              </h2>
              {dashboardData.studentComparison.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={dashboardData.studentComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis domain={[0, 4]} />
                    <Tooltip />
                    <Bar dataKey="average" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                      {dashboardData.studentComparison.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">No student data available</p>
              )}
            </div>

            {/* Skill Breakdown (Radar) */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Skill Profile</h2>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Students</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 4]} />
                    <Radar
                      name="Average Rating"
                      dataKey="value"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center py-8">No skill data available</p>
              )}
            </div>

            {/* Recent Entries Table */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Entries</h2>
              {dashboardData.recentEntries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Average</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentEntries.map((entry) => (
                        <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-700">{entry.date}</td>
                          <td className="py-3 px-4 text-gray-700">{entry.student}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-3 py-1 rounded-lg text-sm font-medium ${getAverageColor(
                                entry.average
                              )}`}
                            >
                              {entry.average}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-sm">{entry.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent entries</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
