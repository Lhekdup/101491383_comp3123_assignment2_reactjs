const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  salary: {
    type: Number
  },
  date_of_joining: {
    type: Date
  },
  department: {
    type: String,
    trim: true
  },
  profile_image: {
    type: String, // store URL/path like "/uploads/picture.jpg"
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

employeeSchema.pre('save', function (next) {
  this.updated_at = new Date();
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
