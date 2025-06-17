// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    forceSync,
    downloadCSV
} = require('../controllers/studentControllers');

router.route('/').get(getAllStudents).post(createStudent);
router.route('/download').get(downloadCSV);
router.route('/:id').get(getStudentById).put(updateStudent).delete(deleteStudent);
router.route('/:id/sync').post(forceSync);

module.exports = router;