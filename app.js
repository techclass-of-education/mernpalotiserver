const express = require("express")
const cors = require("cors")
const app = express()
const { connectToMongoDB } = require("./config/db")
const UserModel = require("./models/user")
const IncidentModel = require("./models/incident")
const { default: mongoose } = require("mongoose")

// allowing client running on link http://localhost:5173
app.use(cors({ origin: "http://localhost:5173" }))

app.use(express.json())   // req.body
// allow incoming json

// endpoint
app.get("/", function (req, res) {
    res.send("Server started")
})

// endpoint
app.get("/incident", async function (req, res) {
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


app.put("/incident/:id", async function (req, res) {
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

app.delete("/incident/:id", async function (req, res) {
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

app.post("/incident", async function (req, res) {

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

app.listen(5000, function () {

    connectToMongoDB().then(function () {

        console.log("Database Connected")

    }).catch(function (err) {

        console.error(err)
    })
    console.log("Server started on http://localhost:5000")
})





