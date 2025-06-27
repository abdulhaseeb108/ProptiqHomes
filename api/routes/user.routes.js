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

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/google', google);

authRouter.get('/signout', logout);

authRouter.put('/update/:id', verifyToken, updateUser);
authRouter.delete('/delete/:id', verifyToken, deleteUser);

export default authRouter;
