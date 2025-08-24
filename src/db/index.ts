import mongoose from "mongoose"
import { MONGODB_URI } from "utils"

mongoose
	.connect(MONGODB_URI)
	.then(x => {
		console.log(
			`📥 Connected to Mongo! Database name: "${x.connections[0].name}"`,
		)
	})
	.catch(err => {
		console.error("Error connecting to mongo: ", err)
	})
