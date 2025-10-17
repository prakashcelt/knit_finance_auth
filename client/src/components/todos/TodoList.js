import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleTodo } from '../../store/slices/todoSlice';
import { openModal, addNotification } from '../../store/slices/uiSlice';
import TodoItem from './TodoItem';

const TodoList = ({ todos }) => {
  const dispatch = useDispatch();

  const handleToggle = async (todoId) => {
    try {
      await dispatch(toggleTodo(todoId)).unwrap();
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: 'Failed to update task status',
      }));
    }
  };

  const handleEdit = (todo) => {
    dispatch(openModal({ modal: 'todoModal', data: todo }));
  };

  const handleDelete = (todo) => {
    dispatch(openModal({ modal: 'deleteModal', data: todo }));
  };


  if (todos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No tasks to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onToggle={() => handleToggle(todo._id)}
          onEdit={() => handleEdit(todo)}
          onDelete={() => handleDelete(todo)}
        />
      ))}
    </div>
  );
};

export default TodoList;
