// controllers/studentController.js
const mongoose = require('mongoose'); 
const Student = require('../models/Student');
const { syncStudentData } = require('../services/codeforcesService');
const papaparse = require('papaparse');

// @desc    Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({}).sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single student by ID
exports.getStudentById = async (req, res) => {
  try { 
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid student ID format' });
    }
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student by ID:', error); 
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a student
exports.createStudent = async (req, res) => {
    try {
        const { name, email, phone, codeforcesHandle } = req.body;
        
        let student = await Student.findOne({ $or: [{ email }, { codeforcesHandle }] });
        if (student) {
            return res.status(400).json({ message: 'Student with this email or handle already exists.' });
        }

        student = new Student({ name, email, phone, codeforcesHandle });
        // First save, then sync
        await student.save();
        // Trigger initial sync in the background
        syncStudentData(student).then(updatedStudent => {
            console.log(`Initial sync complete for ${updatedStudent.codeforcesHandle}`);
        }).catch(err => {
            console.error(`Initial sync failed for ${codeforcesHandle}: ${err.message}`);
        });
        
        res.status(201).json({ message: "Student created successfully. Data is being synced.", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a student
exports.updateStudent = async (req, res) => {
    try {
        let student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const oldHandle = student.codeforcesHandle;
        const { name, email, phone, codeforcesHandle, emailRemindersEnabled } = req.body;

        student.name = name || student.name;
        student.email = email || student.email;
        student.phone = phone || student.phone;
        student.codeforcesHandle = codeforcesHandle || student.codeforcesHandle;
        if (emailRemindersEnabled !== undefined) {
            student.emailRemindersEnabled = emailRemindersEnabled;
        }

        await student.save();
        
        // If handle changed, trigger a real-time sync
        if (codeforcesHandle && codeforcesHandle !== oldHandle) {
             syncStudentData(student).then(updatedStudent => {
                console.log(`Re-sync complete for handle change: ${updatedStudent.codeforcesHandle}`);
             }).catch(err => {
                console.error(`Re-sync failed for ${codeforcesHandle}: ${err.message}`);
             });
        }
        
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a student
exports.deleteStudent = async (req, res) => {
    try {
        // Use findByIdAndDelete which finds the document and deletes it in one atomic operation.
        const student = await Student.findByIdAndDelete(req.params.id);

        // If no student was found with that ID, findByIdAndDelete returns null.
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // If successful, send a success response.
        res.json({ message: 'Student removed successfully' });
    } catch (error) {
        // If there's a database error (e.g., invalid ID format), catch it.
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Manual sync for a student
exports.forceSync = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        await syncStudentData(student);
        res.json({ message: 'Sync successful', student });
    } catch (error) {
        res.status(500).json({ message: 'Sync failed' });
    }
};

// @desc    Download all student data as CSV
exports.downloadCSV = async (req, res) => {
    try {
        const students = await Student.find({}, 'name email phone codeforcesHandle currentRating maxRating lastUpdated').lean();
        const csv = papaparse.unparse(students);

        res.header('Content-Type', 'text/csv');
        res.attachment('students.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: 'Failed to generate CSV' });
    }
};