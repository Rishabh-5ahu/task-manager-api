const express=require('express')
const router =new express.Router()
const auth=require('../middleware/auth')
const Task=require('../models/task')

router.post('/tasks', auth, async (req,res)=>{
    //const task=new Task(req.body)
    const task=new Task({
        ...req.body,
        owner:req.user._id
    })
    // task.save().then(()=>{
    //     res.send(task)
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // })
    
    try{
        await task.save()
        res.send(task)
    }catch(error){
        res.status(400).send(error)                 //https://httpstatuses.com/
    }
})

router.get('/tasks',auth, async (req,res)=>{
    // Task.find({}).then((tasks)=>{
    //     res.status(201).send(tasks)
    // }).catch((error)=>{
    //     res.status(500).send(error)
    // })
        const match={}
        const sort={}
        if(req.query.completed){
            match.completed= req.query.completed==="true"
        }
        if(req.query.sortBy){
            part=req.query.sortBy.split(':')
            sort[part[0]]= part[1]==='desc'?-1:1
        }
    try{
        // const tasks=await Task.find({})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
            },
            sort
        }).execPopulate()
        res.status(201).send(req.user.tasks)
    }catch(e){
        res.status(500).send(error)
    }
})

router.get('/task/:id', auth, async (req,res)=>{
    const _id=req.params.id
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         return res.status(404).send()
    //     }
            
    //     res.send(task)
    // }).catch((error)=>{
    //     res.status(500).send(error)
    // })

    try{
        // const task=await Task.findById(_id)
        const task =await Task.findOne({_id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
            
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})



router.patch('/task/:id', auth, async (req,res)=>{    //new:true means we get original data after update
    const updates=Object.keys(req.body)
    const allowsUpdates=['description','completed']
    const isValidOperation= updates.every((update)=>allowsUpdates.includes(update))
    if(!isValidOperation)
        return res.status(400).send({error:"Invalid Update"})


    try{
           //const task=await Task.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true})
            //const task = await Task.findById(req.params.id)
            const task = await Task.findById({_id:req.params.id, owner: req.user._id})
               
           if(!task)
                return res.status(404).send()
            updates.forEach((update)=>task[update]=req.body[update])      
            await task.save()  
           res.send(task)
    }catch(error){
        res.status(400).send(error)
    }
})

router.delete('/task/:id', auth, async (req,res)=>{ 
    try{
        // const task=await Task.findByIdAndDelete(req.params.id)
        const task=await Task.findByIdAndDelete({_id:req.params.id, owner:req.user._id})
        if(!task)
        return res.status(404).send()
        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }
})

module.exports=router