"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationModel = void 0;
const mongoose_1 = require("mongoose");
const conversationSchema = new mongoose_1.Schema({
    user1: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    user2: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    readUser1: Boolean,
    readUser2: Boolean,
    messages: [
        {
            body: String,
            sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
            date: String,
            time: String,
        },
    ],
}, { timestamps: true });
exports.ConversationModel = (0, mongoose_1.model)("Conversation", conversationSchema);
