import { Router } from "express";

const router = Router()

router.get("/", (req,res)=>{
    res.status(200).json({
        message: "",
        type: "success",
        value: {
            endpoint: "/api/entities/users/"
        }
    })
})

router.get("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        meessage: "",
        type: "success",
        value: {
            endpoint: "/api/entities/users/:id",
            method: "get",
            userId: id
        }
    })
})

router.post("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "",
        type: "success",
        value: {
            endpoint:"/api/entities/users",
            method: "post"
        }
    })
})

router.put("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "",
        type: "success",
        value: {
            endpoitn: "api/entities/users",
            method: "put",
            userId: id
        }
    })
})

router.delete("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "",
        type:"success",
        value:{
            endpoint: "api/entities/users",
            method: "delete",
            userId: id
        }
    })
})

export default router