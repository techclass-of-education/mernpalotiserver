const express = require("express")
const cors = require("cors")
const app = express()
const cookieParser=require("cookie-parser")
const { connectToMongoDB } = require("./config/db")
const UserModel = require("./models/user")
const IncidentModel = require("./models/incident")
const { default: mongoose } = require("mongoose")
require("dotenv").config()
app.use(express.json())   // req.body
const jwt=require("jsonwebtoken")

// allowing client running on link http://localhost:5173
app.use(cors({ origin: "http://localhost:5173",
    credentials:true }))

// allow incoming json

app.use(cookieParser())


const authMiddleware=function(req,res,next)
{
    const token=req.cookies.token
    if(!token)
    {
        return res.json({msg:"Login first or unauth user"})
    }
try
{
    const decode=jwt.verify(token,process.env.JWT_SECRET)
    req.user=decode
    next()
}
catch(err)
{
    return res.json({msg:"Login error:"+err})
}


}


// endpoint
app.get("/", function (req, res) {
    res.send("Server started")
})

// endpoint
app.get("/incident", authMiddleware, async function (req, res) {
    try {
        const incidents = await IncidentModel.find()
        if (!incidents) {
            return res.json({ msg: "Incidents not found" })
        }

        res.json({ msg: "Incidents found", incidents })
    }
    catch (err) {
        return res.json({ msg: "Incidents not found:" + err })
    }
})


// endpoint
app.post("/auth", async function (req, res) {
    console.log(req.body)
    //db connection 
    try {
        const user = await UserModel.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({ auth: false, msg: "Wrong email-id" })
        }

        if (req.body.password == user.password) {
            const token=jwt.sign(
                                    {
                                        id:user._id,
                                        email:user.email
                                    }
                                    , process.env.JWT_SECRET,
                                    {
                                        expiresIn:process.env.JWT_EXP
                                    }
                                )
            res.cookie("token",token,{
                httpOnly:true,
                secure:false, // for production true
                sameSite:"lax",
                maxAge:60*60*1000   // in milliseconds 1 hour
            })
            res.status(200).json({ auth: true, msg: "Login successfull" })
        } else {

            res.status(200).json({ auth: false, msg: "Login Failed" })
        }
        // res.status(404).json({auth:true,msg:"Login successfull"})

    }
    catch (err) {
        return res.status(404).json({ auth: false, msg: err })
    }
})

// endpoint
app.post("/reg", async function (req, res) {
    // console.log(req.body)
    try {
        //db connection 
        const savedUser = await UserModel.create(req.body)

        if (!savedUser) {
            return res.json({ reg: false, msg: "Register Failed" })
        }

        res.status(200).json({ reg: true, msg: "Register successfull" })
    }
    catch (err) {
        return res.json({ error: err, reg: false })
    }
    // res.status(404).json({auth:true,msg:"Login successfull"})
})


app.put("/incident/:id", authMiddleware, async function (req, res) {
    const id = req.params.id
    const data = req.body
    try {
        const updatedData = await IncidentModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(id), data
        )

        if (!updatedData) {
            return res.json({ msg: "Update failed", updt: false })
        }

        res.json({ msg: "Update Suucessfull", updt: true })
    }
    catch (err) {
        return res.json({ msg: "Update failed:" + err, updt: false })

    }
})

app.delete("/incident/:id",authMiddleware, async function (req, res) {
    const id = req.params.id
    // string 

    try {
        const deletedIncident = await IncidentModel.findByIdAndDelete(
            new mongoose.Types.ObjectId(id)
        )

        if (!deletedIncident) {
            return res.json({ del: false, msg: "Incident not deleted" })
        }
        return res.json({ del: true, msg: "Incident deleted" })
    }
    catch (err) {

        return res.json({ del: false, msg: "Incident not deleted:" + err })
    }
})

app.post("/incident",authMiddleware, async function (req, res) {

    const data = req.body

    try {
        const savedIncident = await IncidentModel.create(data)

        if (!savedIncident) {
            return res.json({ save: false, msg: "Incident not saved" })
        }

        res.json({ save: true, msg: "Incident saved" })

    }
    catch (err) {
        return res.json({ save: false, msg: "Incident not saved:" + err })
    }

})

app.listen(process.env.PORT||5000, function () {

    connectToMongoDB().then(function () {

        console.log("Database Connected")

    }).catch(function (err) {

        console.error(err)
    })
    console.log("Server started on http://localhost:5000")
})





