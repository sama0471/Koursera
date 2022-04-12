const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/userModel');

//Protect Route
exports.protect = asyncHandler(async (req, res, next) =>{
    let token;

    //Set token form bearer token in header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    //Set Token form cookie
    // else if(req.cookies.token){
    //     token = req.cookies.token;
    // }

    //Make sure token exists
    if(!token){
        return next(new ErrorResponse('Not Authorized to access this route', 401));
    }

    try {
        //Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);

        req.user = await User.findById(decoded.id)
        next();
    } catch (error) {
        return next(new ErrorResponse('Not Authorized to access this route', 401));
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorResponse(`User role ${req.user.role} is unauthorized to access this route`, 403));
        }
        next();
    };
};