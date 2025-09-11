import { Router } from "express";

const router = Router()

router.get("/", (req,res)=>{
    res.status(200).json({
        message: "get pets endpoint reached",
        type: "success",
        value: {
            endpoint: "/api/entities/pets"
        }
    })
})

router.get("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        meessage: "get pets by id endpoint reached",
        type: "success",
        value: {
            endpoint: "/api/entities/pets:id",
            method: "get",
            userId: id
        }
    })
})

router.post("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "create pet enpdoint reached",
        type: "success",
        value: {
            endpoint:"/api/entities/pets:id",
            method: "post",
            userId: "id"
        }
    })
})

router.put("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "update pet endpoint reached",
        type: "success",
        value: {
            endpoitn: "api/entities/pets:id",
            method: "put",
            userId: id
        }
    })
})

router.delete("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "delete pet endpoint reached",
        type:"success",
        value:{
            endpoint: "api/entities/pets:id ",
            method: "delete",
            userId: id
        }
    })
})

export default router