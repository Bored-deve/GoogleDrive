// requirements
const express = require('express');
const app = express();
const morgan = require('morgan')
const userRouter = require('./routes/user.routes');
const dotenv = require('dotenv');
const connectToDb = require('./config/db');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index.routes');

// middlewares
app.use(morgan('dev')) //external middleware to show what's going on in the console
app.use(express.json()) // internal middleware to make my server able to understand json data
app.use(cookieParser()) // internal middleware to make my server able to understand cookies
app.use(express.urlencoded({ extended: true })) // used form submission
app.use(express.static("public")) // used for static files

// calling env
dotenv.config();

// calling db
connectToDb();


app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

// imported routes
app.use('/', indexRouter);
app.use('/user', userRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});