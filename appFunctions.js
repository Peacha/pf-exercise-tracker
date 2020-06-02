const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.set('useCreateIndex', true);
const schema = mongoose.Schema

//define user schema
const userSchema = new schema(
	{
		username:{
			required:true,
			unique:true,
			type: String,
			lowercase: true
		}
	}
);

//define the exercise schema

const exerciseSchema = new schema(
	{
		userID:{
			required:true,
			type: mongoose.Schema.Types.ObjectId,
			ref:'User'
		},
		description:{
			required:true,
			type:String
		},
		date:{
			type:Date
		},
		duration:{
			type:Number,
			required:true
		}
	}
);

//declare the user model

const User = mongoose.model("User",userSchema);

//declare exercise model

const Exercise = mongoose.model("Exercise",exerciseSchema);

//create new user function

const createNewUser = (userName,done)=>{
	const newUser = new User({username:userName});
	newUser.save((err,data)=>{err ? done(err) : done(null,data)});
}

// get all users

const getAllUsers = (done)=>{
	User.find({}).exec((err,data)=>{err ? done(err) : done(null,data)})
}

//get userID function

const getUserById = (userId,done) =>{
	User.findById({_id:userId}).exec((err,data)=>{err ? done(err) : done(null,data)})
}

//get excercise by id
const getExerciseById = (exId,done) => {
		Exercise.findById({_id:exId}).populate('userID').exec((err,data)=>{
			return err ? done(err) : done(null,{"userId":data.userID._id,"description":data.description,"duration":data.duration,"date":data.date.toDateString(),"username":data.userID.username})
	})
}

//create new exercise function
const newExerciseEntry = (userID,description,date,duration,done)=>{
	var newExercise = new Exercise({userID:userID,description:description,date:date,duration:duration});
	newExercise.save((err,data)=>{
		err ? done(err) : getExerciseById(data._id.toString(),(err,doc)=>{return err ? done(err) : done(null,doc)})
	})
}

//query exercise function

const findExercise = (userId,limit,from,to,done)=>{
	Exercise.find({userID:userId,date:{$gte: from,$lt: to }}).populate('userID').limit(limit).exec((err,data)=>{
		return err ? done(err) : done(null,data.map(e=> ({"userId":e.userID._id,"description":e.description,"duration":e.duration,"date":e.date.toDateString(),"username":e.userID.username}) ))
	})
}

exports.User = User
exports.getAllUsers = getAllUsers
exports.getUserById = getUserById
exports.Exercise = Exercise
exports.getExerciseById = getExerciseById
exports.createNewUser = createNewUser
exports.newExerciseEntry = newExerciseEntry
exports.findExercise = findExercise