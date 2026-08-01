## Swagger UI

The full CRUD cycle (create, list, update, delete) was tested through Swagger UI's "Try it out" feature at `/docs`.

<p align="center">
  <img src="screenshots/screenshot_api.png" alt="BlackHawk dashboard screenshot" width="100%">
</p>

# Task API

A simple CRUD (Create, Read, Update, Delete) API for managing a to-do list, built with **Node.js**, **Express**, and **SQLite**. Task data is stored persistently in a SQLite database — it survives server restarts.

## Installation & Running

```bash
npm install
npm start
```

The server starts on `http://localhost:3000`. The database file (`tasks.db`) and its `tasks` table are created automatically the first time the server runs — no manual setup needed. Three example tasks are seeded only if the table is empty.

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

{"id":4,"title":"Buy milk","done":0}
\`\`\`

## Swagger UI

The full CRUD cycle (create, list, update, delete) was tested through Swagger UI's "Try it out" feature at `/docs`.

![Swagger UI screenshot](./screenshot_api.png)

## Database

This project uses **SQLite** instead of an in-memory array. SQLite was chosen because it requires no separate server or installation — the entire database lives in a single file, which makes it simple to set up and easy to inspect directly.

- **Database file:** `tasks.db`, created automatically in the project root the first time the server runs.
- **Table:** `tasks`, created automatically if it doesn't exist, with columns `id`, `title`, and `done`.
- **Persistence:** task data now survives server restarts — previously, in the in-memory version, restarting wiped all tasks.

### Example SQL query

```sql
SELECT * FROM tasks WHERE done = 1;
```

This returns only the completed tasks — used while exploring the database directly.

### Database viewer screenshot

![Database viewer](./screenshot_db.png)

## Notes

- SQLite stores booleans as `0`/`1` rather than `true`/`false` — the `done` field in API responses reflects this.
- All POST and PUT requests validate the `title` field — a missing or empty title returns `400 Bad Request` with a JSON error message.
- Unknown task ids on GET, PUT, and DELETE return `404 Not Found` with a JSON error message.