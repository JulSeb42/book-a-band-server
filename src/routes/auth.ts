import { Router, type Request, type Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import {
	passwordRegex,
	emailRegex,
	getRandomString,
	getRandomAvatar,
} from "@julseb-lib/utils"
import { UserModel } from "../models"
import { isAuthenticated } from "../middleware"
import {
	jwtConfig,
	SALT_ROUNDS,
	TOKEN_SECRET,
	sendMail,
	SERVER_PATHS,
} from "../utils"
import { COMMON_TEXTS } from "../data"
import type {
	SignupFormData,
	LoginFormData,
	ForgotPasswordFormData,
	User,
} from "../types"

const router = Router()

const { AUTH: PATHS } = SERVER_PATHS

router.post(PATHS.SIGNUP, async (req, res, next) => {
	const { email, fullName, password } = req.body as SignupFormData

	const verifyToken = getRandomString(20)

	if (!fullName || !emailRegex.test(email) || !passwordRegex.test(password)) {
		if (!fullName)
			res.status(400).json({
				message: COMMON_TEXTS.ERRORS.FULL_NAME_EMPTY,
			})

		if (!emailRegex.test(email))
			res.status(400).json({
				message: COMMON_TEXTS.ERRORS.EMAIL_NOT_VALID,
			})

		if (!passwordRegex.test(password))
			res.status(400).json({
				message: COMMON_TEXTS.ERRORS.PASSWORD_NOT_VALID,
			})

		return
	}

	return await UserModel.findOne({ email })
		.then(async foundUser => {
			if (foundUser) {
				return res
					.status(400)
					.json({ message: COMMON_TEXTS.ERRORS.EMAIL_TAKEN })
			}

			const salt = bcrypt.genSaltSync(SALT_ROUNDS)
			const hashedPassword = bcrypt.hashSync(password, salt)

			return await UserModel.create({
				...req.body,
				password: hashedPassword,
				verified: false,
				verifyToken,
				avatar: getRandomAvatar(),
			}).then(createdUser => {
				sendMail(
					email,
					COMMON_TEXTS.EMAIL_SIGNUP_TITLE,
					COMMON_TEXTS.EMAIL_SIGNUP_BODY(
						createdUser as User,
						verifyToken,
					),
				)

				const payload = { user: createdUser }
				const authToken = jwt.sign(payload, TOKEN_SECRET, jwtConfig)

				return res.status(201).json({ user: createdUser, authToken })
			})
		})
		.catch(err => next(err))
})

router.post(PATHS.LOGIN, async (req, res, next) => {
	const { email, password } = req.body as LoginFormData

	console.log(req.body)

	if (email === "" || password === "") {
		return res
			.status(400)
			.json({ message: COMMON_TEXTS.ERRORS.PROVIDE_EMAIL_AND_PASSWORD })
	}

	return await UserModel.findOne({ email })
		.then(foundUser => {
			if (!foundUser) {
				return res
					.status(401)
					.json({ message: COMMON_TEXTS.ERRORS.USER_NOT_EXIST })
			}

			const passwordCorrect = bcrypt.compareSync(
				password,
				foundUser.password,
			)

			if (!passwordCorrect) {
				return res.status(401).json({
					message: COMMON_TEXTS.ERRORS.AUTH_NOT_POSSIBLE,
				})
			}

			const payload = { user: foundUser }
			const authToken = jwt.sign(payload, TOKEN_SECRET, jwtConfig)

			return res.status(200).json({ authToken: authToken })
		})
		.catch(err => next(err))
})

router.get(PATHS.LOGGED_IN, isAuthenticated, (req, res) => {
	const payload = (req as any).payload
	console.log(`req.payload: ${payload}`)

	return res.status(200).json(payload)
})

router.put(PATHS.VERIFY, async (req, res, next) => {
	const { id, token } = req.body

	await UserModel.findById(id).then(async foundUser => {
		if (!foundUser) {
			return res
				.status(400)
				.json({ message: COMMON_TEXTS.ERRORS.USER_NOT_EXIST })
		}

		if (foundUser.verifyToken !== token) {
			return res
				.status(400)
				.json({ message: COMMON_TEXTS.ERRORS.VERIFY_TOKEN_NOT_MATCH })
		}

		return await UserModel.findByIdAndUpdate(
			id,
			{ verified: true },
			{ new: true },
		)
			.then(updatedUser => {
				const payload = { user: updatedUser }
				const authToken = jwt.sign(payload, TOKEN_SECRET, jwtConfig)

				return res.status(200).json({
					user: updatedUser,
					authToken,
				})
			})
			.catch(err => next(err))
	})
})

router.post(
	PATHS.FORGOT_PASSWORD,
	async (
		req: Request,
		res: Response<{ body?: User; message?: string }>,
		next,
	) => {
		const { email } = req.body as ForgotPasswordFormData

		const resetToken = getRandomString(20)

		if (!emailRegex.test(email)) {
			return res
				.status(400)
				.json({ message: COMMON_TEXTS.ERRORS.EMAIL_NOT_VALID })
		}

		return await UserModel.findOne({ email })
			.then(async foundUser => {
				if (!foundUser) {
					return res
						.status(400)
						.json({ message: COMMON_TEXTS.ERRORS.USER_NOT_EXIST })
				}

				return await UserModel.findOneAndUpdate(
					{ email },
					{ resetToken },
					{ new: true },
				).then(foundUser => {
					console.log("Start send mail")

					sendMail(
						email,
						COMMON_TEXTS.EMAIL_RESET_PASSWORD_TITLE,
						COMMON_TEXTS.EMAIL_RESET_PASSWORD_BODY(
							foundUser as User,
							resetToken,
						),
					)

					return res.status(200).json({
						message: "Message has been sent successfully!",
					})
				})
			})
			.catch(err => next(err))
	},
)

router.put(PATHS.RESET_PASSWORD, async (req, res, next) => {
	const { password, resetToken, id } = req.body

	if (!passwordRegex.test(password)) {
		return res
			.status(400)
			.json({ message: COMMON_TEXTS.ERRORS.EMAIL_NOT_VALID })
	}

	return await UserModel.findById(id)
		.then(async foundUser => {
			if (!foundUser) {
				return res
					.status(400)
					.json({ message: COMMON_TEXTS.ERRORS.USER_NOT_EXIST })
			}

			if (foundUser.resetToken !== resetToken) {
				return res.status(400).json({
					message: COMMON_TEXTS.ERRORS.PROBLEM_RESET_PASSWORD,
				})
			}

			const salt = bcrypt.genSaltSync(SALT_ROUNDS)
			const hashedPassword = bcrypt.hashSync(password, salt)

			return await UserModel.findByIdAndUpdate(
				id,
				{ password: hashedPassword, resetToken: "" },
				{ new: true },
			).then(updatedUser => {
				return res.status(200).json({ user: updatedUser })
			})
		})
		.catch(err => next(err))
})

export default router
