import jwt from 'jsonwebtoken';
import {devConfig} from '../../config/env/development';

export default{
	issue(payload, expiresIn){
		console.log('got it');
		return jwt.sign(payload, devConfig.secret, {
			expiresIn
		});
	},
};