const router = require('express').Router();
const Votesession = require("../models/votesessionModel");
const auth = require("../middleware/auth")


//to create a vote session

router.post("/",auth, async(req,res)=>{
    try{
      const{contestant, position,about,date,deadline,voters,active}=req.body;
      const newVotesession = new Votesession({
         contestant,
         position,
         about,
         deadline,
         voters,
         active

      });
  //validation
  if( !position  )
  return res
  .status(400)
  .json({errorMessage:"Please enter the position"});

  if(!about || !deadline)
  return res
  .status(400)
  .json({errorMessage:"no information about the session nor duration was provided"});

    const savedVotesession = await newVotesession.save();
    res.json(savedVotesession);
    console.log(savedVotesession)
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
})




//to get all vote sessions

router.get("/",auth, async(req,res)=>{
    try{
     const votesessions = await Votesession.find();
     res.json(votesessions);
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
})
//to get a vote session via ID

router.get('/:_id',auth,async(req,res)=>{
    try{
       const votesession =await Votesession.findById(req.params._id);
       res.json(votesession);
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
})
//to make a vote session active

router.patch("/:id",auth, async (req, res) => {
	try {
		const votesession = await Votesession.findOne({ _id: req.params.id })

		if (req.body.active) {
			votesession.active = req.body.active
		}


		await votesession.save()
		res.send(votesession)
	} catch {
		res.status(404)
		res.send({ error: "Vote session doesn't exist!" })
	}
})
//to get all contestants in a vote session

router.get('/:_id/contestant',auth,async(req,res)=>{
    try{
       const contestant =await Votesession.findById(req.params._id);
       res.json(contestant.contestant);
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
})
//to get a specific contestant via ID
router.get('/:_id/contestant/:contestantId',auth,async(req,res)=>{
    try{
       const con =await Votesession.findById(req.params._id);
       if(con!=null && con.contestant.id(req.params.contestantId)!=null){
        } return  res.json(con.contestant.id(req.params.contestantId));
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
})
//to vote
router.post('/:_id/contestant/:contestantId',auth,async(req,res)=>{
    try{
    const{vote,contestant,email,signature}=req.body;
    const con =await Votesession.findById(req.params._id);
    con.contestant.id(req.params.contestantId).votes.push(req.body)
    con.save()
    res.json(con.contestant.id(req.params.contestantId));
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
})

router.post('/:_id/voters',auth,async(req,res)=>{
    try{
        const{voter_id}=req.body;
       const con =await Votesession.findById(req.params._id);
    const match= con.voters.filter((v)=>v.voter_id==req.body.voter_id)
    if(match.length > 0){ 
        return res
        .status(400)
        .json({errorMessage:"you have voted already"});
     }
       con.voters.push(req.body)
      con.save()
      res.json(con.voters);
      console.log(con.voters)
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
})
router.patch("/:id", async (req, res) => {
	try {
		const votesession = await Votesession.findOne({ _id: req.params.id })

		if (req.body.active) {
			votesession.active = req.body.active
		}

		if (req.body.content) {
			post.content = req.body.content
		}

		await votesession.save()
		res.send(votesession)
	} catch {
		res.status(404)
		res.send({ error: "Vote session doesn't exist!" })
	}
})
module.exports = router;