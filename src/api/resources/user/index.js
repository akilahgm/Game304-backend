import express from 'express';
import PlayerController from './playerController';
import passport from 'passport';

export const playerRouter = express.Router();

playerRouter.post('/getKey', PlayerController.getKey);
playerRouter.post('/createTeam', PlayerController.createTeam);
playerRouter.post('/distribute', passport.authenticate('jwt',{session:false}), PlayerController.distribute);
playerRouter.post('/showTeams', passport.authenticate('jwt',{session:false}), PlayerController.showTeams);
playerRouter.post('/addPlayer', passport.authenticate('jwt',{session:false}), PlayerController.addPlayer);
playerRouter.post('/bid', passport.authenticate('jwt',{session:false}), PlayerController.bid);
playerRouter.post('/play', passport.authenticate('jwt',{session:false}), PlayerController.play);







