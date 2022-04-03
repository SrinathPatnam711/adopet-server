const express = require('express');
const dotenv = require('dotenv').config();
//const cors = require('cors');

const connectDB = require('./config/connectDB');

const raiseRoute = require('./routes/raiseRoutes');
const userRoute = require('./routes/userRoutes');
const authRoute = require('./routes/authRoutes');


const app = express();

//app.use(cors());

//connect to db
connectDB();

//middleware work with incoming request
//set the middleware to parse the data
app.use(express.json());
 
//router to organize our routes
app.use('/api/raises', raiseRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);


const PORT = process.env.PORT | 5000;
app.listen(PORT, 'localhost', () => {
  console.log('Server is running');
});
