import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

export function UserGuideDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Work Habits Dashboard - User Guide</DialogTitle>
          <DialogDescription>
            Quick reference for using the system
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Getting Started */}
            <section>
              <h3 className="text-lg font-semibold mb-3">🚀 Getting Started</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  <strong>Add Students</strong> - Go to Admin panel and click
                  "Add Student"
                </li>
                <li>
                  <strong>Enter Daily Habits</strong> - Use the Entry page to
                  record observations
                </li>
                <li>
                  <strong>View Analytics</strong> - Check the Dashboard for
                  trends and insights
                </li>
              </ol>
            </section>

            {/* Rating Scale */}
            <section>
              <h3 className="text-lg font-semibold mb-3">📊 Rating Scale</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-red-600">1</span>
                  <div>
                    <strong>Needs Improvement</strong> - Skill requires
                    significant development
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-orange-600">2</span>
                  <div>
                    <strong>Developing</strong> - Skill is emerging but
                    inconsistent
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-600">3</span>
                  <div>
                    <strong>Proficient</strong> - Skill is demonstrated
                    consistently
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-bold text-green-600">4</span>
                  <div>
                    <strong>Exemplary</strong> - Skill is mastered and exceeds
                    expectations
                  </div>
                </div>
              </div>
            </section>

            {/* 12 Work Habits */}
            <section>
              <h3 className="text-lg font-semibold mb-3">
                📝 12 Work Habits Explained
              </h3>
              <div className="grid gap-3 text-sm">
                <div>
                  <strong>Self-Reflection:</strong> Ability to assess own work
                  and identify areas for improvement
                </div>
                <div>
                  <strong>Time Management:</strong> Effective use of time and
                  meeting deadlines
                </div>
                <div>
                  <strong>Organization:</strong> Keeping materials and work
                  space orderly
                </div>
                <div>
                  <strong>Task Completion:</strong> Finishing assignments and
                  following through
                </div>
                <div>
                  <strong>Attention:</strong> Staying focused and engaged during
                  work time
                </div>
                <div>
                  <strong>Follow Directions:</strong> Understanding and
                  following instructions accurately
                </div>
                <div>
                  <strong>Problem Solving:</strong> Finding solutions to
                  challenges independently
                </div>
                <div>
                  <strong>Independence:</strong> Working without constant
                  supervision or prompting
                </div>
                <div>
                  <strong>Cooperation:</strong> Working well with others and
                  contributing to group efforts
                </div>
                <div>
                  <strong>Social Skills:</strong> Appropriate interactions with
                  peers and adults
                </div>
                <div>
                  <strong>Work Quality:</strong> Producing thorough, accurate,
                  and neat work
                </div>
                <div>
                  <strong>Work Pace:</strong> Maintaining appropriate speed
                  without rushing or delaying
                </div>
              </div>
            </section>

            {/* Tips */}
            <section>
              <h3 className="text-lg font-semibold mb-3">💡 Tips for Success</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  <strong>Be consistent</strong> - Enter data daily or weekly
                  for best trends
                </li>
                <li>
                  <strong>Use notes</strong> - Add context to help remember
                  specific situations
                </li>
                <li>
                  <strong>Review dashboard regularly</strong> - Identify
                  patterns and celebrate growth
                </li>
                <li>
                  <strong>Mark inactive students</strong> - Keep your roster
                  current by toggling status
                </li>
                <li>
                  <strong>Share insights</strong> - Use dashboard screenshots
                  for parent conferences
                </li>
              </ul>
            </section>

            {/* Privacy */}
            <section>
              <h3 className="text-lg font-semibold mb-3">🔒 Privacy & Data</h3>
              <p className="text-sm text-gray-600">
                Your data is private and secure. Only you can see your students
                and entries. All information is stored securely and never shared
                with third parties. Each teacher has their own isolated account.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
