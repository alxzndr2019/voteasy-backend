const mongoose = require('mongoose');
const voteSchema = new mongoose.Schema({
    vote:{type:Boolean},
    contestant_id: {type:String},
    email: {type:String},
    signature:{type:String},
});
const votersSchema = new mongoose.Schema({
    voter_id: {type:String}
});
const contestantSchema = new mongoose.Schema({
    name:{type:String},
    image: {type:String},
    about: {type:String},
    votes:[voteSchema]
});
const votesessionSchema = new mongoose.Schema({
    contestant:[contestantSchema],
    position:{type:String, required:true},
    about:{type:String, required:true},
    voters:[votersSchema],
    deadline:{type:String},
    active: {type:Boolean},
});
const Votesession = mongoose.model("votesession", votesessionSchema);
module.exports = Votesession;