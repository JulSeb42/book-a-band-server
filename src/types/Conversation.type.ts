import { User } from "./User.type"

export type Message = {
	_id: string
	body: string
	date: string
	time: string
	sender: User
}

export type Conversation = {
	_id: string
	user1: User
	user2: User
	readUser1: boolean
	readUser2: boolean
	messages: Array<Message>
}

export type NewConversationFormData = {
	user1: string
	user2: string
	body: string
}

export type ReadConversationFormData = {
	readUser1?: boolean
	readUser2?: boolean
}

export type UnreadConversationFormData = {
	currentUser: string
	conversation: Conversation
}
