import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";

const app = express();
app.use(bodyParser.json());

// Create SQLite database and table
const db = new sqlite3.Database(":memory:");
db.run(`
  CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT NOT NULL
  )
`);

// Get all accounts
app.get("/accounts", (req: Request, res: Response) => {
  db.all("SELECT * FROM accounts", (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(rows);
    }
  });
});

// Get account by ID
app.get("/accounts/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  db.get("SELECT * FROM accounts WHERE id = ?", id, (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else if (!row) {
      res.status(404).json({ error: "Account not found" });
    } else {
      res.json(row);
    }
  });
});

// Create a new account
app.post("/accounts", (req: Request, res: Response) => {
  const { name, address, phone, email } = req.body;
  db.run(
    "INSERT INTO accounts (name, address, phone, email) VALUES (?, ?, ?, ?)",
    [name, address, phone, email],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        const accountId = this.lastID;
        res.status(201).json({ id: accountId, name, address, phone, email });
      }
    }
  );
});

// Update an existing account
app.put("/accounts/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  const { name, address, phone, email } = req.body;
  db.run(
    "UPDATE accounts SET name = ?, address = ?, phone = ?, email = ? WHERE id = ?",
    [name, address, phone, email, id],
    function (err) {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      } else if (this.changes === 0) {
        res.status(404).json({ error: "Account not found" });
      } else {
        res.json({ id, name, address, phone, email });
      }
    }
  );
});

// Delete an account
app.delete("/accounts/:id", (req: Request, res: Response) => {
  const id = req.params.id;
  db.run("DELETE FROM accounts WHERE id = ?", id, function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else if (this.changes === 0) {
      res.status(404).json({ error: "Account not found" });
    } else {
      res.status(204).end();
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
