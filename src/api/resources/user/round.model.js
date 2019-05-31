import mongoose from 'mongoose';

const {Schema} = mongoose;


const roundSchema = new Schema({
	teamName:{
		type: String,
		required: true,
	},
	roundNo:{
		type:Number,
	},
	player1:{
		type:Object,
	},
	player2:{
		type:Object,
	},
	player3:{
		type:Object,
	},
	player4:{
		type:Object,
	},
	monitorId:{
		type:String,
	},
	attemptCount:{
		type:Number,
	},
	roundType:{
		type:String,
	}
});

export default mongoose.model('Round', roundSchema);