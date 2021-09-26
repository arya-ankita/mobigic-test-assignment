const { promisify } = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
exports.signup = async (req, res) => {
  console.log(req.body);
  try {
    const newUser = await User.create(req.body);

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      message: 'User created successfully',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.login = catchAsync(async (req, res, next) => {
  try {
    const { name, password } = req.body;
    // 1) If email and password actually exists
    console.log('NN', name, password);
    if (!name || !password) {
      return next(new AppError('Please provide name and password', 400));
    }
    // 2) Check if user exists && paqssword is correct
    const user = await User.findOne({ name }).select('+password');
    console.log('UUUUU', user);
    // const correct = user.correctPassword(password, user.password);

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token to  client
    console.log('tt', user);
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
      message: 'Login Successfull',
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'fail',
      message: 'Invalid User',
    });
  }
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  // console.log("p", req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
    // console.log("tt", token);
  }
  //  console.log("TOKEN",req.headers);
  if (!token) {
    return next(
      new AppError('You are not logged in!., Please login to get access', 401)
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does not exist', 401)
    );
  }
  // 4) check if user changed password after the JWT was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError(''));
  }

  req.user = currentUser;
  next();
});


exports.profile = async (req,res) => {
    try {

        const user = await User.findById({ _id : req.user.id});
     
        res.status(200).json({
            status: 'success',
            data: user
        })
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: 'Invalid User'
        })
    }
}