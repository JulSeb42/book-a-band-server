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
const models_1 = require("models");
const utils_2 = require("utils");
const data_1 = require("data");
const router = (0, express_1.Router)();
const { ADMIN: PATHS } = utils_2.SERVER_PATHS;
router.put(PATHS.EDIT_ROLE(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.body;
    yield models_1.UserModel.findByIdAndUpdate(id, { role }, { new: true })
        .then(updatedUser => res.status(201).json(updatedUser))
        .catch(err => next(err));
}));
router.post(PATHS.RESET_PASSWORD(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    return yield models_1.UserModel.findById(id).then((foundUser) => __awaiter(void 0, void 0, void 0, function* () {
        if (!foundUser) {
            return res.status(400).json({ message: "User not found." });
        }
        const resetToken = (0, utils_1.getRandomString)();
        return yield models_1.UserModel.findByIdAndUpdate(id, { resetToken }, { new: true })
            .then((updatedUser) => __awaiter(void 0, void 0, void 0, function* () {
            (0, utils_2.sendMail)(updatedUser.email, `Reset your password on ${data_1.SITE_DATA.NAME}`, `<p>Hello ${updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.fullName},<br /><br />To reset your password, <a href="${process.env.ORIGIN}/reset-password?id=${updatedUser._id}&token=${resetToken}">click here</a>.</p>`);
            return res.status(200).json({
                message: `An email was just sent to ${updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.fullName} to reset their password!`,
            });
        }))
            .catch(err => next(err));
    }));
}));
router.delete(PATHS.DELETE_USER(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    return yield models_1.UserModel.findById(id).then((foundUser) => __awaiter(void 0, void 0, void 0, function* () {
        if (!foundUser) {
            return res.status(400).json({ message: "User not found" });
        }
        return yield models_1.UserModel.findByIdAndDelete(id)
            .then(deletedUser => {
            (0, utils_2.sendMail)(foundUser.email, `Your account on ${data_1.SITE_DATA.NAME} has been deleted`, `<p>Your account on ${data_1.SITE_DATA.NAME} has been deleted. If you think this is an error, please <a href="mailto:${process.env.EMAIL}">contact us</a>.</p>`);
            return res.status(200).json({
                message: `User ${deletedUser === null || deletedUser === void 0 ? void 0 : deletedUser.fullName} has been deleted`,
            });
        })
            .catch(err => next(err));
    }));
}));
exports.default = router;
