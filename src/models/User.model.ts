import { Schema, model } from "mongoose"
import { userRoles, type User } from "types"

const userSchema = new Schema<User>(
	{
		email: { type: String, required: true, unique: true },
		fullName: { type: String, required: true },
		password: String,
		verified: Boolean,
		verifyToken: String,
		resetToken: String,
		avatar: String,
		role: { type: String, enum: Object.keys(userRoles), default: "user" },
		city: String,
		genre: String,
		bio: String,
		price: Number,
		available: Array,
		slug: { type: String, unique: true },
		youtubeUrl: String,
		facebookUrl: String,
		instagramUrl: String,
		youtubeLinks: Array,
		approved: Boolean,
	},
	{ timestamps: true },
)

export const UserModel = model<User>("User", userSchema)
