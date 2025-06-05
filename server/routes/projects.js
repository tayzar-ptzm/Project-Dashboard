const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const Project = require('../models/Project');
const User = require('../models/User');

// @route   GET api/projects
// @desc    Get all projects with filtering and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, manager, search, page = 1, limit = 10 } = req.query;
    const query = {
      $or: [
        { manager: req.user.id },
        { 'team.user': req.user.id }
      ]
    };

    if (status) query.status = status;
    if (manager) query.manager = manager;
    if (search) query.$text = { $search: search };

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: [
        { path: 'manager', select: 'name email avatar' },
        { path: 'team.user', select: 'name email avatar' }
      ]
    };

    const projects = await Project.paginate(query, options);
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/projects
// @desc    Create a new project
// @access  Private (Managers only)
router.post('/', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty().trim(),
    check('description', 'Description is required').not().isEmpty().trim(),
    check('startDate', 'Valid start date is required').isISO8601(),
    check('endDate', 'Valid end date is required').optional().isISO8601(),
    check('budget.allocated', 'Valid budget is required').isFloat({ min: 0 }),
    check('status', 'Invalid status').optional().isIn([
      'Planning', 'Active', 'On Hold', 'Completed', 'Cancelled', 'Delayed'
    ]),
    check('riskLevel', 'Invalid risk level').optional().isIn([
      'Low', 'Medium', 'High', 'Critical'
    ])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Verify user is a manager
    const user = await User.findById(req.user.id);
    if (!user.roles.includes('manager')) {
      return res.status(403).json({ msg: 'Only managers can create projects' });
    }

    const projectData = {
      ...req.body,
      manager: req.user.id,
      budget: {
        allocated: req.body.budget.allocated,
        used: 0,
        remaining: req.body.budget.allocated
      }
    };

    const project = new Project(projectData);
    await project.save();
    
    res.status(201).json(project);
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'Project name already exists' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/projects/:id
// @desc    Get project by ID with detailed information
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('manager', 'name email avatar')
      .populate('team.user', 'name email avatar')
      .populate('remarks.createdBy', 'name email')
      .populate('documents.uploadedBy', 'name email');

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check access
    if (project.manager._id.toString() !== req.user.id && 
        !project.team.some(t => t.user._id.toString() === req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to access this project' });
    }

    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/projects/:id
// @desc    Update project details
// @access  Private (Manager only)
router.put('/:id', [
  auth,
  [
    check('name', 'Name is required').optional().not().isEmpty().trim(),
    check('description', 'Description is required').optional().not().isEmpty().trim(),
    check('status', 'Invalid status').optional().isIn([
      'Planning', 'Active', 'On Hold', 'Completed', 'Cancelled', 'Delayed'
    ]),
    check('progress.percentage', 'Progress must be between 0-100').optional().isInt({ min: 0, max: 100 }),
    check('riskLevel', 'Invalid risk level').optional().isIn([
      'Low', 'Medium', 'High', 'Critical'
    ])
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Verify user is the manager
    if (project.manager.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only project manager can update project' });
    }

    // Prevent updating certain fields directly
    const updates = { ...req.body };
    delete updates.budget; // Budget updates should go through dedicated endpoints
    delete updates.manager;
    delete updates.team;

    // Handle progress update
    if (updates.progress?.percentage !== undefined) {
      updates.progress.lastUpdated = new Date();
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('manager', 'name email');

    res.json(updatedProject);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private (Manager only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Verify user is the manager
    if (project.manager.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Only project manager can delete project' });
    }

    await project.remove();
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;