const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config();

// FEATURES

// signup feature
const signUp = async (req, role, res, next) => {
  try {
    // check user with same username if any
    const validation_username = async (username) => {
      let user = await User.findOne({ username });
      return user ? false : true;
    };

    // get user with same email if any
    const validation_email = async (email) => {
      let user_email = await User.findOne({ email });
      return user_email ? false : true;
    };

    // validate username
    let username_not_taken = await validation_username(req.username);
    if (!username_not_taken) {
      return res.status(400).json({
        message: `Username ${req.username} is already taken`,
      });
    }

    // validate email
    let email_not_registered = await validation_email(req.email);
    if (!email_not_registered) {
      return res.status(400).json({
        message: `Email is already registered`,
      });
    }

    // hash password
    const hashed_password = await bcrypt.hash(req.password, 12);
    // create new user
    const new_user = new User({
      ...req,
      password: hashed_password,
      role,
    });

    const saved_user = await new_user.save();

    return res.status(201).json({
      data: saved_user,
      message: "Hurry! now you are successfully registred. Please login!",
    });
  } catch (err) {
    return res.status(500).json({
      message: `${err.message}`,
    });
  }
};

// login feature
const login = async (req, role, res, next) => {
  let { username, password } = req;

  // check if user is exsist in the database
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      message: "Username is not found. Invalid login credentials",
      success: false,
    });
  }

  // check user logging via route for his role
  if (user.role !== role) {
    return res.status(403).json({
      message: "Please make sure you are logging in from the right portal.",
      success: false,
    });
  }

  // user role match and trying to signin from the right portal
  let is_match = await bcrypt.compare(password, user.password);
  if (is_match) {
    // if password matches, sign the token
    let token = jwt.sign(
      {
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.APP_SECRET,
      {
        expiresIn: "3 days",
      }
    );

    let result = {
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      role: user.role,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };

    return res.status(200).json({
      ...result,
      message: "You are logged in!",
    });
  } else {
    return res.status(403).json({
      message: "Incorrect password.",
    });
  }
};

module.exports = {
  signUp,
  login,
};
