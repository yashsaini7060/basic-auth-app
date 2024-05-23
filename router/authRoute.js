const express = require('express');
const authRouter = express.Router();
const jwtAuth = require('../middleware/jwtAuth.js');

const {
  signUp,
  signIn,
  logout,
  getUser,
  getAllUsers,
} = require('../controller/authController.js');
const authorizeRoles = require('../middleware/authorizeRoles.js');

authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.post('/logout', jwtAuth, logout);
authRouter.get('/me', jwtAuth, authorizeRoles('USER'), getUser);
authRouter.get('/admin/users', jwtAuth, authorizeRoles('ADMIN'), getAllUsers);

module.exports = authRouter;
