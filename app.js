const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/Routes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const authController = require('./controllers/authController');
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser('3BGlvanzNG'));
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/Environment';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true,})
  .then((result) => app.listen(5000))
  .catch((err) => console.log(err));


  // routes
app.get('*', checkUser);
app.get('/smoothies', requireAuth, (req, res) =>  res.render('smoothies'));
app.get('/construction', requireAuth, (req, res) => res.render('UnderConstruction'));
app.get('/dashboard', requireAuth, (req, res) => res.render('home', {UserId: authController.userid}));
app.get('/Classroom', requireAuth, (req, res) => res.render('ClassTempLoaded'));
app.get('/', requireAuth, (req, res) => res.render('home'));
app.get('/sidebar', requireAuth, (req, res) => res.render('sidebar'));
app.get('/makeClass', requireAuth, (req, res) => res.render('createClassroom'));
app.get('/joinClass', requireAuth, (req, res) => res.render('joinClassroom'));
app.get('/createTemplate', requireAuth, (req, res) => res.render('template'));
app.get('/createAssignment', requireAuth, (req, res) => res.render('createAssignment'));








app.use(authRoutes);
