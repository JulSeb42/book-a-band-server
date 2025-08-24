import http from "http"
import { Server } from "socket.io"
import { getTimeNow, getToday } from "@julseb-lib/utils"
import app from "./app"
import { PORT, encrypt } from "./utils"
import { ConversationModel } from "./models"

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: process.env.ORIGIN } })

io.on("connection", socket => {
	console.log(`A user connected: ${socket.id}`)

	socket.on("chat message", async msg => {
		const { body, sender, conversationId, receiver } = msg

		const encryptedBody = encrypt(body)

		io.emit("chat message", msg)

		if (conversationId) {
			return await ConversationModel.findByIdAndUpdate(
				conversationId,
				{
					$push: {
						messages: {
							body: encryptedBody,
							sender,
							conversationId,
							receiver,
							date: getToday(),
							time: getTimeNow(),
						},
					},
				},
				{ new: true },
			)
		}

		return await ConversationModel.create({
			user1: sender,
			user2: receiver,
			readUser1: true,
			readUser2: false,
			messages: [
				{
					body: encryptedBody,
					date: getToday(),
					time: getTimeNow(),
					sender,
				},
			],
		})
	})

	socket.on("disconnect", () => {
		console.log(`User disconnected: ${socket.id}`)
	})
})

server.listen(PORT, () => {
	console.log(
		`🚀 Server & Socket.io listening on port http://localhost:${PORT}`,
	)
})
