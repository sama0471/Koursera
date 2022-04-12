const express = require('express');
const reviewController = require('../controllers/reviewController');
const Review = require('../models/reviewModel');

// if you want to access params from the parent router
const router = express.Router({ mergeParams : true });  

const advancedResults = require('../middleware/advancedResults');
const auth = require('../middleware/auth');


router.route('/')
    .get(advancedResults(Review , {
        path : 'bootcamp',
        select : 'name description'
    }) 
    , reviewController.getReviews)
    .post(auth.protect, auth.authorize('user', 'admin'), reviewController.addReview);

router.route('/:id')
    .get(reviewController.getReview)
    .put(auth.protect, auth.authorize('user', 'admin'), reviewController.updateReview)
    .delete(auth.protect, auth.authorize('user', 'admin'), reviewController.deleteReview);


module.exports = router;
