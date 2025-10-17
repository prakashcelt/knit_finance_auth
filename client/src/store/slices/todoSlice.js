import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Async thunks
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await axios.get(`${API_URL}/todos?${queryParams}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch todos'
      );
    }
  }
);

export const searchTodos = createAsyncThunk(
  'todos/searchTodos',
  async (searchParams, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] !== undefined && searchParams[key] !== '') {
          queryParams.append(key, searchParams[key]);
        }
      });
      
      const response = await axios.get(`${API_URL}/todos/search?${queryParams}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Search failed'
      );
    }
  }
);

export const fetchTodo = createAsyncThunk(
  'todos/fetchTodo',
  async (todoId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/todos/${todoId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch todo'
      );
    }
  }
);

export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (todoData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, todoData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create todo'
      );
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, todoData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, todoData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update todo'
      );
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (todoId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/todos/${todoId}`, {
        withCredentials: true,
      });
      return todoId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete todo'
      );
    }
  }
);

export const toggleTodo = createAsyncThunk(
  'todos/toggleTodo',
  async (todoId, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_URL}/todos/${todoId}/toggle`, {}, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to toggle todo'
      );
    }
  }
);

const initialState = {
  todos: [],
  currentTodo: null,
  searchResults: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  loading: false,
  error: null,
  searchQuery: '',
  filters: {
    completed: undefined,
    priority: undefined,
  },
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        completed: undefined,
        priority: undefined,
      };
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload.todos;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search todos
      .addCase(searchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.todos;
        state.searchQuery = action.payload.query;
        state.pagination = action.payload.pagination;
      })
      .addCase(searchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single todo
      .addCase(fetchTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTodo = action.payload.todo;
      })
      .addCase(fetchTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create todo
      .addCase(createTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos.unshift(action.payload.todo);
      })
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update todo
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.todos.findIndex(todo => todo._id === action.payload.todo._id);
        if (index !== -1) {
          state.todos[index] = action.payload.todo;
        }
        if (state.currentTodo && state.currentTodo._id === action.payload.todo._id) {
          state.currentTodo = action.payload.todo;
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete todo
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = state.todos.filter(todo => todo._id !== action.payload);
        if (state.currentTodo && state.currentTodo._id === action.payload) {
          state.currentTodo = null;
        }
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle todo
      .addCase(toggleTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.todos.findIndex(todo => todo._id === action.payload.todo._id);
        if (index !== -1) {
          state.todos[index] = action.payload.todo;
        }
        if (state.currentTodo && state.currentTodo._id === action.payload.todo._id) {
          state.currentTodo = action.payload.todo;
        }
      })
      .addCase(toggleTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  clearError, 
  clearSearchResults, 
  setFilters, 
  clearFilters, 
  setCurrentPage 
} = todoSlice.actions;

export default todoSlice.reducer;
