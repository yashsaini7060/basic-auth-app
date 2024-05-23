const userModel = require('../model/userSchema.js');
const bcrypt = require('bcrypt');

// signup user
const signUp = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  /// every field is required
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Every field is required',
    });
  }
  try {
    /// send password not match err if password !== confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'password and confirm should be same',
      });
    }

    // userSchema "pre" middleware function for "save" will hash the password using "bcrypt" (npm package) before saving the  data into the database
    const userInfo = new userModel(req.body);
    const result = await userInfo.save();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message,
    });
  }
};

// signin user
const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  // return response with an error message if the email of password is missing
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'email and password are required',
    });
  }

  try {
    // check user exist or not
    const user = await userModel
      .findOne({
        email,
      })
      .select('+password');

    // if the user is null or the password is incorrect return response with an error message
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: 'invalid credentials',
      });
    }

    // create the JWT token using the userSchema method (jwtToken())
    const token = user.jwtToken();
    user.password = undefined;

    const cookieOption = {
      maxAge: 24 * 60 * 60 * 1000, //24hr
      httpOnly: true,
    };

    // return a response with user object and cookie (contains jwt Token)
    res.cookie('token', token, cookieOption);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// logout
const logout = async (req, res, next) => {
  try {
    const cookieOption = {
      expires: new Date(),
      httpOnly: true,
    };

    res.cookie('token', null, cookieOption);
    res.status(200).json({
      success: true,
      message: 'Logged Out',
    });
  } catch (error) {
    res.stats(400).json({ success: false, message: error.message });
  }
};

// get login profile
const getUser = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const user = await userModel.findById(userId);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// get all user details
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.find();
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  signUp,
  signIn,
  getUser,
  logout,
  getAllUsers,
};
