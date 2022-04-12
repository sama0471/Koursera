const mongoose = require('mongoose');
const asyncHandler = require('../middleware/async');

const connectDB = asyncHandler( async () => {
    const con = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser : true,
        useCreateIndex : true,
        useFindAndModify : false,
        useUnifiedTopology: true
    });

    console.log('MongoDB connected!');
});

module.exports = connectDB;