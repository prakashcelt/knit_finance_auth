import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTodo, updateTodo } from '../../store/slices/todoSlice';
import { closeModal, addNotification } from '../../store/slices/uiSlice';
import LoadingSpinner from '../ui/LoadingSpinner';

const TodoForm = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.todos);
  const { modals, selectedTodo } = useSelector((state) => state.ui);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const isEditMode = !!selectedTodo;
  const isOpen = modals.todoModal;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setFormData({
          title: selectedTodo.title || '',
          description: selectedTodo.description || '',
          priority: selectedTodo.priority || 'medium',
          dueDate: selectedTodo.dueDate ? new Date(selectedTodo.dueDate).toISOString().split('T')[0] : '',
          tags: selectedTodo.tags || [],
        });
      } else {
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          dueDate: '',
          tags: [],
        });
      }
      setTagInput('');
      setValidationErrors({});
    }
  }, [isOpen, isEditMode, selectedTodo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: '',
      });
    }
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tag],
      });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.trim().length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }
    
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const todoData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        tags: formData.tags,
      };

      if (isEditMode) {
        await dispatch(updateTodo({ id: selectedTodo._id, todoData })).unwrap();
        dispatch(addNotification({
          type: 'success',
          message: 'Task updated successfully',
        }));
      } else {
        await dispatch(createTodo(todoData)).unwrap();
        dispatch(addNotification({
          type: 'success',
          message: 'Task created successfully',
        }));
      }
      
      dispatch(closeModal('todoModal'));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: error || 'Failed to save task',
      }));
    }
  };

  const handleClose = () => {
    dispatch(closeModal('todoModal'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {isEditMode ? 'Edit Task' : 'Create New Task'}
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        className={`input mt-1 ${validationErrors.title ? 'border-red-500' : ''}`}
                        placeholder="Enter task title"
                        maxLength={100}
                      />
                      {validationErrors.title && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className={`input mt-1 ${validationErrors.description ? 'border-red-500' : ''}`}
                        placeholder="Enter task description (optional)"
                        maxLength={500}
                      />
                      {validationErrors.description && (
                        <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                      )}
                    </div>

                    {/* Priority and Due Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <select
                          name="priority"
                          id="priority"
                          value={formData.priority}
                          onChange={handleChange}
                          className="input mt-1"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                          Due Date
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          id="dueDate"
                          value={formData.dueDate}
                          onChange={handleChange}
                          className="input mt-1"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                        Tags
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyPress={handleTagInputKeyPress}
                          onBlur={addTag}
                          className="input"
                          placeholder="Add tags (press Enter or comma to add)"
                          maxLength={20}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Press Enter or comma to add tags (max 5 tags)
                        </p>
                      </div>
                      
                      {formData.tags.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {formData.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-md w-full sm:w-auto sm:ml-3"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </div>
                ) : (
                  isEditMode ? 'Update Task' : 'Create Task'
                )}
              </button>
              
              <button
                type="button"
                onClick={handleClose}
                className="btn btn-secondary btn-md w-full sm:w-auto mt-3 sm:mt-0"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TodoForm;
