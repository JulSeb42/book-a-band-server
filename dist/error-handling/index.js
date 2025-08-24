"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const data_1 = require("data");
const errorHandler = (app) => {
    app.use((_, res) => {
        res.status(404).json({
            errorMessage: data_1.COMMON_TEXTS.ERRORS.ROUTE_NOT_EXIST,
        });
    });
    app.use((err, req, res) => {
        console.error("ERROR", req.method, req.path, err);
        if (!res.headersSent) {
            res.status(500).json({
                errorMessage: data_1.COMMON_TEXTS.ERRORS.SERVER_ERROR,
            });
        }
    });
};
exports.errorHandler = errorHandler;
