const review = require('../models/reviewModel');
const ErrorResponse = require('./../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const bootcamp = require('../models/bootcampModel');

//@desc   Get Reviews
//@route  GET /api/v1/reviews
//@route  GET /api/v1/bootcamps/:bootcampId/reviews
//@access Public
exports.getReviews = asyncHandler ( async (req, res, next) =>{
    let query;
    if(req.params.bootcampId){
        const reviews = await review.find({ bootcamp : req.params.bootcampId });

        res.status(200).json({success : true, count : reviews.length, data : reviews});
    }
    else{
        res.status(200).json(res.advancedResults);
    }
});


//@desc   Get Single Review
//@route  GET /api/v1/reviews/:id
//@access Public
exports.getReview = asyncHandler ( async (req, res, next) =>{
    const singleReview = await review.findById(req.params.id).populate({
        path : 'bootcamp',
        select : 'name description'
    });
    
    if(!singleReview){
        return next(new ErrorResponse(`No review find with ID of ${req.params.id}`, 404));
    }

    res.status(200).json({success : true, data : singleReview});
});


//@desc   Add Review
//@route  POST /api/v1/bootcamps/:bootcampId/reviews
//@access Private
exports.addReview = asyncHandler ( async (req, res, next) =>{
   
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const singleBootcamp = await bootcamp.findById(req.params.bootcampId);

    if(!singleBootcamp){
        return next(new ErrorResponse(`No Bootcamp found with id of ${req.params.bootcampId}`, 404));
    }

    const newReview = await review.create(req.body);

    res.status(201).json({success : true, data : newReview});
});

//@desc   Update review
//@route  PUT /api/v1/reviews/:id
//@access Private
exports.updateReview = asyncHandler ( async (req, res, next) =>{
   
    let singleReview = await review.findById(req.params.id);

    if(!singleReview){
        return next(new ErrorResponse(`No Review found with id of ${req.params.id}`, 404));
    }

    if(singleReview.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not authorized to upadte review`, 401));
    }

    singleReview = await review.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true
    });

    res.status(200).json({success : true, data : singleReview});
});


//@desc   Delete Review
//@route  DELETE /api/v1/reviews/:id
//@access Private
exports.deleteReview = asyncHandler ( async (req, res, next) =>{
   
    const singleReview = await review.findById(req.params.id);

    if(!singleReview){
        return next(new ErrorResponse(`No Review found with id of ${req.params.id}`, 404));
    }

    if(singleReview.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(new ErrorResponse(`Not authorized to delete review`, 401));
    }

    await singleReview.remove();

    res.status(200).json({success : true, data : {} });
});