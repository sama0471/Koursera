const express = require('express');
const courseController = require('../controllers/coursesController');
const Courses = require('../models/courseModel');

// if you want to access params from the parent router
const router = express.Router({ mergeParams : true });  

const advancedResults = require('../middleware/advancedResults');
const auth = require('../middleware/auth');

router.route('/')
    .get(advancedResults(Courses, {
        path : 'bootcamp',
        select : 'name description'
    })
    , courseController.getCourses)
    .post(auth.protect, auth.authorize('publisher', 'admin'), courseController.addCourse);

router.route('/:id')
    .get(courseController.getCourse) 
    .put(auth.protect, auth.authorize('publisher', 'admin'), courseController.updateCourse)
    .delete(auth.protect, auth.authorize('publisher', 'admin'), courseController.deleteCourse);

module.exports = router;
