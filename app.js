const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(express.static(__dirname+"/public"))
app.use(cors({optionSuccessStatus:200}));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.route("/").get((req,res)=>{
	res.sendFile(__dirname+"/views/index.html")
})

app.use("/api/exercise",require("./routes/users.js"))
app.use("/api/exercise",require("./routes/new-user.js"))
app.use("/api/exercise",require("./routes/add-exercise.js"))
app.use("/api/exercise",require("./routes/query-exercise.js"))

app.listen(process.env.PORT,()=>console.log("The exercise tracker is now listening....."))