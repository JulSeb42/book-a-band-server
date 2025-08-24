import { Router } from "express"
import { SERVER_PATHS } from "../utils"
import auth from "./auth"
import user from "./user"
import admin from "./admin"
import conversation from "./conversation"
/* Prepend import new route - DO NOT REMOVE */

const router = Router()

router.get("/", (_, res) => {
	res.json("All good in here")
})

router.use(SERVER_PATHS.AUTH.ROOT, auth)
router.use(SERVER_PATHS.USERS.ROOT, user)
router.use(SERVER_PATHS.ADMIN.ROOT, admin)
router.use(SERVER_PATHS.CONVERSATION.ROOT, conversation)
/* Prepend router use - DO NOT REMOVE */

export default router
