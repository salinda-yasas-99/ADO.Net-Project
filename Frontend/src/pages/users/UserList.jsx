import { useState, useEffect, useCallback } from 'react';
import {
  PageHeader,
  DataTable,
  Modal,
  ConfirmDialog,
  Alert,
  LoadingSpinner,
} from '../../components/common';
import { UserForm } from '../../components/users';
import userService from '../../services/userService';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatSalary = (salary) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(salary);
};

function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await userService.getAll();
      if (response.success) {
        setUsers(response.data || []);
      } else {
        setError(response.message || 'Failed to load users.');
      }
    } catch (err) {
      setError(err.message || 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAdd = () => {
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (selectedUser) {
        const response = await userService.update(selectedUser.id, formData);
        if (response.success) {
          setSuccessMessage('User updated successfully.');
          setIsFormModalOpen(false);
          fetchUsers();
        } else {
          throw new Error(response.message);
        }
      } else {
        const response = await userService.create(formData);
        if (response.success) {
          setSuccessMessage('User created successfully.');
          setIsFormModalOpen(false);
          fetchUsers();
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
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      const response = await userService.delete(selectedUser.id);
      if (response.success) {
        setSuccessMessage('User deleted successfully.');
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        setError(response.message || 'Failed to delete user.');
        setIsDeleteDialogOpen(false);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete user.');
      setIsDeleteDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedUser(null);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle="Manage company users"
        actionLabel="Add User"
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
        <LoadingSpinner message="Loading users..." />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          emptyMessage="No users found. Click 'Add User' to create one."
        />
      )}

      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={selectedUser ? 'Edit User' : 'Add User'}
        size="lg"
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseFormModal}
          isLoading={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.firstName} ${selectedUser?.lastName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSubmitting}
      />
    </div>
  );
}

export default UserList;
