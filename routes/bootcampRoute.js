const express = require('express');
const bootcampController = require('../controllers/bootcampController');
const Bootcamp = require('../models/bootcampModel');

//Include other Resource Router
const courseRouter = require('./courseRoute');
const reviewRouter = require('./reviewRoute');

const router = express.Router();  

const advancedResults = require('../middleware/advancedResults');
const auth = require('../middleware/auth');

//Re-route into other resource Router
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/')
    .get(advancedResults(Bootcamp, 'courses'), bootcampController.getBootcamps)
    .post(auth.protect, auth.authorize('publisher', 'admin'), bootcampController.createBootcamp);

router.route('/:id')
    .get(bootcampController.getBootcamp)
    .put(auth.protect, auth.authorize('publisher', 'admin'), bootcampController.updateBootcamp)
    .delete(auth.protect, auth.authorize('publisher', 'admin'), bootcampController.deleteBootcamp);

router.route('/radius/:zipcode/:distance')
    .get(bootcampController.getBootcampsInRadius);  

router.route('/:id/photo')
    .put(auth.protect, auth.authorize('publisher', 'admin'), bootcampController.bootcampPhotoUpload);    


module.exports = router;