const express = require('express');
const morgon = require('morgan');
const toursRouter = require('./routes/toursRouter');
const usersRouter = require('./routes/usersRoutes');
const app = express();

console.log(process.env.NODE_ENV);
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgon('dev'));
}

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;
