import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTodo } from '../../store/slices/todoSlice';
import { closeModal, addNotification } from '../../store/slices/uiSlice';
import LoadingSpinner from '../ui/LoadingSpinner';

const DeleteModal = () => {
  const dispatch = useDispatch();
  const { modals, selectedTodo } = useSelector((state) => state.ui);
  const { loading } = useSelector((state) => state.todos);

  const isOpen = modals.deleteModal;

  const handleDelete = async () => {
    if (!selectedTodo) return;

    try {
      await dispatch(deleteTodo(selectedTodo._id)).unwrap();
      dispatch(addNotification({
        type: 'success',
        message: 'Task deleted successfully',
      }));
      dispatch(closeModal('deleteModal'));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: error || 'Failed to delete task',
      }));
    }
  };

  const handleClose = () => {
    dispatch(closeModal('deleteModal'));
  };

  if (!isOpen || !selectedTodo) return null;

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
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delete Task
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this task? This action cannot be undone.
                  </p>
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-900">{selectedTodo.title}</p>
                    {selectedTodo.description && (
                      <p className="text-sm text-gray-600 mt-1">{selectedTodo.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="btn bg-red-600 hover:bg-red-700 text-white btn-md w-full sm:w-auto sm:ml-3"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Deleting...
                </div>
              ) : (
                'Delete Task'
              )}
            </button>
            
            <button
              onClick={handleClose}
              disabled={loading}
              className="btn btn-secondary btn-md w-full sm:w-auto mt-3 sm:mt-0"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
