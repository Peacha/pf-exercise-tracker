const express = require('express');
const router = express.Router();
const {Exercise,findExercise} = require('../appFunctions.js')

router.get("/log",(req,res,next)=>{
	const uid = req.query.userId
	const from = req.query.from ? new Date(req.query.from) : new Date(0)
	const to = req.query.to ? new Date(req.query.to) : new Date(Date.now())
	const limit = req.query.limit ? parseInt(req.query.limit) : 100
	findExercise(uid,limit,from,to,(err,data)=>{
		return err ? res.send('500') : res.json(data)
		next();
	})
})

module.exports = router
