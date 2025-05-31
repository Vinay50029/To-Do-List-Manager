const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

router.post("/", (req, res) => {
  const { title } = req.body;
  db.query("INSERT INTO tasks (title) VALUES (?)", [title], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId, title, completed: false });
  });
});

router.put("/:id", (req, res) => {
  const { title, completed } = req.body;
  db.query("UPDATE tasks SET title = ?, completed = ? WHERE id = ?", [title, completed, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Task updated" });
  });
});

router.delete("/:id", (req, res) => {
  db.query("DELETE FROM tasks WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Task deleted" });
  });
});

// PATCH route to mark a task as completed
router.patch("/:id", (req, res) => {
  const taskId = req.params.id;
  
  // Update the 'completed' column to true (1) for the specified task
  db.query(
    "UPDATE tasks SET completed = 1 WHERE id = ?",
    [taskId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });

      // If no rows were affected, the task wasn't found
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found" });
      }

      res.json({ message: "Task marked as done" });
    }
  );
});


module.exports = router;