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
		},
		exercises:[{type: mongoose.Schema.Types.ObjectId, ref:'Exercise'}]
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
			type:Date,
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

//create new exercise function
const newExerciseEntry = (userId,description,date,duration,done)=>{
	getUserById(userId,(err,doc) => {
		if (err) done(err);
		const newExercise = new Exercise({userID:userId,description:description,date:date,duration:duration});
		newExercise.save((err,data)=>{
			err ? done(err) : done(null,{"username":doc.username,"description":data.description,"duration":data.duration,"_id":doc._id,"date":data.date.toDateString()}) //modified the userID to return userID as this was causing the test to fail!
		})
	})
}

//query exercise function
const findExercise = (userId,limit,from,to,done)=>{
	getUserById(userId,(err,doc) => {
		err ? done(err) : 
		Exercise.find({userID:userId,date:{$gte: from,$lt: to }}).select('description duration date').limit(limit).exec((err,data)=>{
			err ? done(err) : done(null,{"userId":doc._id,"username":doc.username,"count":data.length,"log":data.map(e=> ({"description":e.description,"duration":parseInt(e.duration),"date":e.date.toDateString()}))})
			})
		})
}

exports.User = User
exports.getAllUsers = getAllUsers
exports.getUserById = getUserById
exports.Exercise = Exercise
exports.createNewUser = createNewUser
exports.newExerciseEntry = newExerciseEntry
exports.findExercise = findExercise