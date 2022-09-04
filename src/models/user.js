
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        require:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
               throw new Error("email is invalid")
            }
        }
    },
    password:{
        type:String,
        require:true,
        minlength:4,
        trim:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
               throw new Error("email is invalid")
            }
        }
    },
    age:{
        type:Number,
        trim:true,
        validate(value){ 
            if(value<0){
                throw new Error('age must be a positive number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            require:true 
        }
    }],
    avatar:{
        type:Buffer
    }
}
,{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})
userSchema.methods.toJSON = function(){
    const user =this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}
userSchema.methods.generateAuthToken = async function(){
    const user =this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.statics.findByCredentials = async (email,password)=>{
     const user =await User.findOne({email})
     if(!user){
         throw new Error('Unable to login')
     }
     const isMatch = await bcrypt.compare(password,user.password)
     if(!isMatch){
         throw new Error('Unable to login!')
     }
     return user
}

//middleware:Hash the plain text password before saving
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({ owner:user._id })
    next()
})
const User = mongoose.model('User',userSchema)
// const me = new User({
//     name:"Parth",
//     age:22,
//     email:"parth@gmail.com",
//     password:"  parth123 "
// })
// me.save().then(()=>{
//    console.log(me)
// }).catch((error)=>{
//     console.log("Error!",error)
// })

module.exports=User