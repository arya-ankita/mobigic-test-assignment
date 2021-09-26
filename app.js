const express = require('express');
const morgan = require('morgan');
const authRouter = require('./routes/authRoute');
const fileRouter = require('./routes/fileRoute');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );

  next();
});

// Middleware
app.use(morgan('dev')); 
// app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));

//app.use(bodyParser.urlencoded({ extended: false }, { limit: '50mb' }));
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 5000,
  })
);
app.use((req, res, next)=>{
    console.log("Hello I am middleware");
    next();
})

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});

// Routers
app.use('/user', authRouter);

app.use('/user/file', fileRouter);

module.exports = app;


