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

// 🚪 Logout Route
authRouter.get('/signout', logout);

// 🔐 Protected Routes
authRouter.put('/update/:id', verifyToken, updateUser);
authRouter.delete('/delete/:id', verifyToken, deleteUser);

export default authRouter;
