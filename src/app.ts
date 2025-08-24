import "dotenv/config"
import express from "express"
import config from "./config"
import allRoutes from "./routes"
import { errorHandler } from "./error-handling"
import { BASE_API_URL } from "./utils"

import "./db"

const app = express()
config(app)

app.use(BASE_API_URL, allRoutes)
errorHandler(app)

export default app
