import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { passwordRegex, deleteDuplicates } from "@julseb-lib/utils"
import { UserModel } from "../models"
import { SALT_ROUNDS, TOKEN_SECRET, jwtConfig, SERVER_PATHS } from "../utils"
import { COMMON_TEXTS } from "../data"
import type { EditAccountFormData, EditPasswordFormData } from "../types"

const router = Router()

const { USERS: PATHS } = SERVER_PATHS

router.get(PATHS.ALL_USERS, async (req, res, next) => {
	return await UserModel.find()
		.then(usersFromDb => res.status(200).json(usersFromDb))
		.catch(err => next(err))
})

router.get(PATHS.ALL_ARTISTS, async (req, res, next) => {
	const { approved } = req.query

	return await UserModel.find({ role: "artist" })
		.then(found => {
			const today = new Date()
			today.setHours(0, 0, 0, 0)

			const filteredArtists = found.map(artist => ({
				...(artist.toObject?.() ?? artist),
				available: Array.isArray(artist.available)
					? artist.available
							.filter(dateStr => {
								const date = new Date(dateStr)
								date.setHours(0, 0, 0, 0)
								return date >= today
							})
							.sort((a, b) =>
								new Date(a) < new Date(b) ? -1 : 0,
							)
					: [],
			}))

			if (approved) {
				if (approved === "true") {
					const approvedArtists = filteredArtists.filter(
						artist => artist.approved === true,
					)

					return res.status(200).json(approvedArtists)
				} else if (approved === "false") {
					const approvedArtists = filteredArtists.filter(
						artist => artist.approved === false,
					)

					return res.status(200).json(approvedArtists)
				}
			}

			return res.status(200).json(filteredArtists)
		})
		.catch(err => next(err))
})

router.get(PATHS.ALL_ADMINS, async (_, res, next) => {
	return await UserModel.find({ role: "admin" })
		.then(found => res.status(200).json(found))
		.catch(err => next(err))
})

router.get(PATHS.GET_ALL_CITIES, async (_, res, next) => {
	return await UserModel.find({ role: "artist" })
		.then(found => {
			const cities = found
				.map(user => user.city)
				.filter(city => city !== null || city !== undefined)
			return res.status(200).json(deleteDuplicates(cities))
		})
		.catch(err => next(err))
})

router.get(PATHS.GET_ALL_GENRES, async (_, res, next) => {
	return await UserModel.find({ role: "artist" })
		.then(found => {
			const genres = found
				.map(user => user.genre)
				.filter(genre => genre !== null || genre !== undefined)
			return res.status(200).json(deleteDuplicates(genres))
		})
		.catch(err => next(err))
})

router.get(PATHS.GET_USER(), async (req, res, next) => {
	return await UserModel.findById(req.params.id)
		.populate({
			path: "conversations",
			populate: [
				{ path: "user1", model: "User" },
				{ path: "user2", model: "User" },
				{
					path: "messages",
					model: "Message",
					populate: [
						{ path: "sender", model: "User" },
						{ path: "conversation", model: "Conversation" },
					],
				},
			],
		})
		.populate("conversations")
		.then(userFromDb => {
			console.log(userFromDb)
			return res.status(200).json(userFromDb)
		})
		.catch(err => {
			next(err)
			return res.status(400).json({
				message: COMMON_TEXTS.ERRORS.USER_NOT_EXIST,
			})
		})
})

router.get(PATHS.ARTIST_BY_SLUG(), async (req, res, next) => {
	return await UserModel.findOne({ slug: req.params.slug })
		.then(found => {
			const today = new Date()
			today.setHours(0, 0, 0, 0)

			const filteredArtist = {
				...(found as any)._doc,
				available: found?.available
					.filter(date => new Date(date) >= new Date())
					.sort((a, b) => (new Date(a) < new Date(b) ? -1 : 0)),
			}

			return res.status(200).json(filteredArtist)
		})
		.catch(err => next(err))
})

router.get(PATHS.GET_PRICES, async (_, res, next) => {
	return await UserModel.find({ role: "artist" })
		.then(found => {
			const prices = found
				.map(user => user.price)
				.sort((a, b) => (a < b ? -1 : 0))
			return res.status(200).json(prices)
		})
		.catch(err => next(err))
})

router.put(PATHS.EDIT_ACCOUNT(), async (req, res, next) => {
	const { fullName } = req.body as EditAccountFormData

	if (!fullName) {
		return res
			.status(400)
			.json({ message: COMMON_TEXTS.ERRORS.FULL_NAME_EMPTY })
	}

	return await UserModel.findByIdAndUpdate(
		req.params.id,
		{ ...req.body },
		{ new: true },
	)
		.then(updatedUser => {
			const payload = { user: updatedUser }
			const authToken = jwt.sign(payload, TOKEN_SECRET, jwtConfig)

			return res.status(201).json({
				user: updatedUser,
				authToken: authToken,
			})
		})
		.catch(err => next(err))
})

router.put(PATHS.EDIT_PASSWORD(), async (req, res, next) => {
	const { oldPassword, newPassword } = req.body as EditPasswordFormData

	if (!passwordRegex.test(newPassword)) {
		return res.status(400).json({
			message: COMMON_TEXTS.ERRORS.PASSWORD_NOT_VALID,
		})
	}

	return await UserModel.findById(req.params.id)
		.then(async foundUser => {
			if (!foundUser) {
				return res
					.status(400)
					.json({ message: COMMON_TEXTS.ERRORS.USER_NOT_EXIST })
			}

			if (!(await bcrypt.compare(oldPassword, foundUser?.password))) {
				return res
					.status(400)
					.json({ message: COMMON_TEXTS.ERRORS.OLD_PASSWORD_WRONG })
			}

			const salt = bcrypt.genSaltSync(SALT_ROUNDS)
			const hashedPassword = bcrypt.hashSync(newPassword, salt)

			return await UserModel.findByIdAndUpdate(
				req.params.id,
				{ password: hashedPassword },
				{ new: true },
			).then(updatedUser => {
				const payload = { user: updatedUser }
				const authToken = jwt.sign(payload, TOKEN_SECRET, jwtConfig)

				return res.status(201).json({ user: updatedUser, authToken })
			})
		})
		.catch(err => next(err))
})

router.delete(PATHS.DELETE_ACCOUNT(), async (req, res, next) => {
	return await UserModel.findByIdAndDelete(req.params.id)
		.then(() =>
			res.status(200).json({ message: COMMON_TEXTS.USER_DELETED }),
		)
		.catch(err => next(err))
})

export default router
