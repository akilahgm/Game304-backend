import mongoose from 'mongoose';

const {Schema} = mongoose;


const teamSchema = new Schema({
	teamName:{
		type: String,
		required: true,
	},
	player1:{
		type:String,
	},
	player2:{
		type:String,
	},
	player3:{
		type:String,
	},
	player4:{
		type:String,
	},
	cards:{
		type:Object,
	},
	bidPoint:{
		type:Number,
	},
	bidder:{
		type:String,
	},
	trump:{
		type:Object,
	},
	monitorId:{
		type:String,
	},
	couple1:{
		type:String,
	},
	couple2:{
		type:String,
	},
	point:{
		type:Number,
	},
	gameStatus:{
		type:String,
	},
});

export default mongoose.model('Team', teamSchema);