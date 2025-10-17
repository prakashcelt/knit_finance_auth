const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Todo = require('../models/Todo');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all todos for authenticated user
router.get('/', authenticateToken, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
  query('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { user: req.user._id };
    
    if (req.query.completed !== undefined) {
      filter.completed = req.query.completed === 'true';
    }
    
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }

    // Get todos with pagination
    const todos = await Todo.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email');

    // Get total count for pagination
    const total = await Todo.countDocuments(filter);

    res.json({
      todos,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Server error while fetching todos' });
  }
});

// Search todos
router.get('/search', authenticateToken, [
  query('q').notEmpty().withMessage('Search query is required'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Text search with user filter
    const searchResults = await Todo.find({
      $and: [
        { user: req.user._id },
        { $text: { $search: q } }
      ]
    })
    .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email');

    // Alternative search if text index doesn't work (fallback)
    const fallbackResults = await Todo.find({
      user: req.user._id,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email');

    const todos = searchResults.length > 0 ? searchResults : fallbackResults;
    const total = await Todo.countDocuments({
      user: req.user._id,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    });

    res.json({
      todos,
      query: q,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Search todos error:', error);
    res.status(500).json({ message: 'Server error while searching todos' });
  }
});

// Get single todo
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('user', 'name email');

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ todo });
  } catch (error) {
    console.error('Get todo error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid todo ID' });
    }
    res.status(500).json({ message: 'Server error while fetching todo' });
  }
});

// Create new todo
router.post('/', authenticateToken, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().trim().isLength({ max: 20 }).withMessage('Each tag cannot be more than 20 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, description, priority, dueDate, tags } = req.body;

    const todo = new Todo({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags: tags || [],
      user: req.user._id
    });

    await todo.save();
    await todo.populate('user', 'name email');

    res.status(201).json({
      message: 'Todo created successfully',
      todo
    });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Server error while creating todo' });
  }
});

// Update todo
router.put('/:id', authenticateToken, [
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),
  body('description').optional().trim().isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters'),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high'),
  body('dueDate').optional().isISO8601().withMessage('Due date must be a valid date'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().trim().isLength({ max: 20 }).withMessage('Each tag cannot be more than 20 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, description, completed, priority, dueDate, tags } = req.body;
    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (tags !== undefined) updateData.tags = tags;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({
      message: 'Todo updated successfully',
      todo
    });
  } catch (error) {
    console.error('Update todo error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid todo ID' });
    }
    res.status(500).json({ message: 'Server error while updating todo' });
  }
});

// Delete todo
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid todo ID' });
    }
    res.status(500).json({ message: 'Server error while deleting todo' });
  }
});

// Toggle todo completion
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.completed = !todo.completed;
    await todo.save();
    await todo.populate('user', 'name email');

    res.json({
      message: 'Todo status updated successfully',
      todo
    });
  } catch (error) {
    console.error('Toggle todo error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid todo ID' });
    }
    res.status(500).json({ message: 'Server error while updating todo status' });
  }
});

module.exports = router;
