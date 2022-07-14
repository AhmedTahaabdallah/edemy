const express = require('express');
const { 
    makeInstructor, getAccountStatus,
    currentInstructor,
    instructorCourses,
    studentsCount
} = require('../controllers/instructor.js');
const { requireSignIn } = require('../middlewares');

const router = express.Router();

router.post('/make-instructor', requireSignIn, makeInstructor);
router.post('/get-account-status', requireSignIn, getAccountStatus);
router.get('/current-instructor', requireSignIn, currentInstructor);
router.get('/instructor-courses', requireSignIn, instructorCourses);

router.post('/instructor/students-count', requireSignIn, studentsCount);

module.exports = router;