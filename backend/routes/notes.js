const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { Sequelize, DataTypes } = require('sequelize');
const router = express.Router();

// Initialize Sequelize instance using DATABASE_URL from environment
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

// Define Note model based on schema.sql
const Note = sequelize.define('Note', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'notes',
  timestamps: false,
});

// Sync model with database (optional, in production use migrations)
sequelize.sync();

// GET /notes - Retrieve all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.findAll({
      order: [['id', 'DESC']],
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// GET /notes/:id - Retrieve a single note by ID
router.get(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('Note ID must be a positive integer'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    try {
      const note = await Note.findByPk(id);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.status(200).json(note);
    } catch (error) {
      console.error('Error fetching note:', error);
      res.status(500).json({ error: 'Failed to fetch note' });
    }
  }
);

// POST /notes - Create a new note
router.post(
  '/',
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Content cannot be empty'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;
    try {
      const note = await Note.create({ title, content });
      res.status(201).json(note);
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ error: 'Failed to create note' });
    }
  }
);

// PUT /notes/:id - Update an existing note
router.put(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('Note ID must be a positive integer'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be between 1 and 200 characters'),
    body('content')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Content cannot be empty'),
    body().custom((value, { req }) => {
      // Ensure at least one field is provided for update
      if (!req.body.title && !req.body.content) {
        throw new Error('At least one of title or content must be provided');
      }
      return true;
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = {};
    if (req.body.title !== undefined) updateData.title = req.body.title;
    if (req.body.content !== undefined) updateData.content = req.body.content;

    try {
      const note = await Note.findByPk(id);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      await note.update(updateData);
      res.status(200).json(note);
    } catch (error) {
      console.error('Error updating note:', error);
      res.status(500).json({ error: 'Failed to update note' });
    }
  }
);

// DELETE /notes/:id - Delete a note by ID
router.delete(
  '/:id',
  [
    param('id').isInt({ gt: 0 }).withMessage('Note ID must be a positive integer'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    try {
      const note = await Note.findByPk(id);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      await note.destroy();
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Failed to delete note' });
    }
  }
);

module.exports = router;