import { Router } from "express";

const router = Router()

router.post("/login", (req, res)=>{
    res.status(200).json({
        message: "login endpoint reached",
        type: "success",
        values: {
            endpoint: "/api/auth/login",
            method: "post"
        }
    })
})

router.post("/register", (req, res)=>{
    res.status(200).json({
        message: "register endpoint reached",
        type: "success",
        values: {
            endpoint: "/api/auth/register",
            method: "post"
        }
    })
})

router.post("/logout",(req,res) =>{
    res.status(200).json({
        message: " logout endpoint reached",
        type: "success",
        values: {
            endpoint: "/api/auth/logout"
        }
    })
})

export default router