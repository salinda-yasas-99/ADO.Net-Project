import { useState, useEffect } from 'react';
import { FormInput, FormSelect, Button, Alert } from '../common';
import departmentService from '../../services/departmentService';

const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

function UserForm({ user, onSubmit, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    dateOfBirth: '',
    salary: '',
    departmentId: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  const isEditing = Boolean(user);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await departmentService.getAll();
        if (response.success) {
          setDepartments(response.data || []);
        }
      } catch (err) {
        console.error('Failed to load departments:', err);
      } finally {
        setLoadingDepartments(false);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (user) {
      const dob = formatDateForInput(user.dateOfBirth);
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        emailAddress: user.emailAddress || '',
        dateOfBirth: dob,
        salary: user.salary?.toString() || '',
        departmentId: user.departmentId?.toString() || '',
      });
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    } else if (formData.firstName.trim().length > 50) {
      newErrors.firstName = 'First name must not exceed 50 characters.';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    } else if (formData.lastName.trim().length > 50) {
      newErrors.lastName = 'Last name must not exceed 50 characters.';
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email address is required.';
    } else if (formData.emailAddress.trim().length > 100) {
      newErrors.emailAddress = 'Email address must not exceed 100 characters.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailAddress.trim())) {
        newErrors.emailAddress = 'Please enter a valid email address.';
      }
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required.';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dob >= today) {
        newErrors.dateOfBirth = 'Date of birth must be in the past.';
      }
    }

    if (!formData.salary) {
      newErrors.salary = 'Salary is required.';
    } else {
      const salaryNum = parseFloat(formData.salary);
      if (isNaN(salaryNum) || salaryNum <= 0) {
        newErrors.salary = 'Salary must be a positive number.';
      }
    }

    if (!formData.departmentId) {
      newErrors.departmentId = 'Department is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    try {
      await onSubmit({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        emailAddress: formData.emailAddress.trim(),
        dateOfBirth: formData.dateOfBirth,
        salary: parseFloat(formData.salary),
        departmentId: parseInt(formData.departmentId, 10),
      });
    } catch (error) {
      setApiError(error.message || 'An error occurred while saving the user.');
    }
  };

  const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today.toISOString().split('T')[0];
  };

  const departmentOptions = departments.map((dept) => ({
    value: dept.id,
    label: `${dept.departmentCode} - ${dept.departmentName}`,
  }));

  return (
    <form onSubmit={handleSubmit}>
      {apiError && (
        <div className="mb-4">
          <Alert type="error" message={apiError} onClose={() => setApiError('')} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          placeholder="Enter first name"
          required
          disabled={isLoading}
        />

        <FormInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          placeholder="Enter last name"
          required
          disabled={isLoading}
        />
      </div>

      <FormInput
        label="Email Address"
        name="emailAddress"
        type="email"
        value={formData.emailAddress}
        onChange={handleChange}
        error={errors.emailAddress}
        placeholder="Enter email address"
        required
        disabled={isLoading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          error={errors.dateOfBirth}
          required
          disabled={isLoading}
          max={getMaxDate()}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600">
            {isEditing ? `${user?.age} years` : 'Calculated after save'}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Automatically calculated based on date of birth
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Salary"
          name="salary"
          type="number"
          value={formData.salary}
          onChange={handleChange}
          error={errors.salary}
          placeholder="Enter salary amount"
          required
          disabled={isLoading}
          min="0.01"
          step="0.01"
        />

        <FormSelect
          label="Department"
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          options={departmentOptions}
          error={errors.departmentId}
          placeholder={loadingDepartments ? 'Loading departments...' : 'Select a department'}
          required
          disabled={isLoading || loadingDepartments}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {isEditing ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}

export default UserForm;
