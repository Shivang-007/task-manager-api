
const { MongoClient,ObjectID } = require('mongodb')
const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
// const id = new ObjectID()
// console.log(id)

MongoClient.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        console.log('not connected to database')
    }
    const db = client.db(databaseName)
    // db.collection('users').insertOne({
    //     "Name" : "shivang",
    //     "age" : 21
    // },(error,result) => {
    //     if(error){
    //         console.log('not connected to datatabse')
    //     }else{
    //         console.log(result.ops)
    //     }
    // })

    // db.collection('users').insertMany([
    //     {
    //         "Name": "hitesh",
    //         "age": 25
    //     }, {
    //         "Name": "sunny",
    //         "age": 20
    //     },
    //     {
    //         "Name": "yash",
    //         "age": 18
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         console.log('not connected to datatabse')
    //     } else {
    //         console.log(result.ops)
    //     }
    // })

    // db.collection('users').findOne({name:"shivang"},(error,user) =>{
    //     if(error){
    //         console.log(error)
    //     }
    //         console.log(user)
        
    // })
    // db.collection('users').find({age:25}).toArray((error,user) =>{
    //     if(error){
    //         console.log(error)
    //     }
    //         console.log(user)
        
    // })
    // db.collection('users').find({Name:"shivang"}).toArray((error,user) =>{
    //     if(error){
    //         console.log(error)
    //     }
    //         console.log(user)
        
    // })

    // db.collection('users').updateOne({
    //     _id:new ObjectID("62d5893debe51b3d4863a434")
    // },{
    //    $set : {
    //        Name : "Tejas"
    //    }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    
    // db.collection('users').deleteOne({
    //     _id:new ObjectID("62d5893debe51b3d4863a434")
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })
})