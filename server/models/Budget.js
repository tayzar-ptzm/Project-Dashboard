const mongoose = require('mongoose');
const SERVICE_CONFIG = require('../utils/services');

const BudgetSchema = new mongoose.Schema({
  service: {
    type: String,
    required: [true, 'Service is required'],
    enum: {
      values: Object.keys(SERVICE_CONFIG),
      message: 'Invalid service selected'
    }
  },
  serviceIcon: {
    type: String,
    default: function() {
      return SERVICE_CONFIG[this.service].icon;
    }
  },
  serviceColor: {
    type: String,
    default: function() {
      return SERVICE_CONFIG[this.service].color;
    }
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['Compute', 'Storage', 'Database', 'Network', 'Software', 'Support']
  },
  usage: {
    value: { 
      type: Number, 
      required: [true, 'Usage value is required'],
      min: [0, 'Usage value cannot be negative']
    },
    unit: { 
      type: String, 
      required: [true, 'Usage unit is required'],
      enum: ['GB', 'TB', 'Hours', 'Users', 'Licenses']
    }
  },
  period: {
    start: { 
      type: Date, 
      required: [true, 'Start date is required'],
      validate: {
        validator: function(date) {
          return date <= this.period.end;
        },
        message: 'Start date must be before end date'
      }
    },
    end: { 
      type: Date, 
      required: [true, 'End date is required'],
      validate: {
        validator: function(date) {
          return date >= this.period.start;
        },
        message: 'End date must be after start date'
      }
    }
  },
  monthlyCost: {
    type: Number,
    required: [true, 'Monthly cost is required'],
    min: [0, 'Monthly cost cannot be negative']
  },
  actualCost: {
    type: Number,
    required: [true, 'Actual cost is required'],
    min: [0, 'Actual cost cannot be negative']
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project ID is required']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: String,
  status: {
    type: String,
    enum: ['Active', 'Archived', 'Pending'],
    default: 'Active'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      ret.period.start = ret.period.start.toISOString().split('T')[0];
      ret.period.end = ret.period.end.toISOString().split('T')[0];
      return ret;
    }
  }
});

// Calculate variance on the fly
BudgetSchema.virtual('variance').get(function() {
  return this.actualCost - this.monthlyCost;
});

// Update icon/color if service changes
BudgetSchema.pre('save', function(next) {
  if (this.isModified('service')) {
    this.serviceIcon = SERVICE_CONFIG[this.service].icon;
    this.serviceColor = SERVICE_CONFIG[this.service].color;
  }
  next();
});

module.exports = mongoose.model('Budget', BudgetSchema);