"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_API_URL = exports.SALT_ROUNDS = exports.jwtConfig = exports.ENCRYPT_SECRET = exports.TOKEN_SECRET = exports.ORIGIN = exports.PORT = exports.MONGODB_URI = void 0;
require("dotenv/config");
exports.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/book-a-band-full";
exports.PORT = process.env.PORT || 5005;
exports.ORIGIN = process.env.ORIGIN || "http://localhost:5173";
exports.TOKEN_SECRET = process.env.TOKEN_SECRET || "";
exports.ENCRYPT_SECRET = process.env.ENCRYPT_SECRET;
exports.jwtConfig = {
    algorithm: "HS256",
    expiresIn: "10d",
};
exports.SALT_ROUNDS = 10;
exports.BASE_API_URL = "/api";
