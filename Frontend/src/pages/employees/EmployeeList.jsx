import { useState, useEffect, useCallback } from 'react';
import {
  PageHeader,
  DataTable,
  Modal,
  ConfirmDialog,
  Alert,
  LoadingSpinner,
} from '../../components/common';
import { EmployeeForm } from '../../components/employees';
import employeeService from '../../services/employeeService';

/**
 * Calculate age from date of birth
 * @param {string} dateOfBirth - Date string
 * @returns {number} Age in years
 */
const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return 0;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format salary for display
 * @param {number} salary - Salary amount
 * @returns {string} Formatted currency
 */
const formatSalary = (salary) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(salary);
};

/**
 * EmployeeList page
 * Displays list of employees with CRUD operations
 */
function EmployeeList() {
  // State
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Table columns configuration
  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'fullName', 
      label: 'Name',
      render: (_, row) => `${row.firstName} ${row.lastName}`,
    },
    { key: 'emailAddress', label: 'Email' },
    { 
      key: 'dateOfBirth', 
      label: 'Date of Birth',
      render: (value) => formatDate(value),
    },
    { 
      key: 'age', 
      label: 'Age',
      render: (_, row) => calculateAge(row.dateOfBirth),
    },
    { 
      key: 'salary', 
      label: 'Salary',
      render: (value) => formatSalary(value),
    },
    { 
      key: 'departmentName', 
      label: 'Department',
      render: (value, row) => value || row.department?.departmentName || 'N/A',
    },
  ];

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await employeeService.getAll();
      if (response.success) {
        setEmployees(response.data || []);
      } else {
        setError(response.message || 'Failed to load employees.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load employees.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handlers
  const handleAdd = () => {
    setSelectedEmployee(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsFormModalOpen(true);
  };

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedEmployee) {
        // Update existing employee
        const response = await employeeService.update(selectedEmployee.id, formData);
        if (response.success) {
          setSuccessMessage('Employee updated successfully.');
          setIsFormModalOpen(false);
          fetchEmployees();
        } else {
          throw new Error(response.message);
        }
      } else {
        // Create new employee
        const response = await employeeService.create(formData);
        if (response.success) {
          setSuccessMessage('Employee created successfully.');
          setIsFormModalOpen(false);
          fetchEmployees();
        } else {
          throw new Error(response.message);
        }
      }
    } catch (err) {
      throw err; // Let the form handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return;

    setIsSubmitting(true);
    try {
      const response = await employeeService.delete(selectedEmployee.id);
      if (response.success) {
        setSuccessMessage('Employee deleted successfully.');
        setIsDeleteDialogOpen(false);
        setSelectedEmployee(null);
        fetchEmployees();
      } else {
        setError(response.message || 'Failed to delete employee.');
        setIsDeleteDialogOpen(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete employee.');
      setIsDeleteDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle="Manage company employees"
        actionLabel="Add Employee"
        onAction={handleAdd}
      />

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4">
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4">
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner message="Loading employees..." />
      ) : (
        <DataTable
          columns={columns}
          data={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No employees found. Click 'Add Employee' to create one."
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={selectedEmployee ? 'Edit Employee' : 'Add Employee'}
        size="lg"
      >
        <EmployeeForm
          employee={selectedEmployee}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseFormModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete "${selectedEmployee?.firstName} ${selectedEmployee?.lastName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default EmployeeList;
