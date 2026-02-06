# Work Habits Dashboard

A modern, privacy-first work habits tracking system for schools. Track 12 essential work skills for students with daily entries, visual dashboards, and comprehensive analytics.

## Features

### 📝 Daily Entry Page
- Quick habit tracking for students
- 12 work skills rated on a 1-4 scale:
  - Self-Reflection
  - Time Management
  - Organization
  - Task Completion
  - Attention
  - Follow Directions
  - Problem Solving
  - Independence
  - Cooperation
  - Social Skills
  - Work Quality
  - Work Pace
- Optional notes for each entry
- Student selection from active roster

### 📊 Dashboard Page
- **Summary Statistics**: Total entries, active students, overall averages
- **Skills Average Chart**: Bar chart showing average rating for each work habit
- **Monthly Trends**: Line chart tracking performance over time
- **Skill Distribution**: Radar chart visualizing strengths across all habits
- **Student Performance**: Comparative bar chart of student averages

### 👥 Admin Panel
- Student roster management
- Add/edit/delete students
- Toggle active/inactive status
- Track student ID and grade level
- Quick search and filtering

## Technology Stack

- **Frontend**: React 19 + TanStack Start
- **Backend**: Appwrite (privacy-first, self-hostable)
- **Database**: Appwrite TablesDB
- **Charts**: Recharts
- **UI**: shadcn/ui + Tailwind CSS
- **Forms**: React Hook Form + Zod validation

## Data Model

### Students Table
- `firstName`, `lastName`: Student name
- `studentId`: Optional student identifier
- `grade`: Optional grade level
- `active`: Boolean status flag
- `createdBy`: User ownership

### Habit Entries Table
- `studentId`: Reference to student
- `entryDate`: Unix timestamp
- 12 habit fields (1-4 rating scale)
- `notes`: Optional text field
- `createdBy`: User ownership

## Privacy & Security

- **School-owned data**: All data stored in your Appwrite instance
- **User authentication**: Secure email/password auth
- **Ownership enforcement**: Users only see their own students and entries
- **No third-party tracking**: Complete data privacy

## Getting Started

### 1. Sign Up
Create an account at the landing page

### 2. Add Students
Navigate to Admin panel and add your student roster

### 3. Enter Data
Use the Entry page to record daily habit observations

### 4. View Insights
Check the Dashboard for trends and analytics

## Embedding in Google Sites

This application can be embedded in Google Sites using an iframe:

```html
<iframe 
  src="https://your-deployment-url.com" 
  width="100%" 
  height="800px" 
  frameborder="0"
></iframe>
```

**Recommended settings:**
- Width: 100%
- Height: 800px minimum
- Allow full-screen for best experience

## Deployment

The application is deployed on Imagine's infrastructure with:
- Automatic SSL/HTTPS
- Global CDN
- Automatic backups
- 99.9% uptime SLA

## Comparison to Original Setup

### Before (Google Workspace)
- ❌ 8-step setup process per user
- ❌ Separate Google Form, Sheet, and Looker Studio
- ❌ Manual data source connections
- ❌ Complex template copying
- ❌ QR code generation required
- ❌ Data scattered across multiple services

### After (This App)
- ✅ Single sign-up
- ✅ Unified interface
- ✅ Automatic data flow
- ✅ Built-in visualizations
- ✅ Direct entry form
- ✅ All data in one place
- ✅ Embeddable in Google Sites

## Support

For questions or issues, contact your system administrator.

## License

School-owned and operated. All rights reserved.
