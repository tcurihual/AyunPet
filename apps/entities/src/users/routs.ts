import { Router } from "express";

const router = Router()

router.get("/", (req,res)=>{
    res.status(200).json({
        message: "get users endpoint reached",
        type: "success",
        value: {
            endpoint: "/api/entities/users/"
        }
    })
})

router.get("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        meessage: "get user by id enpoint reached",
        type: "success",
        value: {
            endpoint: "/api/entities/users/:id",
            method: "get",
            userId: id
        }
    })
})

router.post("/", (req,res)=>{
    res.status(200).json({
        message: "create user endpoint reached",
        type: "success",
        value: {
            endpoint:"/api/entities/users:id",
            method: "post"
        }
    })
})

router.put("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "update user endpoint reached",
        type: "success",
        value: {
            endpoitn: "api/entities/users:id",
            method: "put",
            userId: id
        }
    })
})

router.patch("/:id", (req, res) => {
    const { id } = req.params
    res.status(200).json({
        message: "patch user endpoint reached",
        type: "success",
        values: {
            endpoint: "/api/entities/users/:id",
            method: "patch",
            userId: id
        }
    })
})

router.delete("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "delete user endpoint reached",
        type:"success",
        value:{
            endpoint: "api/entities/users:id",
            method: "delete",
            userId: id
        }
    })
})

export default router