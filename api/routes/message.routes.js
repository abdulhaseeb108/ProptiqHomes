import express from 'express';
import { createMessage, getMyMessages } from '../Controllers/message.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const messageRouter = express.Router();

messageRouter.post('/send-message', verifyUser, createMessage);
messageRouter.get('/my-messages', verifyUser, getMyMessages);

export default messageRouter;
