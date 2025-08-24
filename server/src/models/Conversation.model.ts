import { Schema, model } from "mongoose"
import type { Conversation } from "types"

const conversationSchema = new Schema<Conversation>(
	{
		
	},
	{ timestamps: true }
)

export const ConversationModel = model<Conversation>("Conversation", conversationSchema)
