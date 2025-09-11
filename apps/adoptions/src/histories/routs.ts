import { Router } from "express";

const router = Router()

router.get("/", (req,res)=>{
    res.status(200).json({
        message: "Get histories endpoint reached",
        type: "success",
        value: {
            endpoint: "/api/adoptions/histories/conversations/:userId",
            method: "get"
        }
    })
})

router.get("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        meessage:  "Get histories by id endpoint reached",
        type: "success",
        value: {
            endpoint: "/api/adoptions/histories:id",
            method: "get",
            historyId: id
        }
    })
})


router.post("/", (req, res)=>{
    res.status(201).json({
        message: "create history endpoint reached",
        type: "sucess",
        value: {
            endpoint: "api/adoptions/histories",
            method: "post",
            query_params: req.query
        }
    })
})


router.put("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "update history endpoint reached",
        type: "success",
        value: {
            endpoitn: "api/adoptions/histories:id",
            method: "put",  
            historyId: id
        }
    })
})

router.patch("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "parcial update history endpoint reached",
        type: "success",
        value: {
            endpoitn: "api/adoptions/histories:id",
            method: "patch",
            historyId: id
        }
    })
})


router.delete("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "delete history endpoint reached",
        type:"success",
        value:{
            endpoint: "api/adoptions/histories:id ",
            method: "delete",
            historyId: id
        }
    })
})

export default router