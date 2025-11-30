const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const Employee = require('../models/Employee');
const auth = require('../middleware/auth');

const employeeRouter = express.Router();

// ====== Multer config for image upload ======
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  }
});

// Protect all employee routes with JWT
employeeRouter.use(auth);

// ====== GET /api/v1/emp/employees (all employees) ======
employeeRouter.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({
      status: true,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
});

// ====== SEARCH: GET /api/v1/emp/employees/search ======
// Example: /employees/search?department=IT
//          /employees/search?position=Manager
employeeRouter.get('/employees/search', async (req, res) => {
  try {
    const { department, position } = req.query;

    if (!department && !position) {
      return res.status(400).json({
        status: false,
        message: 'Please provide department or position to search'
      });
    }

    const filter = {};
    if (department) {
      filter.department = { $regex: department, $options: 'i' };
    }
    if (position) {
      filter.position = { $regex: position, $options: 'i' };
    }

    const employees = await Employee.find(filter);

    return res.status(200).json({
      status: true,
      data: employees
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
});

// ====== POST /api/v1/emp/employees (Create employee) ======
employeeRouter.post(
  '/employees',
  upload.single('profile_image'),
  [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('position').optional().isString(),
    body('salary').optional().isNumeric(),
    body('date_of_joining').optional().isISO8601().toDate(),
    body('department').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    try {
      const {
        first_name,
        last_name,
        email,
        position,
        salary,
        date_of_joining,
        department
      } = req.body;

      const profileImagePath = req.file
        ? `/uploads/${req.file.filename}`
        : null;

      const employee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        first_name,
        last_name,
        email,
        position,
        salary,
        date_of_joining,
        department,
        profile_image: profileImagePath
      });

      await employee.save();

      res.status(201).json({
        status: true,
        message: 'Employee created successfully',
        employee_id: employee._id,
        data: employee
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }
);

// ====== GET /api/v1/emp/employees/:eid ======
employeeRouter.get('/employees/:eid', async (req, res) => {
  const { eid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eid)) {
    return res.status(400).json({
      status: false,
      message: 'Invalid employee ID'
    });
  }

  try {
    const employee = await Employee.findById(eid);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: `Employee for this ID ${eid} is not found`
      });
    }

    res.status(200).json({
      status: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
});

// ====== PUT /api/v1/emp/employees/:eid (Update) ======
employeeRouter.put(
  '/employees/:eid',
  upload.single('profile_image'),
  [
    body('email').optional().isEmail().withMessage('Email must be valid'),
    body('salary').optional().isNumeric().withMessage('Salary must be a number'),
    body('date_of_joining').optional().isISO8601().toDate()
  ],
  async (req, res) => {
    const { eid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eid)) {
      return res.status(400).json({
        status: false,
        message: 'Invalid employee ID'
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    try {
      const updateData = { ...req.body };

      if (req.file) {
        updateData.profile_image = `/uploads/${req.file.filename}`;
      }

      const employee = await Employee.findByIdAndUpdate(eid, updateData, {
        new: true
      });

      if (!employee) {
        return res.status(404).json({
          status: false,
          message: `Employee for this ID ${eid} is not found`
        });
      }

      res.status(200).json({
        status: true,
        message: 'Employee details updated successfully',
        data: employee
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: error.message
      });
    }
  }
);

// ====== DELETE /api/v1/emp/employees/:eid ======
employeeRouter.delete('/employees/:eid', async (req, res) => {
  const { eid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(eid)) {
    return res.status(400).json({
      status: false,
      message: 'Invalid employee ID'
    });
  }

  try {
    const employee = await Employee.findByIdAndDelete(eid);
    if (!employee) {
      return res.status(404).json({
        status: false,
        message: `Employee for this ID ${eid} is not found`
      });
    }

    return res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
});

module.exports = employeeRouter;
