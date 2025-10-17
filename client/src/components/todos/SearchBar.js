import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { clearSearchResults } from '../../store/slices/todoSlice';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const onSearchRef = useRef(onSearch);

  // Update the ref when onSearch changes
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        onSearchRef.current(query);
      } else {
        dispatch(clearSearchResults());
      }
    }, 500); // Increased debounce time to 500ms

    return () => clearTimeout(timeoutId);
  }, [query, dispatch]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    dispatch(clearSearchResults());
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="input pl-10 pr-10 w-full"
        placeholder="Search tasks by title, description, or tags..."
      />
      
      {query && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            onClick={handleClear}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
