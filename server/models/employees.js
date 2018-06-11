const mongoose = require('mongoose');

const { Schema } = mongoose;

const EmployeeSchema = new Schema({
  department: { type: String },
  name: { type: String },
  email: { type: String },
  photo: { type: String },
});

module.exports = mongoose.model('Employees', EmployeeSchema);
