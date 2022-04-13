const express = require('express');
const dotenv = require('dotenv').config();
const fileUpload = require('express-fileupload');
const path = require('path');

const cors = require('cors');

const connectDB = require('./config/connectDB');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const petRoutes = require("./routes/petRoutes");
const FAQRoutes = require("./routes/FAQRoutes");
const clinicRoutes = require("./routes/clinicRoutes");
const raiseRoute = require('./routes/raiseRoutes');
const eventRoute = require('./routes/eventRoutes');
const aboutRoute = require('./routes/aboutRoutes');

const app = express();

app.use(cors());

//file upload
app.use(fileUpload());
app.use(express.static('public'))

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
app.use('/api/raises', raiseRoute);
app.use('/api/abouts', aboutRoute);
app.use('/api/events', eventRoute);

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.myFile;

  const extfile = path.extname(file.name);

  const allowedext = ['.png', '.jpg', '.gif'];

  if (!allowedext.includes(extfile)) {
    return res.status(400).send('invalid image format.');
  }

  const upath = 'public/uploads/' + file.name;

  file.mv(upath, function (err) {
    if (err) return res.status(500).send(err);
    res.send('File uploaded!');
  });
});


app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.myFile;

  
    const upath = 'public/uploads/' + file.name;

  file.mv(upath, function (err) {
    if (err) return res.status(500).send(err);
    res.send('File uploaded!');
  });
});


const PORT = process.env.PORT | 5000;
 
app.listen(PORT, 'localhost', () => {
  console.log('Server is running');
});
