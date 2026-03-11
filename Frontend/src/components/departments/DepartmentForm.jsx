import { useState, useEffect } from 'react';
import { FormInput, Button, Alert } from '../common';

function DepartmentForm({ department, onSubmit, onCancel, isLoading = false }) {
  const [formData, setFormData] = useState({
    departmentCode: '',
    departmentName: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const isEditing = Boolean(department);

  useEffect(() => {
    if (department) {
      setFormData({
        departmentCode: department.departmentCode || '',
        departmentName: department.departmentName || '',
      });
    }
  }, [department]);

  const validate = () => {
    const newErrors = {};

    if (!formData.departmentCode.trim()) {
      newErrors.departmentCode = 'Department code is required.';
    } else if (formData.departmentCode.trim().length > 20) {
      newErrors.departmentCode = 'Department code must not exceed 20 characters.';
    }

    if (!formData.departmentName.trim()) {
      newErrors.departmentName = 'Department name is required.';
    } else if (formData.departmentName.trim().length > 100) {
      newErrors.departmentName = 'Department name must not exceed 100 characters.';
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
        departmentCode: formData.departmentCode.trim(),
        departmentName: formData.departmentName.trim(),
      });
    } catch (error) {
      setApiError(error.message || 'An error occurred while saving the department.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {apiError && (
        <div className="mb-4">
          <Alert type="error" message={apiError} onClose={() => setApiError('')} />
        </div>
      )}

      <FormInput
        label="Department Code"
        name="departmentCode"
        value={formData.departmentCode}
        onChange={handleChange}
        error={errors.departmentCode}
        placeholder="Enter department code (e.g., HR, IT, FIN)"
        required
        disabled={isLoading}
      />

      <FormInput
        label="Department Name"
        name="departmentName"
        value={formData.departmentName}
        onChange={handleChange}
        error={errors.departmentName}
        placeholder="Enter department name"
        required
        disabled={isLoading}
      />

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
          {isEditing ? 'Update Department' : 'Create Department'}
        </Button>
      </div>
    </form>
  );
}

export default DepartmentForm;
