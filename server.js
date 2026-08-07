require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3000;
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');
const taskRepository = require('./taskRepository');

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.get('/', (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

app.get('/tasks', async (req, res) => {
  const tasks = await taskRepository.getAllTasks();
  res.json(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const task = await taskRepository.getTaskById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }
  res.json(task);
});

app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: "Title is required" });
  }
  const newTask = await taskRepository.createTask(title);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
  const existing = await taskRepository.getTaskById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }
  const title = req.body.title !== undefined ? req.body.title : existing.title;
  const done = req.body.done !== undefined ? req.body.done : existing.done;
  const updated = await taskRepository.updateTask(req.params.id, title, done);
  res.json(updated);
});

app.delete('/tasks/:id', async (req, res) => {
  const existing = await taskRepository.getTaskById(req.params.id);
  if (!existing) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }
  await taskRepository.deleteTask(req.params.id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});