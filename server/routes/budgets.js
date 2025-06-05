const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Budget = require('../models/Budget');
const Project = require('../models/Project');
//const User = require('../models/User');
const SERVICE_CONFIG = require('../utils/services');

// @route   GET api/users
// @desc    Get all users (Admin only)
// @access  Private


// @route   GET /api/budgets
// @desc    Get budgets for a project
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { project } = req.query;
    
    if (!project) {
      return res.status(400).json({ msg: 'Project ID is required' });
    }

    // Verify user has access to this project
    const projectDoc = await Project.findOne({
      _id: project,
      $or: [
        { manager: req.user.id },
        { 'team.user': req.user.id }
      ]
    });
    
    if (!projectDoc) {
      return res.status(403).json({ msg: 'Not authorized to access this project' });
    }

    const budgets = await Budget.find({ project })
      .populate('project', 'name')
      .populate('createdBy', 'name');

    res.json(budgets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/budgets
// @desc    Create a new budget
// @access  Private
router.post('/', [
  auth,
  [
    check('service', 'Service is required').isIn(Object.keys(SERVICE_CONFIG)),
    check('type', 'Type is required').not().isEmpty(),
    check('usage.value', 'Valid usage value is required').isFloat({ min: 0 }),
    check('usage.unit', 'Usage unit is required').isIn(['GB', 'TB', 'Hours', 'Users', 'Licenses']),
    check('period.start', 'Valid start date is required').isISO8601(),
    check('period.end', 'Valid end date is required').isISO8601(),
    check('monthlyCost', 'Valid monthly cost is required').isFloat({ min: 0 }),
    check('actualCost', 'Valid actual cost is required').isFloat({ min: 0 }),
    check('project', 'Valid project ID is required').isMongoId(),
    check('status', 'Invalid status').optional().isIn(['Active', 'Archived', 'Pending'])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { project } = req.body;
    
    // Verify user has access to this project
    const projectDoc = await Project.findOne({
      _id: project,
      $or: [
        { manager: req.user.id },
        { 'team.user': req.user.id }
      ]
    });
    
    if (!projectDoc) {
      return res.status(403).json({ msg: 'Not authorized to add budgets to this project' });
    }

    const budget = new Budget({
      ...req.body,
      createdBy: req.user.id
    });

    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/budgets/:id
// @desc    Update a budget
// @access  Private
router.put('/:id', [
  auth,
  [
    check('service', 'Service is required').optional().isIn(Object.keys(SERVICE_CONFIG)),
    check('type', 'Type is required').optional().not().isEmpty(),
    check('usage.value', 'Valid usage value is required').optional().isFloat({ min: 0 }),
    check('usage.unit', 'Usage unit is required').optional().isIn(['GB', 'TB', 'Hours', 'Users', 'Licenses']),
    check('period.start', 'Valid start date is required').optional().isISO8601(),
    check('period.end', 'Valid end date is required').optional().isISO8601(),
    check('monthlyCost', 'Valid monthly cost is required').optional().isFloat({ min: 0 }),
    check('actualCost', 'Valid actual cost is required').optional().isFloat({ min: 0 }),
    check('status', 'Invalid status').optional().isIn(['Active', 'Archived', 'Pending'])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ msg: 'Budget not found' });
    }

    // Verify user has access to this budget's project
    const project = await Project.findOne({
      _id: budget.project,
      $or: [
        { manager: req.user.id },
        { 'team.user': req.user.id }
      ]
    });
    
    if (!project) {
      return res.status(403).json({ msg: 'Not authorized to update this budget' });
    }

    // Update budget
    const updates = { ...req.body };
    if (updates.service && updates.service !== budget.service) {
      updates.serviceIcon = SERVICE_CONFIG[updates.service].icon;
      updates.serviceColor = SERVICE_CONFIG[updates.service].color;
    }

    budget = await Budget.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json(budget);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/budgets/:id
// @desc    Delete a budget
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ msg: 'Budget not found' });
    }

    // Only project manager can delete budgets
    const project = await Project.findOne({
      _id: budget.project,
      manager: req.user.id
    });
    
    if (!project) {
      return res.status(403).json({ msg: 'Not authorized to delete this budget' });
    }

    await budget.remove();
    res.json({ msg: 'Budget removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;