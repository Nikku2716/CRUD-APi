# Task API

A simple CRUD (Create, Read, Update, Delete) API for managing a to-do list, built with **Node.js** and **Express**. Data is stored in memory — it resets whenever the server restarts.

## Installation & Running

```bash
npm install
npm start
```

The server starts on `http://localhost:3000`.

Interactive API docs (Swagger UI) are available at `http://localhost:3000/docs`.

## Endpoints

| Method | Endpoint       | Description                          | Success Status | Error Status |
|--------|----------------|----------------------------------------|-----------------|--------------|
| GET    | `/`            | API info (name, version, endpoints)    | 200             | —            |
| GET    | `/health`      | Health check                           | 200             | —            |
| GET    | `/tasks`       | List all tasks                         | 200             | —            |
| GET    | `/tasks/:id`   | Get a single task by id                | 200             | 404          |
| POST   | `/tasks`       | Create a new task                      | 201             | 400          |
| PUT    | `/tasks/:id`   | Update a task's title and/or done      | 200             | 400 / 404    |
| DELETE | `/tasks/:id`   | Delete a task                          | 204             | 404          |

## Example Request

```bash
curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'
```

\`\`\`
HTTP/1.1 201 Created
Content-Type: application/json; charset=utf-8

{"id":4,"title":"Buy milk","done":false}
\`\`\`

## Swagger UI

The full CRUD cycle (create, list, update, delete) was tested through Swagger UI's "Try it out" feature at `/docs`.

![Swagger UI screenshot](./screenshot_api.png)

## Notes

- Task data lives entirely in memory (a plain array in `server.js`) — there is no database. Restarting the server resets the task list back to its 3 seed tasks.
- All POST and PUT requests validate the `title` field — a missing or empty title returns `400 Bad Request` with a JSON error message.
- Unknown task ids on GET, PUT, and DELETE return `404 Not Found` with a JSON error message.
