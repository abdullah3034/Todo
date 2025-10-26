const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES //

// create a todo
app.post('/todos', async (req, res) => {
  try {
    const { title, description, priority = 'medium', category = 'general' } = req.body;
    const newTodo = await pool.query(
      'INSERT INTO todos (title, description, priority, category) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, priority, category]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get all todos
app.get('/todos', async (req, res) => {
  try {
    const allTodos = await pool.query('SELECT * FROM todos');
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// get a single todo
app.get('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query('SELECT * FROM todos WHERE todo_id = $1', [id]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// update a todo
app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, category, completed } = req.body;
    await pool.query(
      'UPDATE todos SET title = $1, description = $2, priority = $3, category = $4, completed = $5 WHERE todo_id = $6',
      [title, description, priority, category, completed, id]
    );
    res.json({ message: 'Todo updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// delete a todo
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM todos WHERE todo_id = $1', [id]);
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Export app for testing
module.exports = app;

// Start server only if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
