const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getAllTasks() {
  const result = await pool.query('SELECT * FROM tasks');
  return result.rows;
}

async function getTaskById(id) {
  const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
  return result.rows[0];
}

async function createTask(title) {
  const result = await pool.query(
    'INSERT INTO tasks (title, done) VALUES ($1, false) RETURNING *',
    [title]
  );
  return result.rows[0];
}

async function updateTask(id, title, done) {
  const result = await pool.query(
    'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
    [title, done, id]
  );
  return result.rows[0];
}

async function deleteTask(id) {
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };