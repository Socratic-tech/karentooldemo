import React, { useState, useMemo } from 'react';
import { HABIT_LABELS, RATING_LABELS } from '../mock-data.js';

const HABITS = Object.keys(HABIT_LABELS);

const getRatingColor = (rating) => {
  switch (rating) {
    case 1:
      return {
        unselected: 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200',
        selected: 'bg-red-500 border-red-600 text-white',
      };
    case 2:
      return {
        unselected: 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200',
        selected: 'bg-amber-500 border-amber-600 text-white',
      };
    case 3:
      return {
        unselected: 'bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200',
        selected: 'bg-blue-500 border-blue-600 text-white',
      };
    case 4:
      return {
        unselected: 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200',
        selected: 'bg-green-500 border-green-600 text-white',
      };
    default:
      return {
        unselected: 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200',
        selected: 'bg-gray-500 border-gray-600 text-white',
      };
  }
};

const getAverageBadgeColor = (average) => {
  if (average < 2) return 'bg-red-100 text-red-800 border-red-300';
  if (average < 3) return 'bg-amber-100 text-amber-800 border-amber-300';
  if (average < 3.5) return 'bg-blue-100 text-blue-800 border-blue-300';
  return 'bg-green-100 text-green-800 border-green-300';
};

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function Entry({ students, entries, onAddEntry, onNavigate, showToast }) {
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [entryDate, setEntryDate] = useState(getTodayDate());
  const [ratings, setRatings] = useState({});
  const [notes, setNotes] = useState('');

  const activeStudents = students.filter((s) => s.active);

  const handleRatingChange = (habit, rating) => {
    setRatings((prev) => ({
      ...prev,
      [habit]: prev[habit] === rating ? undefined : rating,
    }));
  };

  const currentAverage = useMemo(() => {
    const ratedHabits = Object.values(ratings).filter((r) => r !== undefined);
    if (ratedHabits.length === 0) return 0;
    return (ratedHabits.reduce((sum, r) => sum + r, 0) / ratedHabits.length).toFixed(2);
  }, [ratings]);

  const selectedStudent = activeStudents.find((s) => s.id === selectedStudentId);

  const selectedStudentEntries = useMemo(() => {
    if (!selectedStudentId) return [];
    return entries.filter((e) => e.studentId === selectedStudentId);
  }, [selectedStudentId, entries]);

  const lastEntryDate = useMemo(() => {
    if (selectedStudentEntries.length === 0) return null;
    const sorted = [...selectedStudentEntries].sort((a, b) => b.entryDate - a.entryDate);
    return new Date(sorted[0].entryDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [selectedStudentEntries]);

  const studentOverallAverage = useMemo(() => {
    if (selectedStudentEntries.length === 0) return 0;
    let totalRating = 0;
    let totalCount = 0;

    selectedStudentEntries.forEach((entry) => {
      HABITS.forEach((habit) => {
        if (entry[habit] !== undefined) {
          totalRating += entry[habit];
          totalCount += 1;
        }
      });
    });

    return totalCount === 0 ? 0 : (totalRating / totalCount).toFixed(2);
  }, [selectedStudentEntries]);

  const isFormValid = selectedStudentId && Object.values(ratings).some((r) => r !== undefined);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      showToast('Please select a student and rate at least one habit', 'error');
      return;
    }

    const newEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      studentId: selectedStudentId,
      entryDate: new Date(entryDate).getTime(),
      ...ratings,
      ...(notes.trim() && { notes: notes.trim() }),
    };

    onAddEntry(newEntry);
    showToast('Entry saved successfully!', 'success');

    // Reset form
    setSelectedStudentId('');
    setEntryDate(getTodayDate());
    setRatings({});
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Daily Habit Entry</h1>
          <p className="text-gray-600 text-lg">Record work habits for your students</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student and Date Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Student
                </label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-gray-900"
                >
                  <option value="">Select a student...</option>
                  {activeStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} (Grade {student.grade})
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Entry Date
                </label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 bg-white text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Habit Rating Grid */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Habits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {HABITS.map((habit) => {
                const currentRating = ratings[habit];
                return (
                  <div key={habit} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      {HABIT_LABELS[habit]}
                    </h3>
                    <div className="flex gap-2 mb-3">
                      {[1, 2, 3, 4].map((rating) => {
                        const isSelected = currentRating === rating;
                        const colors = getRatingColor(rating);
                        return (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => handleRatingChange(habit, rating)}
                            className={`flex-1 py-2 px-3 rounded-md font-semibold text-sm border-2 transition-all ${
                              isSelected ? colors.selected : colors.unselected
                            }`}
                          >
                            {rating}
                          </button>
                        );
                      })}
                    </div>
                    {currentRating && (
                      <div className="text-xs text-gray-600 font-medium">
                        {RATING_LABELS[currentRating]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Average Display */}
          {Object.values(ratings).some((r) => r !== undefined) && (
            <div
              className={`rounded-xl p-6 border-2 ${getAverageBadgeColor(
                currentAverage
              )}`}
            >
              <div className="text-center">
                <p className="text-sm font-semibold opacity-75 mb-1">Current Average</p>
                <p className="text-3xl font-bold">{currentAverage}</p>
              </div>
            </div>
          )}

          {/* Notes Field */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Observation Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any observations or notes about this student's work habits today..."
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-gray-900 placeholder-gray-400 resize-none"
            />
          </div>

          {/* Quick Stats Sidebar */}
          {selectedStudentId && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                <p className="text-gray-600 text-sm font-medium mb-2">Total Entries</p>
                <p className="text-3xl font-bold text-gray-900">
                  {selectedStudentEntries.length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm font-medium mb-2">Last Entry Date</p>
                <p className="text-lg font-bold text-gray-900">
                  {lastEntryDate || 'No entries yet'}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <p className="text-gray-600 text-sm font-medium mb-2">Overall Average</p>
                <p className="text-3xl font-bold text-gray-900">{studentOverallAverage}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex-1 py-4 px-6 rounded-lg font-bold text-lg transition-all ${
                isFormValid
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save Entry
            </button>
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="py-4 px-6 bg-white text-gray-700 rounded-lg font-semibold border-2 border-gray-300 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
