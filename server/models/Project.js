const mongoose = require('mongoose');


const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Project name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled', 'Delayed'],
      message: 'Invalid project status'
    },
    default: 'Planning'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
    validate: {
      validator: function(date) {
        if (!this.endDate) return true;
        return date <= this.endDate;
      },
      message: 'Start date must be before end date'
    }
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(date) {
        if (!this.startDate) return true;
        return date >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  budget: {
    allocated: {
      type: Number,
      required: [true, 'Allocated budget is required'],
      min: [0, 'Budget cannot be negative']
    },
    used: {
      type: Number,
      default: 0,
      min: [0, 'Used budget cannot be negative']
    },
    remaining: {
      type: Number,
      default: function() {
        return this.budget.allocated - this.budget.used;
      },
      min: [0, 'Remaining budget cannot be negative']
    }
  },
  progress: {
    percentage: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
      max: [100, 'Progress cannot exceed 100%']
    },
    lastUpdated: Date
  },
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Low'
  },
  risks: [{
    description: String,
    impact: String,
    mitigation: String,
    dateIdentified: {
      type: Date,
      default: Date.now
    }
  }],
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project manager is required']
  },
  team: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: [true, 'Team member is required']
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: ['Developer', 'Designer', 'QA', 'Analyst', 'Architect', 'Other']
    },
    allocation: {
      type: Number,
      min: [0, 'Allocation cannot be negative'],
      max: [100, 'Allocation cannot exceed 100%'],
      default: 100
    }
  }],
  milestones: [{
    name: String,
    description: String,
    dueDate: Date,
    completed: Boolean,
    completionDate: Date
  }],
  remarks: [{
    text: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  documents: [{
    name: String,
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Calculate remaining budget before save
ProjectSchema.pre('save', function(next) {
  this.budget.remaining = this.budget.allocated - this.budget.used;
  
  // Update progress timestamp if percentage changed
  if (this.isModified('progress.percentage')) {
    this.progress.lastUpdated = new Date();
  }
  
  next();
});

// Add text index for search
ProjectSchema.index({ 
  name: 'text', 
  description: 'text', 
  'risks.description': 'text',
  'remarks.text': 'text'
});

module.exports = mongoose.model('Project', ProjectSchema);