const express = require('express');
const userController = require('../controllers/userController');
const User = require('../models/userModel');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const autho = require('../middleware/auth');

//Check for all the Below Routes
router.use(autho.protect);
router.use(autho.authorize('admin'));

router
  .route('/')
  .get(advancedResults(User), userController.getUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;