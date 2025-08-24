import "dotenv/config"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import { faker } from "@faker-js/faker"
import {
	getRandomString,
	getRandomAvatar,
	convertToEmail,
	generateNumbers,
	getRandom,
} from "@julseb-lib/utils"
import { UserModel } from "../src/models/User.model"
import type { User } from "../src/types"

// Hash password
const password = "Password42"
const salt = bcrypt.genSaltSync()
const hash = bcrypt.hashSync(password, salt)

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI ?? "")

const realUsers: Partial<User>[] = [
	{
		fullName: "Julien Sebag",
		email: "julien@admin.com",
		password: hash,
		verified: true,
		verifyToken: getRandomString(20),
		role: "admin",
	},
	{
		fullName: "Julien Sebag",
		email: "julien@user.com",
		password: hash,
		verified: true,
		verifyToken: getRandomString(20),
		role: "user",
	},
]

const fakeUsers: Array<Partial<User>> = generateNumbers(0, 97).map(() => {
	const genders = getRandom(["male", "female"])
	const fullName = faker.person
		.fullName(genders as any)
		.replaceAll("PhD", "")
		.replaceAll("DVM", "")
		.replaceAll("DDS", "")
		.replaceAll("Mr. ", "")
		.replaceAll("MD", "")
		.replaceAll("Jr.", "")

	return {
		fullName,
		email: convertToEmail(fullName),
		password: hash,
		verified: true,
		verifyToken: getRandomString(20),
		avatar: getRandomAvatar(genders as any),
		role: "user",
	}
})

UserModel.insertMany([...realUsers, ...fakeUsers])
	.then(users => {
		console.log(
			`Success, you added ${users.length} user${
				users.length > 1 ? "s" : ""
			} to the db`,
		)
		mongoose.connection.close()
	})
	.catch(err => console.log(err))

// Run `pnpm tsx seed/seed.ts` from root folder
// or `pnpm seed-users`
