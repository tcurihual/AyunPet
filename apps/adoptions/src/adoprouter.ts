import { Router } from "express"
import historiesRouter from "./histories/routs"
import messagesRouter from "./messages/routs"
import publicationsRouter from "./publications/routs"
import reportsRouter from "./reports/routs"
import requestsRouter from "./requests/routs"

const router = Router()

router.use("/histories", historiesRouter)

router.use("/messages", messagesRouter)

router.use("/publications", publicationsRouter)

router.use("/reports", reportsRouter)

router.use("/requests",requestsRouter)

export default router