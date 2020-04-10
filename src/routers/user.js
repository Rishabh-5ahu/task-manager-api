const express=require('express')
const router =new express.Router()
const User=require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')
//const sharp=require('sharp')

router.post('/users',async (req,res)=>{
    const user=new User(req.body)
   // user.save().then(()=>{
   //     res.status(201).send(user)
   // }).catch((error)=>{
   //     res.status(400).send(error)
   // })
   try{
       await user.save()
       const token = await user.generateAuthToken() 
       res.status(201).send({user, token})
   }catch(error){
       res.status(400).send(error)
   }
})

router.post('/users/login',async (req,res)=>{
   try{
      const user = await User.findByCredentials(req.body.email, req.body.password)
      const token = await user.generateAuthToken() 
      res.status(200).send({user, token})
   }catch(e){
      console.log(e)
      res.status(400).send()
   }
})

router.post('/users/logout', auth, async (req,res)=>{
   try{
      req.user.tokens = req.user.tokens.filter((token)=>{
         return token.token!==req.token
      })
      await req.user.save()
      res.status(200).send()
   }catch(e){
      console.log(e)
      res.status(500).send()
   }
})

router.post('/users/logoutAll', auth, async (req,res)=>{
   try{
      req.user.tokens=[]
      await req.user.save()
      res.status(200).send()
   }catch(e){
      console.log(e)
      res.status(500).send()
   }
})

router.get('/users/me', auth, async (req,res)=>{

// User.find({}).then((users)=>{
//     res.status(201).send(users)
// }).catch((error)=>{
//     res.status(500).send(error)
// })

// try{
//   const users=await User.find({})
//   res.status(201).send(users)
// }catch(error){
//    res.status(500).send(error)
// }

res.send(req.user)
})

// router.get('/user/:id', auth, async (req,res)=>{
// const _id=req.params.id
// // User.findById(_id).then((user)=>{
// //     if(!user){
// //         return res.status(404).send()
// //     }
       
// //     res.send(user)
// // }).catch((error)=>{
// //     res.status(500).send(error)
// // })

// try{
//    const user=await User.findById(_id)
//    if(!user){
//        return res.status(404).send()
//    }
//    res.send(user)

// }catch(error){
//    res.status(500).send(error)
// }


// })

router.patch('/user/me', auth, async (req,res)=>{    //new:true means we get original data after update
const updates=Object.keys(req.body)
const allowsUpdates=['name','email','password','age']
const isValidOperation= updates.every((update)=>allowsUpdates.includes(update))
if(!isValidOperation)
   return res.status(400).send({error:"Invalid Update!"})


try{
    //   const user=await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
    //const user=await User.findByIdAndUpdate(req.params.id)
    updates.forEach((update)=>req.user[update]=req.body[update])
    await req.user.save()
      // if(!user)
      //      return res.status(404).send()

      res.send(req.user)
}catch(error){
   res.status(400).send(error)
}
})

router.delete('/user/me', auth,async (req,res)=>{ 
try{
   // const user=await User.findByIdAndDelete(req.user._id)  //req.params.id
   // if(!user)
   // return res.status(404).send()
   await req.user.remove() 
   res.send(req.user)
}catch(error){
   res.status(500).send(error)
}
})

const upload=multer({
   limits:{
      fileSize:1000000
   },
   fileFilter(req,file, callback){
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        return  callback(new Error('Please upload image png jpeg jpg'))
      
      callback(undefined,true)
   }
}).single('avatar')

router.post('/user/me/avatar', auth, upload, async (req,res)=>{
      //const buffer=sharp(req.file.buffer).resize({width:250,height:300}).png().tobuffer()
      req.user.avatar=req.file.buffer
      await req.user.save()
      res.send()
   },(error,req,res,next)=>{
      res.status(400).send({'error':error.message})
})

router.delete('/user/me/avatar', auth, async (req,res)=>{
   req.user.avatar=undefined
   await req.user.save()
   res.send()
})

router.get('/user/:id/avatar', async (req,res)=>{
   try{
      const user =await User.findById(req.params.id)
      if(!user || !user.avatar)
      throw new Error()

      res.set('Content-Type','image/jpeg')
      res.send(user.avatar)
   }catch(e){
      res.status(404).send()
   }
})

module.exports=router