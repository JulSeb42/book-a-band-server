"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const utils_1 = require("../utils");
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const admin_1 = __importDefault(require("./admin"));
const conversation_1 = __importDefault(require("./conversation"));
/* Prepend import new route - DO NOT REMOVE */
const router = (0, express_1.Router)();
router.get("/", (_, res) => {
    res.json("All good in here");
});
router.use(utils_1.SERVER_PATHS.AUTH.ROOT, auth_1.default);
router.use(utils_1.SERVER_PATHS.USERS.ROOT, user_1.default);
router.use(utils_1.SERVER_PATHS.ADMIN.ROOT, admin_1.default);
router.use(utils_1.SERVER_PATHS.CONVERSATION.ROOT, conversation_1.default);
/* Prepend router use - DO NOT REMOVE */
exports.default = router;
