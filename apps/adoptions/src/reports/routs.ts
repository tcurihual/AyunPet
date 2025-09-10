import { Router } from "express"

const router = Router()

router.get("/", (req, res) => {
    res.status(200).json({
        message: "",
        type: "success",
        values: {
            endpoint: "/api/adoptions/reports",
            method: "GET"
        }
    })
})


router.get("/:id", (req, res) => {
    const { id } = req.params
    res.status(200).json({
        message: "",
        type: "success",
        values: {
            endpoint: "/api/adoptions/reports/:id",
            method: "get",
            reportId: id
        }
    })
})

router.get("/reported-user/:userId", (req, res) => {
    const { userId } = req.params
    res.status(200).json({
        message: "",
        type: "success",
        values: {
            endpoint: "/api/adoptions/reports/reported-user/:userId",
            method: "get",
            reportedUserId: userId
        }
    })
})

router.get("/publication/:publicationId", (req, res) => {
    const { publicationId } = req.params
    res.status(200).json({
        message: "",
        type: "success",
        values: {
            endpoint: "/api/adoptions/reports/publication/:publicationId",
            method: "get",
            publicationId: publicationId
        }
    })
})

router.post("/", (req, res) => {
    res.status(201).json({
        message: "",
        type: "success",
        values: {
            endpoint: "/api/adoptions/reports",
            method: "POST"
        }
    })
})

router.patch("/:id/status", (req, res) => {
    const { id } = req.params
    res.status(200).json({
        message: "",
        type: "success",
        values: {
            endpoint: "/api/adoptions/reports/:id/status",
            method: "patch",
            reportId: id
        }
    })
})

router.put("/:id", (req, res) => {
    const { id } = req.params
    res.status(200).json({
        message: "",
        type: "success",
        values: {
            endpoint: "/api/adoptions/reports/:id",
            method: "put",
            reportId: id
        }
    })
})

router.delete("/:id", (req,res)=>{
    const { id } = req.params
    res.status(200).json({
        message: "",
        type:"success",
        value:{
            endpoint: "api/adoptions/reports:id ",
            method: "delete",
            reportId: id
        }
    })
})

export default router