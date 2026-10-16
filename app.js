const express = require("express")
const cors = require("cors")
const app = express()
const { connectToMongoDB } = require("./config/db")
const UserModel=require("./models/user")

// allowing client running on link http://localhost:5173
app.use(cors({ origin: "http://localhost:5173" }))

app.use(express.json())   // req.body
// allow incoming json

// endpoint
app.get("/", function (req, res) {
    res.send("Server started")
})

// endpoint
app.get("/about", function (req, res) {
    res.send("About Link")
})

// endpoint
app.post("/auth", function (req, res) {
    console.log(req.body)
    //db connection 

    res.status(200).json({ auth: true, msg: "Login successfull" })
    // res.status(404).json({auth:true,msg:"Login successfull"})
})

// endpoint
app.post("/reg", async function (req, res) {
    // console.log(req.body)
    try
    {
    //db connection 
            const savedUser=await UserModel.create(req.body)

            if(!savedUser)
            {
                return res.json({ reg: false, msg: "Register Failed" })
            }

            res.status(200).json({ reg: true, msg: "Register successfull" })
    }
    catch(err)
    {
        return res.json({error:err,reg:false})
    }
    // res.status(404).json({auth:true,msg:"Login successfull"})
})

app.listen(5000, function () {

    connectToMongoDB().then(function () {

        console.log("Database Connected")

    }).catch(function (err) {

        console.error(err)
    })
    console.log("Server started on http://localhost:5000")
})





