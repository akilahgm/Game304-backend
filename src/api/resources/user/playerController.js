
import team from './team.model';
import round from './round.model';
import playerService from './player.service';
import jwt from '../../helper/jwt';
import io from 'socket.io-client';

const ip='http://172.20.10.11:3999'

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
			let card =playerService.distributeCards();
			if (!Team){
				const team1 = new team({
					teamName:req.body.teamName,
					player1:req.body.playerId,
					player2:'',
					player3:'',
					player4:'',
					cards:card,
					bidPoint:100,
					bidder:'',
					trump:'',
					monitorId:'',
					couple1:null,
					couple2:null,
					point:0,
					gameStatus:"configering"
				})
				const Team = await team.create(team1);
				const Round = await round.create({
					teamName:req.body.teamName,
					roundNo:1,
					player1:null,
					player2:null,
					player3:null,
					player4:null,
					monitorId:"",
					attemptCount:null,
					roundType:null
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
				var no=null;
				if(Team.player2==""){
					player2 = req.body.playerId
					no=2;
				}
				else if(Team.player3==""){
					player3 = req.body.playerId;
					no=3;
				}
				else if(Team.player4==""){
					player4 = req.body.playerId;
					no=4;
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
				const Teamm = await team.findOne({teamName:req.body.teamName});

				if(Teamm.player4!= ''){
					console.log('4th player',Teamm.player4)
					const socket = io(ip);
					socket.emit('start',req.body.teamName);
					await team.updateOne(
					{teamName:req.body.teamName},
					{
						$set: {gameStatus:'bid'}
					}
					);
				}
				return res.json({no:no});

			}

		}catch(err){
			console.error(err);
			return res.status(500).send(err);
		}
	},
	async distribute(req,res){
		console.log(req.body.teamName);
		try{
			const Team = await team.findOne({teamName:req.body.teamName});
			if(Team.cards==null){
				return res.json({success:false});
			}
			return res.json(Team.cards.cards);
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
			console.log('player bidded',req.body.teamName)
			if(Team){
				if(Team.bidPoint< point){
					console.log('player bidded, update team')
					if(Team.player1==req.body.playerId || Team.player3==req.body.playerId){
						await team.updateOne(
							{teamName:req.body.teamName},
							{
								$set: {bidPoint: point, bidder:req.body.playerId, couple1:'bidder' }
							}
							);
					}
					else{
						await team.updateOne(
							{teamName:req.body.teamName},
							{
								$set: {bidPoint: point, bidder:req.body.playerId, couple2: 'bidder' }
							}
							);
					}
					if(parseInt(req.body.playerNo,10)==4){
						const TeamN = await team.findOne({teamName:req.body.teamName});
						const socket = io(ip);
						socket.emit('select-trump',{teamName:req.body.teamName,playerName:TeamN.bidder});
					}
					else{
						console.log('player bidded, socket emit')
						const socket = io(ip);
						socket.emit('bid',{teamName:req.body.teamName,bidVal:point,playerNo:parseInt(req.body.playerNo,10)+1});
					}
					return res.json({success:true});
				}
				else{
					console.log("check bid")
					if(parseInt(req.body.playerNo,10)==4){
						console.log("check bid")
						const TeamN = await team.findOne({teamName:req.body.teamName});
						const socket = io(ip);
						socket.emit('select-trump',{teamName:req.body.teamName,playerName:TeamN.bidder});
					}
					else{
						console.log('player bidded, socket emit')
						const socket = io(ip);
						socket.emit('bid',{teamName:req.body.teamName,bidVal:point,playerNo:parseInt(req.body.playerNo,10)+1});
					}
					return res.json({success:true});
				}
			}
			else{
				return res.json({success:false});
			}

		}catch(err){
			console.error(err);
			return res.status(500).send(err);
		}
	},
	async selectTrump(req,res){
		try{
			console.log(req.body.trump);
			await team.updateOne(
				{teamName:req.body.teamName},
				{
					$set: { trump:req.body.trump }
				}
				);
			const Team = await team.findOne({teamName:req.body.teamName});
			const socket = io(ip);
			
			socket.emit('round-start',{teamName:req.body.teamName,bidder:Team.bidder,bidVal:Team.bidPoint});
			await team.updateOne(
					{teamName:req.body.teamName},
					{
						$set: {gameStatus:'start'}
					}
					);
			socket.emit('play',{teamName:req.body.teamName,playerNo:1,output:''});
			socket.emit('monitor-start',{teamName:req.body.teamName,playerName:Team.monitorId});
			return res.json({success:true});		
		}catch(err){
			console.error(err);
			return res.status(500).send(err);
		}
	},
	
	async play(req,res){
		try{
			const socket = io(ip);
			console.log('api request for play');
			const Roundd = await round.findOne({teamName:req.body.teamName});
			var attemptCountN=Roundd.attemptCount+1;
			if(parseInt(req.body.playerNo,10)==1){         
				await round.updateOne(     
					{teamName:req.body.teamName},     {
						$set: { player1:req.body.card,attemptCount:attemptCountN }     }
						);     
			}     
			else if(parseInt(req.body.playerNo,10)==2){
				await round.updateOne(     
					{teamName:req.body.teamName},     {
						$set: { player2:req.body.card,attemptCount:attemptCountN }     }
						);     
			}     
			else if(parseInt(req.body.playerNo,10)==3){
				await round.updateOne(     
					{teamName:req.body.teamName},     
					{
						$set: { player3:req.body.card,attemptCount:attemptCountN }     
					}
				);     
			}     
			else if(parseInt(req.body.playerNo,10)==4){
				await round.updateOne(     
					{teamName:req.body.teamName},     
					{
						$set: { player4:req.body.card,attemptCount:attemptCountN }     
					}
				);     
			} 
			const Round = await round.findOne({teamName:req.body.teamName});
			const Team = await team.findOne({teamName:req.body.teamName});
			if(Round.attemptCount==1){
				await round.updateOne(     
					{teamName:req.body.teamName},     
					{
						$set: { roundType:req.body.card.type }     
					}
				);  
			} 
			if(Round.attemptCount==4){     
				var pointArray=[];
				pointArray.push(Round.player1.value);
				pointArray.push(Round.player2.value);
				pointArray.push(Round.player3.value);
				pointArray.push(Round.player4.value);
				var point=0;
				pointArray.forEach(function(value) {
					if(value=='Jack'){
						point=point+30;
					}
					else if(value=='Nine'){
						point=point+20;
					}
					else if(value=='Ace'){
						point=point+11;
					}
					else if(value=='Ten'){
						point=point+10;
					}
					else if(value=='King'){
						point=point+3;
					}
					else if(value=='Queen'){
						point=point+2;
					}
				});
				if(Round.point+point==Round.bidPoint){


				}
				else{

					var winType=Round.roundType;
					var winNum=0;
					var winValue;

					if(Round.player1.type==winType){
						winValue=Round.player1.value;
						winNum = 1;
						if(Round.player1.value=="Jack"){
							winValue=30;
						}
						else if(Round.player1.value=="Nine"){
							winValue=20;
						}
						else if(Round.player1.value=="Ace"){
							winValue=11;
						}
						else if(Round.player1.value=="Ten"){
							winValue=10;
						}
						else if(Round.player1.value=="King"){
							winValue=3;
						}
						else if(Round.player1.value=="Queen"){
							winValue=2;
						}
					}
					else if(Round.player1.type==Team.trump.type){
						winType=Team.trump.type;
						winNum = 1;
						if(Round.player1.value=="Jack"){
							winValue=30;
						}
						else if(Round.player1.value=="Nine"){
							winValue=20;
						}
						else if(Round.player1.value=="Ace"){
							winValue=11;
						}
						else if(Round.player1.value=="Ten"){
							winValue=10;
						}
						else if(Round.player1.value=="King"){
							winValue=3;
						}
						else if(Round.player1.value=="Queen"){
							winValue=2;
						}
					}
					
					if(Round.player2.type==winType){
						var val;
						if(Round.player2.value=="Jack"){
							val=30;
						}
						else if(Round.player2.value=="Nine"){
							val=20;
						}
						else if(Round.player2.value=="Ace"){
							val=11;
						}
						else if(Round.player2.value=="Ten"){
							val=10;
						}
						else if(Round.player2.value=="King"){
							val=3;
						}
						else if(Round.player2.value=="Queen"){
							val=2;
						}
						if(winValue<val){
							winValue=val;
							winNum = 2;
						}
					}
					else if(Round.player2.type==Team.trump.type){
						winType=Team.trump.type;
						var val;
						if(Round.player2.value=="Jack"){
							val=30;
						}
						else if(Round.player2.value=="Nine"){
							val=20;
						}
						else if(Round.player2.value=="Ace"){
							val=11;
						}
						else if(Round.player2.value=="Ten"){
							val=10;
						}
						else if(Round.player2.value=="King"){
							val=3;
						}
						else if(Round.player2.value=="Queen"){
							val=2;
						}
						if(winValue<val){
							winValue=val;
							winNum = 2;
						}
					}
					if(Round.player3.type==winType){
						var val;
						if(Round.player3.value=="Jack"){
							val=30;
						}
						else if(Round.player3.value=="Nine"){
							val=20;
						}
						else if(Round.player3.value=="Ace"){
							val=11;
						}
						else if(Round.player3.value=="Ten"){
							val=10;
						}
						else if(Round.player3.value=="King"){
							val=3;
						}
						else if(Round.player3.value=="Queen"){
							val=2;
						}
						if(winValue<val){
							winValue=val;
							winNum = 3;
						}
					}
					else if(Round.player3.type==Team.trump.type){
						winType=Team.trump.type;
						var val;
						if(Round.player3.value=="Jack"){
							val=30;
						}
						else if(Round.player3.value=="Nine"){
							val=20;
						}
						else if(Round.player3.value=="Ace"){
							val=11;
						}
						else if(Round.player3.value=="Ten"){
							val=10;
						}
						else if(Round.player3.value=="King"){
							val=3;
						}
						else if(Round.player3.value=="Queen"){
							val=2;
						}
						if(winValue<val){
							winValue=val;
							winNum = 3;
						}
					}
					if(Round.player4.type==winType){
						var val;
						if(Round.player4.value=="Jack"){
							val=30;
						}
						else if(Round.player4.value=="Nine"){
							val=20;
						}
						else if(Round.player4.value=="Ace"){
							val=11;
						}
						else if(Round.player4.value=="Ten"){
							val=10;
						}
						else if(Round.player4.value=="King"){
							val=3;
						}
						else if(Round.player4.value=="Queen"){
							val=2;
						}
						if(winValue<val){
							winValue=val;
							winNum = 4;
						}
					}
					else if(Round.player4.type==Team.trump.type){
						winType=Team.trump.type;
						var val;
						if(Round.player4.value=="Jack"){
							val=30;
						}
						else if(Round.player4.value=="Nine"){
							val=20;
						}
						else if(Round.player4.value=="Ace"){
							val=11;
						}
						else if(Round.player4.value=="Ten"){
							val=10;
						}
						else if(Round.player4.value=="King"){
							val=3;
						}
						else if(Round.player4.value=="Queen"){
							val=2;
						}
						if(winValue<val){
							winValue=val;
							winNum = 4;
						}
					}
					await round.updateOne(     
					{teamName:req.body.teamName},     
					{
						$set: { attemptCount:0 }     
					}
				); 
					await round.updateOne(     
					{teamName:req.body.teamName},     
					{
						$set: { roundType:req.body.card.type,player1:null,player2:null,player3:null,player4:null }     
					}
				);
					
					var output={
				player1:null,
				player2:null,
				player3:null,
				player4:null
			}
					socket.emit('play',{teamName:req.body.teamName,playerNo:winNum,output:output});
				}
			}
			else{
				var output={
				player1:Round.player1,
				player2:Round.player2,
				player3:Round.player3,
				player4:Round.player4
			}
				var count = (Round.attemptCount) +1;
				await round.updateOne(     
					{teamName:req.body.teamName},     
					{
						$set: { attemptCount:count}     
					}
				); 
				if(req.body.playerNo==4){
					socket.emit('play',{teamName:req.body.teamName,playerNo:1,output:output});
				}else{
					socket.emit('play',{teamName:req.body.teamName,playerNo:parseInt(req.body.playerNo,10)+1,output:output});
				}
			}
			

			return res.json({success:true});
		}catch(err){
			console.error(err);
			return res.status(500).send(err);
		}


	},
	async getTeam(req,res){
		const Team = await team.findOne({teamName:req.body.teamName});
		if(Team){
			return res.json({Team});
		}
		else{
			console.error(err);
			return res.status(500).send(err);
		}
	},
	async getGameStatus(req,res){	
		try{
			const Team = await team.findOne({teamName:req.body.teamName});
			return res.json({gameStatus:Team.gameStatus});
		}catch(err){
			console.error(err);
			return res.status(500).send(err);
		}
	},
	async addMonitor(req,res){
		try{
			const Team = await team.findOne({teamName:req.body.teamName});
			if(!Team){
				return res.json({status:"Team can't fond"}); 
			}
			else{
				
				if(Team.monitorId==""){
					await team.updateOne(
					{teamName:req.body.teamName},
					{
						$set: {monitorId:req.body.playerId}
					}
					);
					return res.json({success:true});
				}
				else{
					return res.json({success:false});
				}
				
				
				
				return res.json({no:no});

			}
		}catch(err){
			console.error(err);
			return res.status(500).send(err);
		}
	},


}

