import { Router } from "express"
import { getToday, getTimeNow } from "@julseb-lib/utils"
import { ConversationModel } from "../models"
import { SERVER_PATHS, encrypt, decrypt } from "../utils"
import type {
	NewConversationFormData,
	ReadConversationFormData,
	UnreadConversationFormData,
} from "../types"

const router = Router()

const { CONVERSATION: PATHS } = SERVER_PATHS

router.get(PATHS.ALL_CONVERSATIONS, async (_, res, next) => {
	return await ConversationModel.find()
		.populate("user1")
		.populate("user2")
		.populate({
			path: "messages",
			populate: {
				path: "sender",
				model: "User",
			},
		})
		.then(found => res.status(200).json(found))
		.catch(err => next(err))
})

router.get(PATHS.GET_CONVERSATION(), async (req, res, next) => {
	return await ConversationModel.findById(req.params.id)
		.populate("user1")
		.populate("user2")
		.populate({
			path: "messages",
			populate: {
				path: "sender",
				model: "User",
			},
		})
		.then(conversationFromDb => {
			conversationFromDb?.messages.forEach(
				msg => (msg.body = decrypt(msg.body)),
			)

			return res.status(200).json(conversationFromDb)
		})
		.catch(err => next(err))
})

router.get(PATHS.GET_USER_CONVERSATIONS(), async (req, res, next) => {
	return await ConversationModel.find({
		$or: [{ user1: req.params.id }, { user2: req.params.id }],
	})
		.populate("user1")
		.populate("user2")
		.populate("messages")
		.populate({
			path: "messages",
			populate: {
				path: "sender",
				model: "User",
			},
		})
		.then(foundConversations => {
			foundConversations.forEach(conversation =>
				conversation.messages.forEach(
					msg => (msg.body = decrypt(msg.body)),
				),
			)

			foundConversations.sort((a, b) =>
				new Date(a.updatedAt) > new Date(b.updatedAt) ? -1 : 0,
			)

			return res.status(200).json(foundConversations)
		})
		.catch(err => next(err))
})

router.post(PATHS.NEW_CONVERSATION, async (req, res, next) => {
	const { user1, user2, body } = req.body as NewConversationFormData

	return await ConversationModel.create({
		user1,
		user2,
		readUser1: true,
		readUser2: false,
		messages: [
			{
				body: encrypt(body),
				date: getToday(),
				time: getTimeNow(),
				sender: user1,
			},
		],
	})
		.then(async createdConversation => {
			res.status(200).json(createdConversation)
		})
		.catch(err => next(err))
})

router.put(PATHS.READ_CONVERSATION(), async (req, res, next) => {
	const { readUser1, readUser2 } = req.body as ReadConversationFormData

	return await ConversationModel.findByIdAndUpdate(
		req.params.id,
		{ readUser1, readUser2 },
		{ new: true },
	)
		.then(updatedConversation => res.status(200).json(updatedConversation))
		.catch(err => next(err))
})

router.put(PATHS.UNREAD_CONVERSATION(), async (req, res, next) => {
	const { currentUser, conversation } = req.body as UnreadConversationFormData

	if (conversation.user1._id === currentUser) {
		return await ConversationModel.findByIdAndUpdate(
			req.params.id,
			{ readUser2: false },
			{ new: true },
		)
			.then(updatedConversation =>
				res.status(200).json(updatedConversation),
			)
			.catch(err => next(err))
	}

	if (conversation.user2._id === currentUser) {
		return await ConversationModel.findByIdAndUpdate(
			req.params.id,
			{ readUser1: false },
			{ new: true },
		)
			.then(updatedConversation =>
				res.status(200).json(updatedConversation),
			)
			.catch(err => next(err))
	}
})

router.delete(PATHS.DELETE_CONVERSATION(), async (req, res, next) => {
	return await ConversationModel.findByIdAndDelete(req.params.id)
		.then(() =>
			res
				.status(200)
				.json({ message: "The conversation has been deleted." }),
		)
		.catch(err => next(err))
})

export default router
