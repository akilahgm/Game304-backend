import express from 'express';
import PlayerController from './playerController';
import passport from 'passport';

export const playerRouter = express.Router();

playerRouter.post('/getKey', PlayerController.getKey);
playerRouter.post('/createTeam', PlayerController.createTeam);
playerRouter.post('/distribute', PlayerController.distribute);
playerRouter.post('/showTeams', PlayerController.showTeams);
playerRouter.post('/addPlayer', PlayerController.addPlayer);
playerRouter.post('/bid',  PlayerController.bid);
playerRouter.post('/selectTrump',  PlayerController.selectTrump);
playerRouter.post('/play', PlayerController.play);
playerRouter.post('/getTeam', PlayerController.getTeam);
playerRouter.post('/getGameStatus', PlayerController.getGameStatus);
playerRouter.post('/addMonitor', PlayerController.addMonitor);







