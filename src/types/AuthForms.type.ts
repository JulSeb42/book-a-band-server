import type { User } from "./User.type"

export type SignupFormData = Pick<User, "fullName" | "email" | "password">

export type LoginFormData = Pick<User, "email" | "password">

export type LoggedInFormData = { headers: { Authorization: string } }

export type ResetPasswordFormData = Pick<
	User,
	"_id" | "password" | "resetToken"
>

export type EditPasswordFormData = {
	oldPassword: string
	newPassword: string
}

export type EditAccountFormData = Pick<User, "fullName">

export type ForgotPasswordFormData = Pick<User, "email">
