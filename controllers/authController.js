//Gets user schema
const User = require("../models/User");
//gets jwt library, cookie library, and express library
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var express = require('express');
// handle errors

//checks the error and returns a message
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// create json web token
const createToken = (id) => {
  return jwt.sign({ id }, 'pbVoceBvK7RB3bVF4YV2PqzCq2jndJy4', {
  });
};

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('signup');
}

module.exports.login_get = (req, res) => {
  res.render('login');
}

//sneds the email and password to the db while creating a new row
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password});
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true});
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

//uses the email and password sent by the frontend and checks if they exist 
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    var userId = user.userId.toString();
    res.cookie('userid', userId, { httpOnly: false, signed: true, secret: '3BGlvanzNG'});    
    res.cookie('jwt', token, { httpOnly: true});
    res.status(200).json({ user : user._id });
      } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}
//deletes the cookies and redirects to the login page
module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.cookie('userid','', {maxAge: 1});
  res.redirect('/');
}

//gets the user id from the cookies
module.exports.getUserId = (req, res) =>{
  const userId = req.signedCookies;
  res.status(200).json(userId);
}

