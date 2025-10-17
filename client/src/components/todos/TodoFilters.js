import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchTodos, clearFilters } from '../../store/slices/todoSlice';

const TodoFilters = ({ filters, onFilterChange, showSearchResults, onClearSearch }) => {
  const dispatch = useDispatch();

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchTodos({ page: 1, limit: 10 }));
  };

  const hasActiveFilters = filters.completed !== undefined || filters.priority !== undefined;

  return (
    <div className="flex items-center space-x-3">
      {/* Status Filter */}
      <select
        value={filters.completed || ''}
        onChange={(e) => handleFilterChange('completed', e.target.value || undefined)}
        className="input text-sm"
      >
        <option value="">All Status</option>
        <option value="false">Pending</option>
        <option value="true">Completed</option>
      </select>

      {/* Priority Filter */}
      <select
        value={filters.priority || ''}
        onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
        className="input text-sm"
      >
        <option value="">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="btn btn-ghost btn-sm text-gray-600 hover:text-gray-900"
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear
        </button>
      )}

      {/* Clear Search */}
      {showSearchResults && (
        <button
          onClick={onClearSearch}
          className="btn btn-ghost btn-sm text-blue-600 hover:text-blue-800"
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Clear Search
        </button>
      )}
    </div>
  );
};

export default TodoFilters;
