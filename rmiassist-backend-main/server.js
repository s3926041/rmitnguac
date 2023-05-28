const express = require("express");
const mongoose = require("mongoose");
const expressApp = express();
const bodyParser = require("body-parser");

const uri =
  "mongodb+srv://hieule0301:hieule0301@cluster02703.syx3xrh.mongodb.net/student-assistant?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  });

expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());

const students = require("./models/Student");

expressApp.get("/students", async (req, res) => {
  try {
    const foundStudents = await students.find({});
    res.send(foundStudents);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

expressApp.post("/signup", async (req, res) => {
  // Getting data from React Native stored in request body
  try {
    const student = new students({
      s_name: req.body.s_name,
      s_id: req.body.s_s_idid,
      c_id: [],
      g_id: [],
      gender: req.body.gender,
      password: req.body.password,
      items: [],
      c_name: [],
      g_name: [],
    });

    //query to save these pieces of info into MongoDB
    await student.save();

    // send back message to React Native to confirm
    res.send({ message: "Student Created" });
  } catch (error) {
    console.log(error);
  }
});

// Fetching info for login
expressApp.post("/login", async (req, res) => {
  try {
    const studentsFound = await students.find({ s_id: req.body.s_id });
    if (req.body.password === studentsFound[0].password) {
      res.send(studentsFound);
    } else {
      res.send({ studentsFound });
    }
  } catch (error) {
    console.log(error);
  }
});

// Fetching personal info

expressApp.post("/personalInfo", async (req, res) => {
  try {
    const foundStudents = await students.find({ s_id: req.body.s_id });
    res.send(foundStudents);
  } catch (error) {
    console.log(error);
  }
});

// Getting the list items of the current student
expressApp.post("/items", async (req, res) => {
  try {
    const foundStudents = await students.find({ s_id: req.body.s_id });
    foundStudents[0].items.length !== 0
      ? res.send(
          foundStudents[0].items.map((ele) => {
            return JSON.parse(ele);
          })
        )
      : res.send([]);
  } catch (error) {
    console.log(error);
  }
});

// Adding an item to the item list
expressApp.post("/addItem", async (req, res) => {
  try {
    const foundStudents = await students.findOneAndUpdate(
      { s_id: req.body.s_id },
      {
        $push: {
          items: {
            $each: [
              '{"title": "' +
                req.body.title +
                '","startDate": "' +
                req.body.startDate +
                '","endDate": "' +
                req.body.endDate +
                '","location": "' +
                req.body.location +
                '","color": "' +
                req.body.color +
                '"}',
            ],
          },
        },
      }
    );
    res.send({ message: true });
  } catch (error) {
    res.send({ message: false });
    console.log(error);
  }
});

// FOR THE course COLLECTION
const courseSchema = new mongoose.Schema({
  c_id: String,
  c_name: String,
  students: Array,
  groups: Array,
});
const courses = new mongoose.model("course", courseSchema);

expressApp.post("/course", async (req, res) => {
  try {
    const course = new courses({
      c_id: req.body.c_id,
      c_name: req.body.c_name,
      students: [],
      groups: [],
    });
    await course.save();

    // send back message to React Native to confirm
    res.send({ message: "Course Created" });
  } catch (error) {
    console.log(error);
  }
});
// FOR THE GROUPS COLLECTION

const groupsSchema = new mongoose.Schema({
  g_id: String,
  g_name: String,
  s_id: Array,
  c_id: String,
  number_of_member: Number,
  timeline: Array,
});

const groups = new mongoose.model("groups", groupsSchema);
expressApp.post("/groups", async (req, res) => {
  const { groupName, courseId, studentId } = req.body;
  try {
    // Check if the group already exists
    const existingGroup = await groups.findOne({ g_name: groupName });
    if (existingGroup) {
      return res.status(400).json({ error: "Group already exists" });
    }

    // Check if the maximum number of groups for a student has been reached
    const studentGroupCount = await groups.countDocuments({ s_id: studentId });
    if (studentGroupCount >= 4) {
      return res
        .status(400)
        .json({ error: "Maximum number of groups reached for this student" });
    }

    // Check if the maximum number of students for a group has been reached
    const groupMemberCount = await groups.countDocuments({ c_id: courseId });
    if (groupMemberCount >= 5) {
      return res
        .status(400)
        .json({ error: "Maximum number of students reached for this group" });
    }

    // Create a new group document with the provided data
    const group = new Group({
      g_id: groupMemberCount + 1, // Increment the group ID based on existing groups
      g_name: groupName,
      c_id: courseId,
      s_id: studentId, // Set initial student ID
      // number_of_member: 1 // Set initial number of members as 1
    });

    // Save the new group to the database
    await group.save();

    console.log("Group created:", group);
    return res.status(201).json(group); // Return the newly created group object
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({ error: "Internal server error" }); // Throw error for error handling, if needed
  }
});

expressApp.post("/fetchGroups", async (req, res) => {
  try {
    const studentGroups = req.body.groups;
    let studentAllGroups = [];

    // console.log(studentGroups)

    for (const group of studentGroups) {
      const foundGroup = await groups.findOne({ g_id: group });
      if (foundGroup) {
        studentAllGroups.push(foundGroup);
      }
    }
    console.log(studentAllGroups);
    res.json(studentAllGroups);
  } catch (error) {
    console.log(error);
  }
});

const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
expressApp.use("/conversations", conversationRoute);
expressApp.use("/messages", messageRoute);
expressApp.listen(8000, () =>
  console.log("Express Server started on port 8000")
);
