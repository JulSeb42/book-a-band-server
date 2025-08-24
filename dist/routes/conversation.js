"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils_1 = require("@julseb-lib/utils");
const models_1 = require("../models");
const utils_2 = require("../utils");
const router = (0, express_1.Router)();
const { CONVERSATION: PATHS } = utils_2.SERVER_PATHS;
router.get(PATHS.ALL_CONVERSATIONS, (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.ConversationModel.find()
        .populate("user1")
        .populate("user2")
        .populate({
        path: "messages",
        populate: {
            path: "sender",
            model: "User",
        },
    })
        .then(found => res.status(200).json(found))
        .catch(err => next(err));
}));
router.get(PATHS.GET_CONVERSATION(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.ConversationModel.findById(req.params.id)
        .populate("user1")
        .populate("user2")
        .populate({
        path: "messages",
        populate: {
            path: "sender",
            model: "User",
        },
    })
        .then(conversationFromDb => {
        conversationFromDb === null || conversationFromDb === void 0 ? void 0 : conversationFromDb.messages.forEach(msg => (msg.body = (0, utils_2.decrypt)(msg.body)));
        return res.status(200).json(conversationFromDb);
    })
        .catch(err => next(err));
}));
router.get(PATHS.GET_USER_CONVERSATIONS(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.ConversationModel.find({
        $or: [{ user1: req.params.id }, { user2: req.params.id }],
    })
        .populate("user1")
        .populate("user2")
        .populate("messages")
        .populate({
        path: "messages",
        populate: {
            path: "sender",
            model: "User",
        },
    })
        .then(foundConversations => {
        foundConversations.forEach(conversation => conversation.messages.forEach(msg => (msg.body = (0, utils_2.decrypt)(msg.body))));
        return res.status(200).json(foundConversations);
    })
        .catch(err => next(err));
}));
router.post(PATHS.NEW_CONVERSATION, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user1, user2, body } = req.body;
    return yield models_1.ConversationModel.create({
        user1,
        user2,
        readUser1: true,
        readUser2: false,
        messages: [
            {
                body: (0, utils_2.encrypt)(body),
                date: (0, utils_1.getToday)(),
                time: (0, utils_1.getTimeNow)(),
                sender: user1,
            },
        ],
    })
        .then((createdConversation) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(200).json(createdConversation);
    }))
        .catch(err => next(err));
}));
router.put(PATHS.READ_CONVERSATION(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { readUser1, readUser2 } = req.body;
    return yield models_1.ConversationModel.findByIdAndUpdate(req.params.id, { readUser1, readUser2 }, { new: true })
        .then(updatedConversation => res.status(200).json(updatedConversation))
        .catch(err => next(err));
}));
router.put(PATHS.UNREAD_CONVERSATION(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentUser, conversation } = req.body;
    if (conversation.user1._id === currentUser) {
        return yield models_1.ConversationModel.findByIdAndUpdate(req.params.id, { readUser2: false }, { new: true })
            .then(updatedConversation => res.status(200).json(updatedConversation))
            .catch(err => next(err));
    }
    if (conversation.user2._id === currentUser) {
        return yield models_1.ConversationModel.findByIdAndUpdate(req.params.id, { readUser1: false }, { new: true })
            .then(updatedConversation => res.status(200).json(updatedConversation))
            .catch(err => next(err));
    }
}));
router.delete(PATHS.DELETE_CONVERSATION(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.ConversationModel.findByIdAndDelete(req.params.id)
        .then(() => res
        .status(200)
        .json({ message: "The conversation has been deleted." }))
        .catch(err => next(err));
}));
exports.default = router;
