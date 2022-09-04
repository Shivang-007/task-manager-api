
const mongoose = require('mongoose')



// const id = new ObjectID()
// console.log(id)

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
      useNewUrlParser:true,
      useCreateIndex:true,
      useCreateIndex:true
})
module.exports = mongoose