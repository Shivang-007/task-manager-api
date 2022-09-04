const express = require('express')
const Task = require('../src/models/task')
const taskRoute = require('../src/routers/task')
const userRouter = require('./routers/user') 
require('../src/db/mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const app = express()
const port = process.env.port
app.use(express.json())
app.use(userRouter)
app.use(taskRoute)


const upload = multer({
    dest:'images',
    limits: {
        fileSize: 100000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.endsWith('.pdf')){
           return cb(new Error('file must be pdf'))
        }
        cb(undefined,true)
    }
})

app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send('image uploaded successfully')
})

// app.post('/tasks', (req, res) => {
//     const task = new Task(req.body);
//     task.save().then(() => {
//         res.status(201).send(task)
//     }).catch((error) => {
//         res.send('something is going rong')
//         res.status(400).send(error)
//     })
// })

// const myFunction = async () =>{
//     const password = "Red123"
//     const bcrypytPw = await bcrypt.hash(password,8)
//     console.log(password)
//     console.log(bcrypytPw)
// }
// myFunction()


// const myFunction = async () =>{
//     const token = jwt.sign({_id:"abc123"},'thisismytoken')
//     console.log(token)
//     const data = jwt.verify(token,'thisismytoken')
//     console.log(data)
// }

app.listen(port, () => {
    console.log('serveris setup on' + port)
})

const main = async () =>{
    const task = await Task.findById('62f1355f992ee58b4c6dbbaa')
    console.log(task.owner)
}
main()

// myFunction()
