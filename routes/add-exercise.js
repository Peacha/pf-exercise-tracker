const express = require('express');
const router = express.Router();
const {Exercise,newExerciseEntry} = require('../appFunctions.js')

router.post("/add",(req,res,next)=>{
	const userId = req.body.userId
	const desc = req.body.description
	const date = req.body.date ? new Date(req.body.date) : Date.now()
	const time = req.body.duration
	newExerciseEntry(userId,desc,date,time,(err,data)=>{
		return err ? res.send(err) : res.send(data)
		next()
	})
})

module.exports = router

