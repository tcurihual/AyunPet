import { Router } from "express";

const router = Router()

router.get("/conversation/:conversationId", (req,res)=>{
    const { conversationId } = req.params
    res.status(200).json({
        message: "get messages endpoint reached",
        type: "success",
        value: {
            endpoint: "/api/adoptions/messages/conversations/:userId",
            conversationId: conversationId
        }
    })
})

router.get("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        meessage: "Get message by ID endpoint reached",
        type: "success",
        value: {
            endpoint: "/api/adoptions/messages:id",
            method: "get",
            messageId: id
        }
    })
})

router.get("/conversations/:userId", (req,res)=>{
    const { userId} = req.params
    res.status(200).json({
        message: "get user conversations endpoint reached",
        type: "success",
        value: {
            endpoint: "/api/adoption/messages/conversations/:userId",
            method: "get",
            userId: userId
        }
    })
})

router.post("/", (req, res)=>{
    res.status(201).json({
        message: "send message endpoint reached",
        type: "sucess",
        value: {
            endpoint: "api/adoptions/messages",
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
            endpoitn: "api/adoptions/messages:id",
            method: "put",  
            messageId: id
        }
    })
})

router.patch("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "",
        type: "success",
        value: {
            endpoitn: "api/adoptions/messages:id",
            method: "patch",
            messageId: id
        }
    })
})


router.delete("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "delete message endpoint reached",
        type:"success",
        value:{
            endpoint: "api/adoptions/messsages:id ",
            method: "delete",
            messageId: id
        }
    })
})

export default router