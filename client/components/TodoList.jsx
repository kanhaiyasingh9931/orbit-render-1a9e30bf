import React from 'react';
import PropTypes from 'prop-types';
import TodoItem from './TodoItem.jsx';

function TodoList({ todos, onUpdate, onDelete }) {
  if (!todos || todos.length === 0) {
    return <p>No todos yet. Add one!</p>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {todos.map((todo) => (
        <li key={todo.id} style={{ marginBottom: '0.5rem' }}>
          <TodoItem todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
      createdAt: PropTypes.string,
    })
  ).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TodoList;