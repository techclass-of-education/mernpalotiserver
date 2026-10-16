const mongoose=require("mongoose")

const IncidentSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    severity:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    reportedBy:{
        type:String,
        required:true
    } 
},
{timestamps:true}// createdAt, updatedAt
)


const IncidentModel=mongoose.model("incident",
                        IncidentSchema)

module.exports=IncidentModel