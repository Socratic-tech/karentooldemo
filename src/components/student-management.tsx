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
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import {
  createStudentFn,
  updateStudentFn,
  deleteStudentFn,
} from '@/server/functions/students'
import { useRouter } from '@tanstack/react-router'
import type { Students } from '@/server/lib/appwrite.types'
import { Pencil, Trash2, UserPlus } from 'lucide-react'

const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  studentId: z.string().max(50).optional(),
  grade: z.string().max(20).optional(),
})

type StudentFormData = z.infer<typeof studentSchema>

interface StudentManagementProps {
  students: Students[]
}

export function StudentManagement({ students }: StudentManagementProps) {
  const router = useRouter()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Students | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      studentId: '',
      grade: '',
    },
  })

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true)
    try {
      if (editingStudent) {
        // Update existing student
        await updateStudentFn({
          data: {
            id: editingStudent.$id,
            firstName: data.firstName,
            lastName: data.lastName,
            studentId: data.studentId || null,
            grade: data.grade || null,
          },
        })
      } else {
        // Create new student
        await createStudentFn({
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            studentId: data.studentId || null,
            grade: data.grade || null,
            active: true,
          },
        })
      }

      // Reset form and close dialog
      form.reset()
      setIsAddDialogOpen(false)
      setEditingStudent(null)

      // Refresh data
      await router.invalidate()
    } catch (error) {
      console.error('Failed to save student:', error)
      alert('Failed to save student. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (student: Students) => {
    setEditingStudent(student)
    form.reset({
      firstName: student.firstName,
      lastName: student.lastName,
      studentId: student.studentId || '',
      grade: student.grade || '',
    })
    setIsAddDialogOpen(true)
  }

  const handleToggleActive = async (student: Students) => {
    try {
      await updateStudentFn({
        data: {
          id: student.$id,
          active: !student.active,
        },
      })
      await router.invalidate()
    } catch (error) {
      console.error('Failed to update student:', error)
      alert('Failed to update student status.')
    }
  }

  const handleDelete = async (student: Students) => {
    if (
      !confirm(
        `Are you sure you want to delete ${student.firstName} ${student.lastName}? This action cannot be undone.`,
      )
    ) {
      return
    }

    try {
      await deleteStudentFn({ data: { id: student.$id } })
      await router.invalidate()
    } catch (error) {
      console.error('Failed to delete student:', error)
      alert('Failed to delete student. Please try again.')
    }
  }

  const handleDialogClose = () => {
    setIsAddDialogOpen(false)
    setEditingStudent(null)
    form.reset()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Student Roster</CardTitle>
              <CardDescription>
                Manage your student list and track active status
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingStudent(null)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingStudent ? 'Edit Student' : 'Add New Student'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingStudent
                      ? 'Update student information'
                      : 'Enter student details to add to your roster'}
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="studentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="9" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDialogClose}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                          ? 'Saving...'
                          : editingStudent
                            ? 'Update'
                            : 'Add Student'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No students yet</p>
              <p className="text-sm">Click "Add Student" to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.$id}>
                    <TableCell className="font-medium">
                      {student.lastName}, {student.firstName}
                    </TableCell>
                    <TableCell>{student.studentId || '—'}</TableCell>
                    <TableCell>{student.grade || '—'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={student.active ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => handleToggleActive(student)}
                      >
                        {student.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(student)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(student)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
