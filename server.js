const Database = require("better-sqlite3");
const db = new Database("tasks.db");
const express = require('express');
const app = express();
const PORT = 3000;
const swaggerUi = require('swagger-ui-express');
const openapiSpec = require('./openapi.json');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT 0
  )
`);

// Seed 3 example tasks only if the table is currently empty
const row = db.prepare('SELECT COUNT(*) AS count FROM tasks').get();

if (row.count === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insert.run('Buy milk', 0);
  insert.run('Walk the dog', 1);
  insert.run('Write assignment', 0);
}



app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));


let tasks = [
  { id: 1, title: "Buy milk", done: false },
  { id: 2, title: "Walk the dog", done: true },
  { id: 3, title: "Write assignment", done: false }
];

app.use(express.json()); // it lets Express parse JSON request bodies

app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = {
    id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    title: title,
    done: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.put('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));

  if (!task){
    return res.status(404).json({error: `Task ${req.params.id} is not found` })
  }

  const { title , done} = req.body;

  if(!title == undefined){
    task.title = title;
  }
  
  if (!done == undefined){
    task.done = done;
  }
  res.json(task);
  
});

app.delete('/tasks/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === Number(req.params.id));
  if (index === -1){
    res.status(404).json({error: `Task ${req.params.id} is not found`})
  }
  tasks.splice(index,1);
  res.status(204).send();
});


app.get('/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (!task) {
    return res.status(404).json({ error: `Task ${req.params.id} not found` });
  }
  res.json(task);
});

app.get('/' , (req,res) => {
    res.json({
        name: "Task API",
        version: "1.0",
        endpoints: ["/tasks"]
    });
});

app.get('/health', (req,res) => {
    res.json({status: "ok"});
});

app.listen(PORT , () => {
    console.log('Server running at http://localhost:${PORT}');
});