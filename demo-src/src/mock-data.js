/**
 * Mock Data for Work Habits Tracker Demo
 * Contains realistic student profiles and habit entries for educators
 */

// Habit labels mapping
export const HABIT_LABELS = {
  selfReflection: 'Self Reflection',
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
};

// Rating labels
export const RATING_LABELS = {
  1: 'Needs Improvement',
  2: 'Developing',
  3: 'Proficient',
  4: 'Exemplary',
};

// Color mapping for ratings
export const RATING_COLORS = {
  1: 'bg-red-100 text-red-800 border-red-300',
  2: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  3: 'bg-blue-100 text-blue-800 border-blue-300',
  4: 'bg-green-100 text-green-800 border-green-300',
};

// Mock Students
export const MOCK_STUDENTS = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    firstName: 'Maria',
    lastName: 'Santos',
    grade: 5,
    studentId: 'S-2025-001',
    active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    firstName: 'James',
    lastName: 'Wilson',
    grade: 5,
    studentId: 'S-2025-002',
    active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    firstName: 'Aiden',
    lastName: 'Thompson',
    grade: 4,
    studentId: 'S-2025-003',
    active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    firstName: 'Sophia',
    lastName: 'Chen',
    grade: 4,
    studentId: 'S-2025-004',
    active: true,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    firstName: 'Liam',
    lastName: "O'Brien",
    grade: 5,
    studentId: 'S-2025-005',
    active: true,
  },
];

// Helper function to create habit entries with weighted ratings
const createStudentEntries = (studentId, profile) => {
  const entries = [];
  const startDate = new Date(2025, 10, 1); // November 2025
  const endDate = new Date(2026, 0, 31); // January 2026

  const dates = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    // Roughly 3-4 entries per week
    if (Math.random() < 0.5) {
      dates.push(new Date(d));
    }
  }

  dates.forEach((date, index) => {
    const progressFactor = index / dates.length; // 0 to 1
    let habitRatings = {};

    Object.keys(HABIT_LABELS).forEach((habit) => {
      let rating = profile.getHabitRating(habit, progressFactor);
      habitRatings[habit] = rating;
    });

    const notes = profile.getNotes ? profile.getNotes(progressFactor) : undefined;

    entries.push({
      id: `entry-${studentId}-${index}`,
      studentId,
      entryDate: date.getTime(),
      ...habitRatings,
      ...(notes && { notes }),
    });
  });

  return entries;
};

