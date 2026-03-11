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


function DepartmentList() {

  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'departmentCode', label: 'Code' },
    { key: 'departmentName', label: 'Name' },
  ];

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

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

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
        const response = await departmentService.update(selectedDepartment.id, formData);
        if (response.success) {
          setSuccessMessage('Department updated successfully.');
          setIsFormModalOpen(false);
          fetchDepartments();
        } else {
          throw new Error(response.message);
        }
      } else {
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
      throw err;
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

      {successMessage && (
        <div className="mb-4">
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
        </div>
      )}

      {error && (
        <div className="mb-4">
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        </div>
      )}

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
