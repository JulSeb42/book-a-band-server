import "dotenv/config"
import { expressjwt as jwt, type Request } from "express-jwt"

const getTokenFromHeaders = (req: Request): string | undefined => {
	if (
		req.headers.authorization &&
		req.headers.authorization.split(" ")[0] === "Bearer"
	) {
		const token = req.headers.authorization.split(" ")[1]
		return token
	}

	return undefined
}

export const isAuthenticated = jwt({
	secret: process.env.TOKEN_SECRET ?? "",
	algorithms: ["HS256"],
	requestProperty: "payload",
	getToken: getTokenFromHeaders,
})
