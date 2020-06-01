const express = require('express');
const router = express.Router();
const {User,createNewUser} = require('../appFunctions.js')
router.post("/new-user",(req,res,next)=>{
	createNewUser(req.body.username,(err,data)=>err ? err.code === 11000 ? next(res.status('400').send("username already exists, please try another")) : next(res.status('500')) : next(res.send(data)) )
})

module.exports = router