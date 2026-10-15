const express=require("express")
const cors=require("cors")
const app=express()

// allowing client running on link http://localhost:5173
app.use(cors({origin:"http://localhost:5173"}))

// endpoint
app.get("/",function(req,res){
    res.send("Server started")
})

// endpoint
app.get("/about",function(req,res){
    res.send("About Link")
})

// endpoint
app.post("/auth",function(req,res){
    res.send("Auth Link")
})



app.listen(5000,function(){
    console.log("Server started on http://localhost:5000")
})





