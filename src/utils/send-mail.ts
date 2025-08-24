import "dotenv/config"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
	service: "gmail",

	auth: {
		user: process.env.EMAIL,
		pass: process.env.WORD,
	},
})

export const sendMail = (to: string, subject: string, html: string) => {
	const mailDetails = {
		from: process.env.EMAIL,
		to: to,
		subject: subject,
		html: html,
	}

	transporter.sendMail(mailDetails, err => {
		if (err) {
			console.log(err)
			return err
		} else {
			console.log("Email sent successfully.")
		}
	})
}
