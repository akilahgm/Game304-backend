
import team from './team.model';
import round from './round.model';
import playerService from './player.service';
import jwt from '../../helper/jwt';



export default{
	async getKey(req,res){
		const Team = await team.findOne({teamName:req.body.teamName});
		const token =jwt.issue({id:Team._id},'1d');
		return res.json({token});
	},
	async createTeam(req,res) {
		try{
			console.log(req.body.teamName);
			
			const Team = await team.findOne({teamName:req.body.teamName});
			if (!Team){
				const team1 = new team({
					teamName:req.body.teamName,
					player1:req.body.playerId,
				})
				const Team = await team.create(team1);
				const Round = await round.create({
					teamName:req.body.teamName,
					round1:null,
					round2:null,
					round3:null,
					round4:null,
					round5:null,
					round6:null,
					monitorId:"",
				});
				return res.json({success:true});
			}
			else{
				return res.json({success:false});
			}
			

		}catch(err){
			console.error(err);
			return res.status(500).send(err);
		}	
	},
	async addPlayer(req,res){
		try{
			
			const Team = await team.findOne({teamName:req.body.teamName});
			if(!Team){
				return res.json({status:"Team can't fond"}); 
			}
			else{
				var player2=Team.player2;
				var player3=Team.player3;
				var player4=Team.player4;
				if(Team.player2==""){
					player2 = req.body.playerId
					
				}
				else if(Team.player3==""){
					player3 = req.body.playerId;
					
				}
				else if(Team.player4==""){
					player4 = req.body.playerId;
					
				}
				else{
					return res.json({status:"Team you desided is full"});
				}
				await team.updateOne(
					{teamName:req.body.teamName},
					{
						$set: {player2: player2, player3: player3, player4: player4}
					}
				);
				return res.json({success:true});
				 
			}

		}catch(err){
			console.error(err);
			return res.status(500).send(err);
		}
	},
	async distribute(req,res){
		try{
			return res.json(playerService.distributeCards());
		}catch(err){
			console.error(err);
			return res.status(500).send(err);
		}
	},
	async showTeams(req,res){
		try{
			const teams = await team.find();
			return res.json(teams);
		}catch(err){
			console.error(err);
			return res.status(500).send(err);
		}
	},
	async bid(req,res){
		try{
			var point = parseInt(req.body.bidPoint,10);
			const Team = await team.findOne({teamName:req.body.teamName});
			if(!Team){
				if(Team.bidPoint< point){
					if(Team.player1==req.body.playerId || Team.player3==req.body.playerId){
						await team.updateOne(
							{teamName:req.body.teamName},
							{
								$set: {bidPoint: point, bidder:req.body.playerId, trump:req.body.trump, couple1:point }
							}
						);
					}
					else{
						await team.updateOne(
							{teamName:req.body.teamName},
							{
								$set: {bidPoint: point, bidder:req.body.playerId, trump:req.body.trump, couple2: point }
							}
						);
					}
					return res.json({success:true});
				}
				else{
					return res.json({success:false});
				}
			}

		}catch(err){
			console.error(err);
			return res.status(500).send(err);
		}
	},
	async play(req,res){
		const Round = await round.findOne({teamName:req.body.teamName});
		if(!Round){
			const roundNo = parseInt(req.body.roundNo,10);
			if(roundNo==1){
				var round = Round.round1;
				return res.json(round);
			}
		}
		else{
			
		}
	}
	
}

