const express = require("express");
const mongoose = require("mongoose");

const Student = require("./student");

const app = express();

app.use(express.json());


// ================================
// MongoDB Connection
// ================================
mongoose.connect("mongodb://127.0.0.1:27017/collegeDB")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB Error:", err);
    });


// ================================
// HOME
// GET /
// ================================
app.get("/", (req, res) => {
    res.send("Student CRUD API is running");
});


// ================================
// CREATE STUDENT
// POST /student
// ================================
app.post("/student", async (req, res) => {
    try {

        // Find last student ID
        const lastStudent = await Student.findOne().sort({ id: -1 });

        let newId = 1;

        if (lastStudent) {
            newId = lastStudent.id + 1;
        }

        // Create student
        const student = new Student({
            id: newId,
            name: req.body.name,
            age: req.body.age,
            course: req.body.course
        });

        const savedStudent = await student.save();

        // Send only required fields
        res.status(201).json({
            message: "Student created successfully",
            student: {
                id: savedStudent.id,
                name: savedStudent.name,
                age: savedStudent.age,
                course: savedStudent.course
            }
        });

    } catch (err) {

        res.status(500).json({
            message: "Error creating student",
            error: err.message
        });

    }
});


// ================================
// GET ALL STUDENTS
// GET /student
// ================================
app.get("/student", async (req, res) => {
    try {

        const students = await Student.find();

        const result = students.map(student => ({
            id: student.id,
            name: student.name,
            age: student.age,
            course: student.course
        }));

        res.status(200).json(result);

    } catch (err) {

        res.status(500).json({
            message: "Error getting students",
            error: err.message
        });

    }
});


// ================================
// GET ONE STUDENT
// GET /student/:id
// ================================
app.get("/student/:id", async (req, res) => {
    try {

        const student = await Student.findOne({
            id: Number(req.params.id)
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            id: student.id,
            name: student.name,
            age: student.age,
            course: student.course
        });

    } catch (err) {

        res.status(500).json({
            message: "Error getting student",
            error: err.message
        });

    }
});


// ================================
// UPDATE STUDENT
// PUT /student/:id
// ================================
app.put("/student/:id", async (req, res) => {
    try {

        const student = await Student.findOneAndUpdate(
            {
                id: Number(req.params.id)
            },
            {
                name: req.body.name,
                age: req.body.age,
                course: req.body.course
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student updated successfully",
            student: {
                id: student.id,
                name: student.name,
                age: student.age,
                course: student.course
            }
        });

    } catch (err) {

        res.status(500).json({
            message: "Error updating student",
            error: err.message
        });

    }
});


// ================================
// DELETE STUDENT
// DELETE /student/:id
// ================================
app.delete("/student/:id", async (req, res) => {
    try {

        const student = await Student.findOneAndDelete({
            id: Number(req.params.id)
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully",
            student: {
                id: student.id,
                name: student.name,
                age: student.age,
                course: student.course
            }
        });

    } catch (err) {

        res.status(500).json({
            message: "Error deleting student",
            error: err.message
        });

    }
});


// ================================
// START SERVER
// ================================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});