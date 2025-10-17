import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, searchTodos, clearSearchResults } from '../store/slices/todoSlice';
import { openModal } from '../store/slices/uiSlice';
import TodoList from '../components/todos/TodoList';
import TodoForm from '../components/todos/TodoForm';
import TodoFilters from '../components/todos/TodoFilters';
import SearchBar from '../components/todos/SearchBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { todos, searchResults, loading, pagination, searchQuery, filters } = useSelector((state) => state.todos);
  const { user } = useSelector((state) => state.auth);

  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    // Fetch todos on component mount
    dispatch(fetchTodos({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    const timeoutRef = searchTimeoutRef.current;
    return () => {
      if (timeoutRef) {
        clearTimeout(timeoutRef);
      }
    };
  }, []);

  const handleSearch = useCallback(async (query) => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Prevent search if already loading
    if (loading) return;
    
    if (query.trim()) {
      setShowSearchResults(true);
      dispatch(searchTodos({ q: query, page: 1, limit: 10 }));
    } else {
      setShowSearchResults(false);
      dispatch(clearSearchResults());
    }
  }, [dispatch, loading]);

  const handleFilterChange = (newFilters) => {
    dispatch(fetchTodos({ ...filters, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page) => {
    if (showSearchResults) {
      dispatch(searchTodos({ q: searchQuery, page, limit: 10 }));
    } else {
      dispatch(fetchTodos({ ...filters, page, limit: 10 }));
    }
  };

  const handleCreateTodo = () => {
    dispatch(openModal({ modal: 'todoModal' }));
  };

  const currentTodos = showSearchResults ? searchResults : todos;
  const currentPagination = pagination;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your tasks and stay organized.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Tasks</p>
                <p className="text-2xl font-semibold text-gray-900">{currentPagination.totalItems}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {todos.filter(todo => todo.completed).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {todos.filter(todo => !todo.completed).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="flex items-center gap-4">
            <TodoFilters 
              filters={filters} 
              onFilterChange={handleFilterChange}
              showSearchResults={showSearchResults}
              onClearSearch={() => {
                setShowSearchResults(false);
                dispatch(clearSearchResults());
              }}
            />
            <button
              onClick={handleCreateTodo}
              className="btn btn-primary"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Todo List */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">
            {showSearchResults ? `Search Results for "${searchQuery}"` : 'Your Tasks'}
          </h2>
        </div>
        <div className="card-content">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : currentTodos.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {showSearchResults 
                  ? 'Try adjusting your search terms.' 
                  : 'Get started by creating a new task.'
                }
              </p>
              {!showSearchResults && (
                <div className="mt-6">
                  <button
                    onClick={handleCreateTodo}
                    className="btn btn-primary"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add your first task
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <TodoList todos={currentTodos} />
              
              {/* Pagination */}
              {currentPagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPagination.currentPage - 1) * currentPagination.itemsPerPage) + 1} to{' '}
                    {Math.min(currentPagination.currentPage * currentPagination.itemsPerPage, currentPagination.totalItems)} of{' '}
                    {currentPagination.totalItems} results
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPagination.currentPage - 1)}
                      disabled={currentPagination.currentPage === 1}
                      className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <span className="text-sm text-gray-700">
                      Page {currentPagination.currentPage} of {currentPagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(currentPagination.currentPage + 1)}
                      disabled={currentPagination.currentPage === currentPagination.totalPages}
                      className="btn btn-outline btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Todo Form Modal */}
      <TodoForm />
    </div>
  );
};

export default Dashboard;
