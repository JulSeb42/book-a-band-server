import express from "express"
import logger from "morgan"
import cookieParser from "cookie-parser"
import cors from "cors"
import { ORIGIN } from "utils"

const config = (app: any) => {
	app.set("trust proxy", 1)

	app.use(
		cors({
			credentials: true,
			origin: ORIGIN,
		}),
	)

	app.use(logger("dev"))

	app.use(express.json())
	app.use(express.urlencoded({ extended: false }))
	app.use(cookieParser())
}

export default config
