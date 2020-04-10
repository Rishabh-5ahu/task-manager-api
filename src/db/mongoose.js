const mongoose= require('mongoose') //https://mongoosejs.com/ Documentation

mongoose.connect('mongodb+srv://tasksapp:tasksapp@cluster0-gtfsn.mongodb.net/task-manager-api',
 {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:false})




//mongodb://localhost:27017/task-manager-api
