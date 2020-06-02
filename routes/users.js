const express = require('express');
const router = express.Router();
const { user,getAllUsers } = require('../appFunctions.js')

router.get("/users",(req,res,next)=>{
	getAllUsers((err,data)=>{
		return err ? res.send(err) : res.send(data);
		next();
	})
})

module.exports = router