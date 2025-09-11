import { Router } from "express";

const router = Router()

router.get("/", (req,res)=>{
    res.status(200).json({
        message: "Get all publications endpoint reached",
        type: "success",
        value: {
            endpoint: "/api/adoptions/publications"
        }
    })
})

router.get("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        meessage: "get publication by ID endpoint reached",
        type: "success",
        value: {
            endpoint: "/api/adoptions/publications:id",
            method: "get",
            publicationId: id
        }
    })
})

router.get("/user/:userId", (req,res)=>{
    const { userId} = req.params
    res.status(200).json({
        message: "get publications by user endpoint reached",
        type: "success",
        value: {
            endpoint: "/api/adoption/publications/user/:userId",
            method: "get",
            userId: userId
        }
    })
})

router.get("/search", (req, res)=>{
    res.status(200).json({
        message: "search publications endpoint reached",
        type: "sucess",
        value: {
            endpoint: "api/adoptions/publications/search",
            method: "get",
            query_params: req.query
        }
    })
})

router.post("/", (req,res)=>{
    res.status(201).json({
        message: "create publication endpoint reached",
        type: "sucesss",
        value: {
            endpoint: "/api/adoption/publications",
            method: "post"
        }
    })
})


router.put("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "update publication endpoint reached",
        type: "success",
        value: {
            endpoitn: "api/adoptions/publications:id",
            method: "put",  
            publicationId: id
        }
    })
})

router.patch("/:id/status", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "status update publication endpoint reached",
        type: "success",
        value: {
            endpoitn: "api/adoptions/publications:id",
            method: "patch",
            publicationId: id
        }
    })
})


router.delete("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "delete publication endpoint reached",
        type:"success",
        value:{
            endpoint: "api/adoptions/publications:id ",
            method: "delete",
            publicationId: id
        }
    })
})

export default router