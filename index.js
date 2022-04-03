const express = require('express');
const dotenv = require('dotenv').config();

const cors = require('cors');

const connectDB = require('./config/connectDB');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const petRoutes = require("./routes/petRoutes");
const FAQRoutes = require("./routes/FAQRoutes");
const clinicRoutes = require("./routes/clinicRoutes");

const app = express();

app.use(cors());

//connect to db
connectDB();

//middleware work with incoming request
//set the middleware to parse the data
app.use(express.json());
 
//router to organize our routes
app.use('/api/pets', petRoutes);
app.use('/api/faqs', FAQRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clinics', clinicRoutes);

const PORT = process.env.PORT | 5000;

app.listen(PORT, 'localhost', () => {
  console.log('Server is running');
});
