const express = require('express');
const serverless = require('serverless-http');

const path = require('path');
require('dotenv').config()
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const userRouter = require('../routes/users');
const taskRouter = require('../routes/tasks');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DB}/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });


app.use('/.netlify/functions/app/user/', userRouter);
app.use('/.netlify/functions/app/tasks/', taskRouter);

module.exports.handler = serverless(app);