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

//create new exercise function
const newExerciseEntry = (userID,description,date,duration,done)=>{
	const newExercise = new Exercise({userID:userID,description:description,date:date,duration:duration});
	newExercise.save((err,data)=>{err ? done(err) : done(null,data)});
}

//query exercise function

const findExercise = (userID,limit,from,to,done)=>{
	//log?{userId}[&from][&to][&limit]
	console.log(userID)
	console.log(limit)
	console.log(from)
	console.log(to)
	Exercise.find({userID:userID,date:{$gte: from,$lt: to }}).limit(limit).exec((err,data)=>{console.log(err);
		return err ? done(err) : done(null,data)
	})
}

exports.User = User
exports.Exercise = Exercise
exports.createNewUser = createNewUser
exports.newExerciseEntry = newExerciseEntry
exports.findExercise = findExercise