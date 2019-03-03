//import bcrypt from 'bcryptjs';
import Joi from 'joi';

export default{
	validateLogin(body){
		const schema = Joi.object().keys({
				name:Joi.string().required(),
			});
			const {value, error} = Joi.validate(body, schema);
			if(error && error.details){
				return {error};
			}
			return {value};
	},
	distributeCards(){
		var player1 ={
		cards:[],
		}
		var player2 ={
			cards:[],
		}
		var player3 ={
			cards:[],
		}
		var player4 ={
			cards:[],
		}
		var cardsInit=Array('spade-J','spade-N','spade-A','spade-T','spade-K','spade-Q','club-J','club-N','club-A','club-T','club-K','club-Q','diamond-J','diamond-N','diamond-A','diamond-T','diamond-K','diamond-Q','heart-J','heart-N','heart-A','heart-T','heart-K','heart-Q')
		var numOfCards=24;
		var i=0;
		for(i=0;i<6;i++){
			var n =Math.floor(Math.random()*numOfCards);
			player1.cards.push(cardsInit[n]);
			cardsInit.splice(n,1);
			numOfCards = numOfCards -1;
		}
		var i=0;
		for(i=0;i<6;i++){
			var n =Math.floor(Math.random()*numOfCards);
			player2.cards.push(cardsInit[n]);
			cardsInit.splice(n,1);
			numOfCards = numOfCards -1;
		}
		var i=0;
		for(i=0;i<6;i++){
			var n =Math.floor(Math.random()*numOfCards);
			player3.cards.push(cardsInit[n]);
			cardsInit.splice(n,1);
			numOfCards = numOfCards -1;
		}
		var i=0;
		for(i=0;i<6;i++){
			var n =Math.floor(Math.random()*numOfCards);
			player4.cards.push(cardsInit[n]);
			cardsInit.splice(n,1);
			numOfCards = numOfCards -1;
		}
		var cards={
			player1:player1.cards,
			player2:player2.cards,
			player3:player3.cards,
			player4:player4.cards,
		}
		return {cards};
	},
}