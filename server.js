const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const path = require('path');

//Load env vars 
dotenv.config({ path : './config/config.env'});

//Connect to Database
connectDB();

//Route files 
const bootcamps = require('./routes/bootcampRoute');
const courses = require('./routes/courseRoute');
const auth = require('./routes/auth');
const users = require('./routes/userRoute');
const reviews = require('./routes/reviewRoute');

const app = express();

//Body-Parser
app.use(express.json());

//cookie-parser
app.use(cookieParser());

//Dev logging Middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//uploading file
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100
  });
  app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Mount Router
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

//Unhandled Promise Rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error : ${err.message}`);
    //Close Server and Exit Process
    server.close(() => { process.exit(1)} );
});