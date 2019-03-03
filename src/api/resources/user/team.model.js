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
	bidPoint:{
		type:Number,
	},
	bidder:{
		type:String,
	},
	trump:{
		type:String,
	},
	monitorId:{
		type:String,
	},
	couple1:{
		type:String,
	},
	couple2:{
		type:String,
	}
});

export default mongoose.model('Team', teamSchema);