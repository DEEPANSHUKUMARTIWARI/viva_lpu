const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// Get all tasks for user
router.get('/', authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(tasks);
});

// Create a new task
router.post('/', authMiddleware, async (req, res) => {
  const { title } = req.body;
  const task = new Task({ title, user: req.user.id });
  await task.save();
  res.status(201).json(task);
});

// Update a task
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, completed } = req.body;
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (title !== undefined) task.title = title;
  if (completed !== undefined) task.completed = completed;

  await task.save();
  res.json(task);
});

// Delete a task
router.delete('/:id', authMiddleware, async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  res.json({ message: 'Task deleted' });
});

module.exports = router;

