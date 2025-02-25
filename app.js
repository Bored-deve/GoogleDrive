const express = require('express');
const app = express();
const userRouter = require('./routes/user.routes');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});   

app.get('/about', (req, res) => {
    res.render('about');
  });

app.use('/user', userRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

