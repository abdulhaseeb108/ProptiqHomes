import express from 'express';
import {
  signup,
  signin,
  google,
  logout,
  updateUser,
  deleteUser,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const authRouter = express.Router();

// 🔓 Public Routes
authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/google', google);

// 🚪 Logout
authRouter.get('/signout', (req, res) => {
  res
    .clearCookie('access_token', {
      sameSite: 'none',
      secure: true,
    })
    .status(200)
    .json({ success: true, message: 'User signed out successfully' });
});

// 🔐 Protected Routes
authRouter.put('/update/:id', verifyToken, updateUser);
authRouter.delete('/delete/:id', verifyToken, deleteUser);

export default authRouter;
