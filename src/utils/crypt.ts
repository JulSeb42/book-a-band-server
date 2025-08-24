import crypto from "crypto"
import { ENCRYPT_SECRET } from "./consts"

const algorithm = "aes-256-cbc"
const secretKey = ENCRYPT_SECRET ?? "595a4cc5f93e152cb030b3711748bf72"

export const encrypt = (text: string) => {
	const iv = crypto.randomBytes(16)
	const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv)

	let encrypted = cipher.update(text, "utf8", "hex")
	encrypted += cipher.final("hex")

	return iv.toString("hex") + ":" + encrypted
}

export const decrypt = (text: string) => {
	const [ivHex, encrypted] = text.split(":")
	const iv = Buffer.from(ivHex, "hex")
	const decipher = crypto.createDecipheriv(
		algorithm,
		Buffer.from(secretKey),
		iv,
	)
	let decrypted = decipher.update(encrypted, "hex", "utf8")
	decrypted += decipher.final("utf8")
	return decrypted
}
