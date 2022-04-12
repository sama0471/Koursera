const course = require('../models/courseModel');
const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const bootcamp = require('../models/bootcampModel');

//@desc   Get Courses
//@route  GET /api/v1/courses
//@route  GET /api/v1/bootcamps/:bootcampId/courses
//@access Public
exports.getCourses = asyncHandler ( async (req, res, next) =>{
    let query;
    if(req.params.bootcampId){
        const courses = await course.find({ bootcamp : req.params.bootcampId });

        res.status(200).json({success : true, count : courses.length, data : courses});
    }
    else{
        res.status(200).json(res.advancedResults);
    }
});


//@desc   Get Single Courses
//@route  GET /api/v1/courses/:id
//@access Public
exports.getCourse = asyncHandler ( async (req, res, next) =>{
   
    const singleCourse = await course.findById(req.params.id).populate({
        path : 'bootcamp',
        select : 'name description'
    });

    if(!singleCourse) {
        return next(new ErrorResponse(`No Course with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success : true, data : singleCourse });
});

//@desc   Add Course
//@route  POST /api/v1/bootcamps/:bootcampId/courses    
//@access Private
exports.addCourse = asyncHandler ( async (req, res, next) =>{

    req.body.bootcamp = req.params.bootcampId
    req.body.user = req.user.id;
   
    const singleBootcamp = await bootcamp.findById(req.params.bootcampId);

    if(!singleBootcamp) {
        return next(new ErrorResponse(`No Bootcamp with the id of ${req.params.bootcampId}`, 404));
    }

    if(singleBootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to ${singleBootcamp._id}`, 401));
    }

    const newCourse = await course.create(req.body);

    res.status(200).json({ success : true, data : newCourse });
});


//@desc   Update Course
//@route  PUT /api/v1/courses/:id    
//@access Private
exports.updateCourse = asyncHandler ( async (req, res, next) =>{
   
    let updatedCourse = await course.findById(req.params.id);

    if(!updatedCourse) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }

    if(updatedCourse.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update course ${course._id}`, 401));
    }


    updatedCourse = await course.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true
    });

    res.status(200).json({ success : true, data : updatedCourse });
});

//@desc   Delete Course
//@route  DELETE /api/v1/courses/:id    
//@access Private
exports.deleteCourse = asyncHandler ( async (req, res, next) =>{
   
    const deletedCourse = await course.findById(req.params.id);

    if(!deletedCourse) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }

    if(deletedCourse.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete course ${course._id}`, 401));
    }

    await deletedCourse.deleteOne();

    res.status(200).json({success: true, data: {}});
});