import { Router } from "express";

const router = Router()

router.get("/", (req,res)=>{
    res.status(200).json({
        message: "Get all requests endpoint reached",
        type: "success",
        value: {
            endpoint: "/api/adoptions/requests"
        }
    })
})

router.get("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        meessage: "",
        type: "success",
        value: {
            endpoint: "/api/adoptions/requests:id",
            method: "get",
            requestId: id
        }
    })
})

router.get("/sent/:userId", (req,res)=>{
    const { userId } = req.params
    res.status(200).json({
        meessage: "",
        type: "success",
        value: {
            endpoint: "/api/adoptions/requests:id",
            method: "get",
            requestId: userId
        }
    })
})

router.get("/received/:userId", (req,res)=>{
    const { userId } = req.params
    res.status(200).json({
        meessage: "",
        type: "success",
        value: {
            endpoint: "/api/adoptions/requests:id",
            method: "get",
            requestId: userId
        }
    })
})

router.post("/", (req,res)=>{
    res.status(201).json({
        message: "",
        type: "",
        value: {
            endpoint: "/api/adoption/request",
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
            endpoitn: "api/adoptions/requests:id",
            method: "put",  
            requestId: id
        }
    })
})

router.patch("/:id/status", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "",
        type: "success",
        value: {
            endpoitn: "api/adoptions/requests:id",
            method: "patch",
            requestId: id
        }
    })
})

router.get("/publication/:publicationId", (req, res) => {
    const { publicationId } = req.params
    res.status(200).json({
        message: "",
        type: "success",
        values: {
            endpoint: "/api/adoptions/requests/publication/:publicationId",
            method: "get",
            publicationId: publicationId
        }
    })
})

router.delete("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "",
        type:"success",
        value:{
            endpoint: "api/adoptions/requests:id ",
            method: "delete",
            requestId: id
        }
    })
})

export default router