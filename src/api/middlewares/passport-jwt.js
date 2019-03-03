import Passport from 'passport';
import PassportJWT from 'passport-jwt';
import {devConfig} from '../../config/env/development';
import Driver from '../resources/user/team.model';

export const configJWTStrategy = () =>{
	const opts ={
		jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: devConfig.secret,
	}

	Passport.use(new PassportJWT.Strategy(opts,(paylod,done)=>{
		Driver.findOne({_id:paylod.id},(err,driver)=>{
			if(err){
				return done(err);
			}
			if(driver){
				return done(null,driver);
			}
			return done(null, false);
		})
	}));
}