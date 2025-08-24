"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const types_1 = require("types");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: String,
    verified: Boolean,
    verifyToken: String,
    resetToken: String,
    avatar: String,
    role: { type: String, enum: Object.keys(types_1.userRoles), default: "user" },
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
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
