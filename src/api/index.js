import express from 'express';
import {playerRouter} from './resources/user';

export const restRouter = express.Router();

restRouter.use('/user',playerRouter);