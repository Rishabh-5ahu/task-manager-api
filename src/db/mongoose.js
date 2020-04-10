const mongoose= require('mongoose') //https://mongoosejs.com/ Documentation

mongoose.connect(process.env.MONGODB_URL,
 {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false})



//mongodb+srv://tasksapp:tasksapp@cluster0-gtfsn.mongodb.net/task-manager-api
//mongodb://localhost:27017/task-manager-api
