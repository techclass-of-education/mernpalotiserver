const mongoose= require('mongoose')

 async function connectToMongoDB() {
  try {
    await mongoose.connect("mongodb+srv://sourabh_user:<db_password>@cluster0.ftfbg.mongodb.net/");
    console.log("You successfully connected to MongoDB!");
    return mongoose;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
 async function disconnectFromMongoDB() {
  await mongoose.connection.close();
}


module.exports={connectToMongoDB,disconnectFromMongoDB}