const express = require('express');
const formidable = require('express-formidable');
const { 
    courses,
    uploadImage, removeFile,
    create, read, update,
    videoUpload,
    addLesson, updateLesson, removeLesson,
    publishCourse, unpublishCourse,
    checkEnrolment,
    freeEnrolment, paidEnrolment,
    stripeSuccess,
    userCourses,
    markCompleted, markInCompleted, listCompleted
} = require('../controllers/course');
const { requireSignIn, isInstructor, isEnrolled } = require('../middlewares');

const router = express.Router();

router.get('/courses', courses);

router.post('/course/upload-image', uploadImage);
router.post('/course/remove-file', removeFile);

router.post('/course', requireSignIn, isInstructor, create);
router.put('/course/:slug', requireSignIn, isInstructor, update);
router.get('/course/:slug', read);


router.put('/course/lesson/:slug', requireSignIn, updateLesson);
router.put('/course/:slug/:lessonId', requireSignIn, removeLesson);

router.post('/course/publish/:courseId', requireSignIn, publishCourse);
router.post('/course/unpublish/:courseId', requireSignIn, unpublishCourse);

router.post('/course/video-upload/:instructorId', requireSignIn, isInstructor, formidable(), videoUpload);
router.post('/course/lesson/:slug/:instructorId', requireSignIn, addLesson);

router.get('/check-enrolment/:courseId', requireSignIn, checkEnrolment);
router.post('/free-enrolment/:courseId', requireSignIn, freeEnrolment);
router.post('/paid-enrolment/:courseId', requireSignIn, paidEnrolment);
router.get('/stripe-success/:courseId', requireSignIn, stripeSuccess);

router.get('/user-courses', requireSignIn, userCourses);
router.get('/user/course/:slug', requireSignIn, isEnrolled, read);

router.post('/mark-complete', requireSignIn, markCompleted);
router.post('/mark-incomplete', requireSignIn, markInCompleted);
router.post('/list-completed', requireSignIn, listCompleted);

module.exports = router;