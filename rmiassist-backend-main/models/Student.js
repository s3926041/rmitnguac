const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
    name: String,
    sid: String,
    gender: String,
    password: String,
    course: Array,
  });
  
module.exports = mongoose.model("Student", studentSchema) 