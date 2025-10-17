import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  theme: 'light',
  notifications: [],
  modals: {
    todoModal: false,
    profileModal: false,
    deleteModal: false,
  },
  selectedTodo: null,
  loading: {
    global: false,
    todos: false,
    auth: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: 'info',
        duration: 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action) => {
      const { modal, data } = action.payload;
      state.modals[modal] = true;
      if (data) {
        state.selectedTodo = data;
      }
    },
    closeModal: (state, action) => {
      const modal = action.payload;
      state.modals[modal] = false;
      if (modal === 'todoModal' || modal === 'deleteModal') {
        state.selectedTodo = null;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
      state.selectedTodo = null;
    },
    setLoading: (state, action) => {
      const { type, loading } = action.payload;
      state.loading[type] = loading;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
