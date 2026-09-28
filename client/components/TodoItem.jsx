import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * TodoItem – renders a single todo with edit, toggle‑complete and delete actions.
 *
 * @param {Object}   props
 * @param {Object}   props.todo      The todo object { id, title, completed, createdAt }
 * @param {Function} props.onUpdate  Callback invoked with the updated todo
 * @param {Function} props.onDelete  Callback invoked with the id of the todo to delete
 */
export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);

  // Toggle completed flag
  const handleToggle = () => {
    onUpdate({ ...todo, completed: !todo.completed });
  };

  // Enter edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Cancel editing and revert title
  const handleCancel = () => {
    setTitle(todo.title);
    setIsEditing(false);
  };

  // Save edited title
  const handleSave = () => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== todo.title) {
      onUpdate({ ...todo, title: trimmed });
    }
    setIsEditing(false);
  };

  // Delete todo (confirm first)
  const handleDelete = () => {
    if (window.confirm('Delete this todo?')) {
      onDelete(todo.id);
    }
  };

  // Keyboard shortcuts while editing
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <li className="todo-item flex items-center justify-between p-2 border-b">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          aria-label={`Mark ${todo.title} as ${todo.completed ? 'incomplete' : 'complete'}`}
          className="mr-2"
        />
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border rounded px-1 py-0.5"
            autoFocus
          />
        ) : (
          <span
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            className="todo-title"
          >
            {todo.title}
          </span>
        )}
      </div>

      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button onClick={handleSave} className="text-green-600 hover:underline">
              Save
            </button>
            <button onClick={handleCancel} className="text-gray-600 hover:underline">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={handleEdit} className="text-blue-600 hover:underline">
              Edit
            </button>
            <button onClick={handleDelete} className="text-red-600 hover:underline">
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};