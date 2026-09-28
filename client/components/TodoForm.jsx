import { useState } from 'react';

const TodoForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAdd(trimmedTitle);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        aria-label="New todo title"
      />
      <button type="submit" disabled={!title.trim()}>
        Add
      </button>
    </form>
  );
};

export default TodoForm;