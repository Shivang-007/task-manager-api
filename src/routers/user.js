const express = require('express')
const User = require('../models/user')
const router =new express.Router()
const auth = require('../middleware/auth')
const multer = require('multer')

//create user
router.post('/users', async (req, res) => {

    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
    //  user.save().then(()=>{
    //       res.status(201).send(user)
    //     }).catch((error)=>{
    //         res.status(400).send(error)
    //     })
})

router.post('/user/login',async (req,res)=>{
    try{
       const user = await User.findByCredentials(req.body.email,req.body.password)
       const token = await user.generateAuthToken()
       res.send({
           user,
           token,
           message:'user logged in successfully'
        })
    }catch(e){
       res.status(400).send()
    }
})

//get All user
router.get('/user-data',auth, async (req, res) => {

    try {
        const users = await User.find({})
        res.status(201).send({users})
    } catch (e) {
        res.status(400).send(e)
    }
    //    User.find({}).then((users)=>{
    //        res.send(users)
    //    }).catch((error)=>{
    //        res.status(500).send()
    //    })
})
router.post('/user/logout',auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.status(200).send({
            message:'user logged out successfully'
        })
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users/me',auth, async (req, res) => {
    res.send(req.user)
})
//get perticular user by id
router.get('/getuser/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)
        if (!user) {
            res.status.send(404)
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
    //    User.findById(_id).then((user)=>{
    //       if(!user){
    //          res.status.send(404)
    //       }
    //        res.send(user)
    //    }).catch((error)=>{
    //        res.status(500).send()
    //    })
})

// Update user
router.patch('/users/me',auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowUpdates = ['name','email','password','age']
    const isValidOperation = updates.every((update)=>allowUpdates.includes(update))
    if(!isValidOperation){
        console.log('invlid updates')
        return res.status(400).send({
            error:"Invalid Updates!!"
        })
    }
    try{
        updates.forEach((update)=>req.user[update]=req.body[update])
        const user = await req.user.save()
       res.status(200).send({
           message:'user updated successfully',
           user
        })
    }catch(e){
        res.status(400).send(e)
    }
})


//delete user
router.delete('/user/me',auth,async (req,res)=>{
    // const user = await User.findByIdAndDelete(req.params.id)
    // if(!user){
    //     res.status(404).send()
    // }
    // res.status(200).send({
    //     message:"user deleted successfully"
    // })

    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send(e)
    }
})

const avatar = multer({
    dest:'avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
           return cb(new Error('file must be an Image'))
        }
        cb(undefined,true)
    }
})
router.post('/user/me/avatar',auth,avatar.single('avatar'),async (req,res)=>{
    req.user.avatar = req.file.buffer
    await req.user.save()
    console.log(req.user)
    res.send('avatar uploaded successfully')
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
}
)

router.get('/user/:id/avatar',async (req,res)=>{
    try{
        const user =await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
          }
          res.set('Content-Type','image/jpg')
          res.send(user.avatar)
    }catch(e){
        res.status(400).send()
    }
    

})

router.delete('/user/me/avatar',auth,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send('avatar deleted successfully')
})
module.exports = router