import { useState, useEffect, useCallback } from 'react';
import {
  PageHeader,
  DataTable,
  Modal,
  ConfirmDialog,
  Alert,
  LoadingSpinner,
} from '../../components/common';
import { DepartmentForm } from '../../components/departments';
import departmentService from '../../services/departmentService';

/**
 * DepartmentList page
 * Displays list of departments with CRUD operations
 */
function DepartmentList() {
  // State
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Table columns configuration
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'departmentCode', label: 'Code' },
    { key: 'departmentName', label: 'Name' },
  ];

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await departmentService.getAll();
      if (response.success) {
        setDepartments(response.data || []);
      } else {
        setError(response.message || 'Failed to load departments.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load departments.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Clear success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Handlers
  const handleAdd = () => {
    setSelectedDepartment(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsFormModalOpen(true);
  };

  const handleDelete = (department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedDepartment) {
        // Update existing department
        const response = await departmentService.update(selectedDepartment.id, formData);
        if (response.success) {
          setSuccessMessage('Department updated successfully.');
          setIsFormModalOpen(false);
          fetchDepartments();
        } else {
          throw new Error(response.message);
        }
      } else {
        // Create new department
        const response = await departmentService.create(formData);
        if (response.success) {
          setSuccessMessage('Department created successfully.');
          setIsFormModalOpen(false);
          fetchDepartments();
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
    if (!selectedDepartment) return;

    setIsSubmitting(true);
    try {
      const response = await departmentService.delete(selectedDepartment.id);
      if (response.success) {
        setSuccessMessage('Department deleted successfully.');
        setIsDeleteDialogOpen(false);
        setSelectedDepartment(null);
        fetchDepartments();
      } else {
        setError(response.message || 'Failed to delete department.');
        setIsDeleteDialogOpen(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete department.');
      setIsDeleteDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedDepartment(null);
  };

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle="Manage company departments"
        actionLabel="Add Department"
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
        <LoadingSpinner message="Loading departments..." />
      ) : (
        <DataTable
          columns={columns}
          data={departments}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No departments found. Click 'Add Department' to create one."
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={selectedDepartment ? 'Edit Department' : 'Add Department'}
        size="md"
      >
        <DepartmentForm
          department={selectedDepartment}
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
        title="Delete Department"
        message={`Are you sure you want to delete "${selectedDepartment?.departmentName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default DepartmentList;
