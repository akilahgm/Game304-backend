//import bcrypt from 'bcryptjs';
import Joi from 'joi';
import round from './round.model';

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
	createRound(teamName){
		const Round = round.create({
					teamName:teamName,
					roundNo:null,
					player1:null,
					player2:null,
					player3:null,
					player4:null,
					monitorId:"",
				});
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
		var cardsInit=Array('spade-Jack','spade-Nine','spade-Ace','spade-Ten','spade-King','spade-Queen','club-Jack','club-Nine','club-Ace','club-Ten','club-King','club-Queen','diamond-Jack','diamond-Nine','diamond-Ace','diamond-Ten','diamond-King','diamond-Queen','heart-Jack','heart-Nine','heart-Ace','heart-Ten','heart-King','heart-Queen')
		var numOfCards=24;
		var i=0;
		for(i=0;i<6;i++){
			var n =Math.floor(Math.random()*numOfCards);
			let card =cardsInit[n].split("-");
			let obj ={
				type:card[0],
				value:card[1]
			}
			player1.cards.push(obj);
			cardsInit.splice(n,1);
			numOfCards = numOfCards -1;
		}
		var i=0;
		for(i=0;i<6;i++){
			var n =Math.floor(Math.random()*numOfCards);
			let card =cardsInit[n].split("-");
			let obj ={
				type:card[0],
				value:card[1]
			}
			player2.cards.push(obj);
			cardsInit.splice(n,1);
			numOfCards = numOfCards -1;
		}
		var i=0;
		for(i=0;i<6;i++){
			var n =Math.floor(Math.random()*numOfCards);
			let card =cardsInit[n].split("-");
			let obj ={
				type:card[0],
				value:card[1]
			}
			player3.cards.push(obj);
			cardsInit.splice(n,1);
			numOfCards = numOfCards -1;
		}
		var i=0;
		for(i=0;i<6;i++){
			var n =Math.floor(Math.random()*numOfCards);
			let card =cardsInit[n].split("-");
			let obj ={
				type:card[0],
				value:card[1]
			}
			player4.cards.push(obj);
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