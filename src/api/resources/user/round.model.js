import mongoose from 'mongoose';

const {Schema} = mongoose;


const roundSchema = new Schema({
	teamName:{
		type: String,
		required: true,
	},
	round1:{
		type:Array,
	},
	round2:{
		type:Array,
	},
	round3:{
		type:Array,
	},
	round4:{
		type:Array,
	},
	round5:{
		type:Array,
	},
	round6:{
		type:Array,
	},
	monitorId:{
		type:String,
	}
});

export default mongoose.model('Round', roundSchema);