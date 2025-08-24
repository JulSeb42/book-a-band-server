import { Router } from "express"
import { getRandomString } from "@julseb-lib/utils"
import { UserModel } from "models"
import { sendMail, SERVER_PATHS } from "utils"
import { SITE_DATA } from "data"

const router = Router()

const { ADMIN: PATHS } = SERVER_PATHS

router.put(PATHS.EDIT_ROLE(), async (req, res, next) => {
	const { id } = req.params
	const { role } = req.body

	await UserModel.findByIdAndUpdate(id, { role }, { new: true })
		.then(updatedUser => res.status(201).json(updatedUser))
		.catch(err => next(err))
})

router.put(PATHS.APPROVE_ARTIST(), async (req, res, next) => {
	return await UserModel.findByIdAndUpdate(
		req.params.id,
		{ approved: req.body.approved },
		{ new: true },
	)
		.then(updatedUser => res.status(200).json(updatedUser))
		.catch(err => next(err))
})

router.post(PATHS.RESET_PASSWORD(), async (req, res, next) => {
	const { id } = req.params

	return await UserModel.findById(id).then(async foundUser => {
		if (!foundUser) {
			return res.status(400).json({ message: "User not found." })
		}

		const resetToken = getRandomString()

		return await UserModel.findByIdAndUpdate(
			id,
			{ resetToken },
			{ new: true },
		)
			.then(async updatedUser => {
				sendMail(
					updatedUser!.email,
					`Reset your password on ${SITE_DATA.NAME}`,
					`<p>Hello ${updatedUser?.fullName},<br /><br />To reset your password, <a href="${process.env.ORIGIN}/reset-password?id=${updatedUser!._id}&token=${resetToken}">click here</a>.</p>`,
				)

				return res.status(200).json({
					message: `An email was just sent to ${updatedUser?.fullName} to reset their password!`,
				})
			})
			.catch(err => next(err))
	})
})

router.delete(PATHS.DELETE_USER(), async (req, res, next) => {
	const { id } = req.params

	return await UserModel.findById(id).then(async foundUser => {
		if (!foundUser) {
			return res.status(400).json({ message: "User not found" })
		}

		return await UserModel.findByIdAndDelete(id)
			.then(deletedUser => {
				sendMail(
					foundUser.email,
					`Your account on ${SITE_DATA.NAME} has been deleted`,
					`<p>Your account on ${SITE_DATA.NAME} has been deleted. If you think this is an error, please <a href="mailto:${process.env.EMAIL}">contact us</a>.</p>`,
				)

				return res.status(200).json({
					message: `User ${deletedUser?.fullName} has been deleted`,
				})
			})
			.catch(err => next(err))
	})
})

export default router
