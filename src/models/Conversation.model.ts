import { Schema, model } from "mongoose"
import type { Conversation } from "../types"

const conversationSchema = new Schema<Conversation>(
	{
		user1: { type: Schema.Types.ObjectId, ref: "User" },
		user2: { type: Schema.Types.ObjectId, ref: "User" },
		readUser1: Boolean,
		readUser2: Boolean,
		messages: [
			{
				body: String,
				sender: { type: Schema.Types.ObjectId, ref: "User" },
				date: String,
				time: String,
			},
		],
	},
	{ timestamps: true },
)

export const ConversationModel = model<Conversation>(
	"Conversation",
	conversationSchema,
)
