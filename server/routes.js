import { Router } from 'express';
import { randomUUID } from 'crypto';
import db from './db.js';

const router = Router();

// Ensure database is loaded before handling requests
router.use(async (req, res, next) => {
  if (!db.data) {
    await db.read();
    db.data ??= { todos: [] };
    await db.write();
  }
  next();
});

// GET /todos - Retrieve all todo items
router.get('/', async (req, res) => {
  try {
    const todos = db.data.todos || [];
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /todos - Create a new todo item
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }

    const newTodo = {
      id: randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    db.data.todos.push(newTodo);
    await db.write();

    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT /todos/:id - Update an existing todo item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todoIndex = db.data.todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const todo = db.data.todos[todoIndex];

    // Update title if provided
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title must be a non-empty string' });
      }
      todo.title = title.trim();
    }

    // Update completed status if provided
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'Completed must be a boolean' });
      }
      todo.completed = completed;
    }

    await db.write();

    res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /todos/:id - Remove a todo item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const todoIndex = db.data.todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const [deletedTodo] = db.data.todos.splice(todoIndex, 1);
    await db.write();

    res.json(deletedTodo);
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router;