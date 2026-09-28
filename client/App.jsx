import { useState, useEffect, useCallback } from 'react';
import TodoList from './components/TodoList.jsx';
import TodoForm from './components/TodoForm.jsx';

const API_BASE = '/api';

async function fetchTodos() {
  const res = await fetch(`${API_BASE}/todos`);
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

async function createTodo(title) {
  const res = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Failed to create todo');
  return res.json();
}

async function updateTodo(id, updates) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update todo');
  return res.json();
}

async function deleteTodo(id) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete todo');
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTodos = useCallback(async () => {
    try {
      const data = await fetchTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleAdd = async (title) => {
    try {
      const newTodo = await createTodo(title);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updated = await updateTodo(id, updates);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>Todo App</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
          {error}
          <button onClick={loadTodos} style={{ marginLeft: '0.5rem' }}>Retry</button>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <TodoForm onAdd={handleAdd} />
          <TodoList todos={todos} onUpdate={handleUpdate} onDelete={handleDelete} />
        </>
      )}
    </div>
  );
}