// Maria Santos - High Performer (averages 3.5+)
const mariaProfile = {
  getHabitRating: (habit, progressFactor) => {
    const baseRatings = {
      selfReflection: 3.5,
      timeManagement: 3.6,
      organization: 3.7,
      taskCompletion: 3.8,
      attention: 3.6,
      followDirections: 3.8,
      problemSolving: 3.5,
      independence: 3.7,
      cooperation: 3.9,
      socialSkills: 3.8,
      workQuality: 3.9,
      workPace: 3.7,
    };
    const base = baseRatings[habit];
    const variance = Math.random() * 0.8 - 0.4; // -0.4 to +0.4
    return Math.max(1, Math.min(4, Math.round((base + variance) * 2) / 2));
  },
  getNotes: (progressFactor) => {
    const notes = [
      'Excellent focus during group work today',
      'Completed all tasks ahead of schedule',
      'Strong problem-solving during math lesson',
      'Very organized notebook and materials',
      'Great leadership in peer review session',
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  },
};

// James Wilson - Developing/Struggling (averages 2.0-2.5)
const jamesProfile = {
  getHabitRating: (habit, progressFactor) => {
    const baseRatings = {
      selfReflection: 1.8,
      timeManagement: 2.0,
      organization: 1.9,
      taskCompletion: 2.1,
      attention: 2.2,
      followDirections: 2.0,
      problemSolving: 2.3,
      independence: 1.9,
      cooperation: 2.2,
      socialSkills: 2.4,
      workQuality: 2.0,
      workPace: 1.8,
    };
    const base = baseRatings[habit];
    const variance = Math.random() * 1.0 - 0.5; // -0.5 to +0.5
    return Math.max(1, Math.min(4, Math.round((base + variance) * 2) / 2));
  },
  getNotes: (progressFactor) => {
    const notes = [
      'Needs reminders to stay on task',
      'Worked with buddy for better focus',
      'Left materials scattered after work',
      'Improved effort on problem-solving today',
      'Had difficulty following multi-step directions',
      'Better organization with teacher check-ins',
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  },
};

// Aiden Thompson - Excellent Across the Board (averages 3.8+)
const aidenProfile = {
  getHabitRating: (habit, progressFactor) => {
    const baseRatings = {
      selfReflection: 3.9,
      timeManagement: 3.9,
      organization: 3.8,
      taskCompletion: 4.0,
      attention: 3.9,
      followDirections: 4.0,
      problemSolving: 3.8,
      independence: 3.9,
      cooperation: 3.8,
      socialSkills: 3.7,
      workQuality: 4.0,
      workPace: 3.9,
    };
    const base = baseRatings[habit];
    const variance = Math.random() * 0.6 - 0.3; // -0.3 to +0.3
    return Math.max(1, Math.min(4, Math.round((base + variance) * 2) / 2));
  },
  getNotes: (progressFactor) => {
    const notes = [
      'Excellent work today - shows great understanding',
      'Perfect execution of assignment',
      'Helps other students with problem-solving',
      'Consistently high quality work',
      'Demonstrates exceptional focus and independence',
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  },
};

// Sophia Chen - Inconsistent (varies 1-4 randomly)
const sophiaProfile = {
  getHabitRating: (habit, progressFactor) => {
    // Completely random between 1-4 to show inconsistency
    return Math.floor(Math.random() * 4) + 1;
  },
  getNotes: (progressFactor) => {
    const notes = [
      'Excellent day - very focused and engaged',
      'Struggled with organization today',
      'Great cooperative skills in group work',
      'Needs reminders to complete tasks',
      'Amazing problem-solving today - breakthrough moment!',
      'Distracted and off-task during lesson',
      'Good reflection on learning process',
      'Had difficulty following directions',
    ];
    return notes[Math.floor(Math.random() * notes.length)];
  },
};

// Liam O'Brien - Improving Over Time (starting ~2.0, ending ~3.2)
const liamProfile = {
  getHabitRating: (habit, progressFactor) => {
    // Start at 2.0, end at 3.2 with slight variance
    const startRating = 2.0;
    const endRating = 3.2;
    const baseRating = startRating + (endRating - startRating) * progressFactor;

    // Add small variance to make it realistic
    const variance = Math.random() * 0.6 - 0.3; // -0.3 to +0.3
    return Math.max(1, Math.min(4, Math.round((baseRating + variance) * 2) / 2));
  },
  getNotes: (progressFactor) => {
    if (progressFactor < 0.3) {
      return 'Still working on focus and organization';
    } else if (progressFactor < 0.6) {
      return 'Showing improvement with consistent effort';
    } else {
      return 'Great progress! Much better task completion and focus';
    }
  },
};

// Generate all entries
const mariaEntries = createStudentEntries(MOCK_STUDENTS[0].id, mariaProfile);
const jamesEntries = createStudentEntries(MOCK_STUDENTS[1].id, jamesProfile);
const aidenEntries = createStudentEntries(MOCK_STUDENTS[2].id, aidenProfile);
const sophiaEntries = createStudentEntries(MOCK_STUDENTS[3].id, sophiaProfile);
const liamEntries = createStudentEntries(MOCK_STUDENTS[4].id, liamProfile);

export const MOCK_ENTRIES = [
  ...mariaEntries,
  ...jamesEntries,
  ...aidenEntries,
  ...sophiaEntries,
  ...liamEntries,
];
