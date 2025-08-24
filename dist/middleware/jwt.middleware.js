"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
require("dotenv/config");
const express_jwt_1 = require("express-jwt");
const getTokenFromHeaders = (req) => {
    if (req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer") {
        const token = req.headers.authorization.split(" ")[1];
        return token;
    }
    return undefined;
};
exports.isAuthenticated = (0, express_jwt_1.expressjwt)({
    secret: (_a = process.env.TOKEN_SECRET) !== null && _a !== void 0 ? _a : "",
    algorithms: ["HS256"],
    requestProperty: "payload",
    getToken: getTokenFromHeaders,
});
