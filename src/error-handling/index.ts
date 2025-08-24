import type { Express, Response, Request, ErrorRequestHandler } from "express"
import { COMMON_TEXTS } from "data"

export const errorHandler = (app: Express) => {
	app.use((_: Request, res: Response) => {
		res.status(404).json({
			errorMessage: COMMON_TEXTS.ERRORS.ROUTE_NOT_EXIST,
		})
	})

	app.use((err: ErrorRequestHandler, req: Request, res: Response) => {
		console.error("ERROR", req.method, req.path, err)

		if (!res.headersSent) {
			res.status(500).json({
				errorMessage: COMMON_TEXTS.ERRORS.SERVER_ERROR,
			})
		}
	})
}
