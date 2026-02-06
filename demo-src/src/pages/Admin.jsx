import React, { useState, useMemo } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Users,
  ToggleLeft,
  ToggleRight,
  X,
  AlertCircle,
} from 'lucide-react';
import { MOCK_STUDENTS, MOCK_ENTRIES } from '../mock-data';

const Admin = ({ students, entries, onUpdateStudents, onNavigate, showToast }) => {
  // Local state for modals and forms
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studentId: '',
    grade: 'Grade 5',
  });

  // Filter students based on search query
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    const query = searchQuery.toLowerCase();
    return students.filter(
      (student) =>
        student.firstName.toLowerCase().includes(query) ||
        student.lastName.toLowerCase().includes(query) ||
        student.studentId.toLowerCase().includes(query)
    );
  }, [students, searchQuery]);

  // Handle opening add/edit modal
  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        firstName: student.firstName,
        lastName: student.lastName,
        studentId: student.studentId || '',
        grade: `Grade ${student.grade}`,
      });
    } else {
      setEditingStudent(null);
      setFormData({
        firstName: '',
        lastName: '',
        studentId: '',
        grade: 'Grade 5',
      });
    }
    setShowAddModal(true);
  };

  // Handle closing modals
  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingStudent(null);
    setFormData({
      firstName: '',
      lastName: '',
      studentId: '',
      grade: 'Grade 5',
    });
  };

  // Handle saving student
  const handleSaveStudent = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      showToast('Please fill in first and last name', 'error');
      return;
    }

    const gradeNumber = parseInt(formData.grade.replace('Grade ', ''));
    let updatedStudents;

    if (editingStudent) {
      // Update existing student
      updatedStudents = students.map((s) =>
        s.id === editingStudent.id
          ? {
              ...s,
              firstName: formData.firstName,
              lastName: formData.lastName,
              studentId: formData.studentId || s.studentId,
              grade: gradeNumber,
            }
          : s
      );
      showToast('Student updated successfully', 'success');
    } else {
      // Add new student
      const newStudent = {
        id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        studentId: formData.studentId || `STU-${String(students.length + 1).padStart(3, '0')}`,
        grade: gradeNumber,
        active: true,
      };
      updatedStudents = [...students, newStudent];
      showToast('Student added successfully', 'success');
    }

    onUpdateStudents(updatedStudents);
    handleCloseModal();
  };

  // Handle toggling active status
  const handleToggleActive = (student) => {
    const updatedStudents = students.map((s) =>
      s.id === student.id ? { ...s, active: !s.active } : s
    );
    onUpdateStudents(updatedStudents);
    showToast(
      `Student marked as ${!student.active ? 'active' : 'inactive'}`,
      'success'
    );
  };

  // Handle opening delete confirmation
  const handleOpenDeleteConfirm = (student) => {
    setStudentToDelete(student);
    setShowDeleteConfirm(true);
  };

  // Handle confirming deletion
  const handleConfirmDelete = () => {
    if (!studentToDelete) return;

    const updatedStudents = students.filter((s) => s.id !== studentToDelete.id);
    const updatedEntries = entries.filter((e) => e.studentId !== studentToDelete.id);

    onUpdateStudents(updatedStudents, updatedEntries);
    showToast(`${studentToDelete.firstName} ${studentToDelete.lastName} deleted`, 'success');

    setShowDeleteConfirm(false);
    setStudentToDelete(null);
  };

  // Handle seeding demo data
  const handleSeedDemoData = () => {
    onUpdateStudents(MOCK_STUDENTS, MOCK_ENTRIES);
    showToast('Demo data loaded successfully', 'success');
  };

  // Handle clearing all data
  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      onUpdateStudents([], []);
      showToast('All data cleared', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Students</h1>
          <p className="text-lg text-gray-600">Add, edit, and manage your student roster</p>
        </div>

        {/* Action Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Student
            </button>
            <div className="flex items-center gap-2 text-gray-700 font-medium">
              <Users size={20} />
              <span>{students.length} students</span>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">
                {searchQuery ? 'No students match your search.' : 'No students yet. Add one to get started!'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <tr
                        key={student.id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {student.firstName} {student.lastName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{student.studentId}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">Grade {student.grade}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                              student.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {student.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenModal(student)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit student"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              onClick={() => handleToggleActive(student)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title={student.active ? 'Mark inactive' : 'Mark active'}
                            >
                              {student.active ? (
                                <ToggleRight size={18} />
                              ) : (
                                <ToggleLeft size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => handleOpenDeleteConfirm(student)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete student"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-sm text-gray-500">Student ID</p>
                        <p className="text-gray-900">{student.studentId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Grade</p>
                        <p className="text-gray-900">Grade {student.grade}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          student.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {student.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleOpenModal(student)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(student)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                      >
                        {student.active ? (
                          <ToggleRight size={16} />
                        ) : (
                          <ToggleLeft size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenDeleteConfirm(student)}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Demo Data Controls */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Demo Data Controls</h2>
          <p className="text-gray-600 mb-4">
            Seed sample data or clear everything to start fresh
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleSeedDemoData}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Seed Demo Data
            </button>
            <button
              onClick={handleClearAllData}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Clear All Data
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingStudent ? 'Edit Student' : 'Add Student'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter first name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter last name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">
                  Student ID
                </label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  placeholder="e.g., STU-006"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1">Grade</label>
                <select
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option>Grade 3</option>
                  <option>Grade 4</option>
                  <option>Grade 5</option>
                  <option>Grade 6</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStudent}
                className="flex-1 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
              >
                Save Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && studentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <AlertCircle size={24} className="text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">Delete Student</h3>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete{' '}
                <strong>
                  {studentToDelete.firstName} {studentToDelete.lastName}
                </strong>
                ? This will also remove all their habit entries.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
