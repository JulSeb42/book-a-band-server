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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("@julseb-lib/utils");
const models_1 = require("../models");
const middleware_1 = require("../middleware");
const utils_2 = require("../utils");
const data_1 = require("../data");
const router = (0, express_1.Router)();
const { AUTH: PATHS } = utils_2.SERVER_PATHS;
router.post(PATHS.SIGNUP, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullName, password } = req.body;
    const verifyToken = (0, utils_1.getRandomString)(20);
    if (!fullName || !utils_1.emailRegex.test(email) || !utils_1.passwordRegex.test(password)) {
        if (!fullName)
            res.status(400).json({
                message: data_1.COMMON_TEXTS.ERRORS.FULL_NAME_EMPTY,
            });
        if (!utils_1.emailRegex.test(email))
            res.status(400).json({
                message: data_1.COMMON_TEXTS.ERRORS.EMAIL_NOT_VALID,
            });
        if (!utils_1.passwordRegex.test(password))
            res.status(400).json({
                message: data_1.COMMON_TEXTS.ERRORS.PASSWORD_NOT_VALID,
            });
        return;
    }
    return yield models_1.UserModel.findOne({ email })
        .then((foundUser) => __awaiter(void 0, void 0, void 0, function* () {
        if (foundUser) {
            return res
                .status(400)
                .json({ message: data_1.COMMON_TEXTS.ERRORS.EMAIL_TAKEN });
        }
        const salt = bcryptjs_1.default.genSaltSync(utils_2.SALT_ROUNDS);
        const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
        return yield models_1.UserModel.create(Object.assign(Object.assign({}, req.body), { password: hashedPassword, verified: false, verifyToken, avatar: (0, utils_1.getRandomAvatar)() })).then(createdUser => {
            (0, utils_2.sendMail)(email, data_1.COMMON_TEXTS.EMAIL_SIGNUP_TITLE, data_1.COMMON_TEXTS.EMAIL_SIGNUP_BODY(createdUser, verifyToken));
            const payload = { user: createdUser };
            const authToken = jsonwebtoken_1.default.sign(payload, utils_2.TOKEN_SECRET, utils_2.jwtConfig);
            return res.status(201).json({ user: createdUser, authToken });
        });
    }))
        .catch(err => next(err));
}));
router.post(PATHS.LOGIN, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log(req.body);
    if (email === "" || password === "") {
        return res
            .status(400)
            .json({ message: data_1.COMMON_TEXTS.ERRORS.PROVIDE_EMAIL_AND_PASSWORD });
    }
    return yield models_1.UserModel.findOne({ email })
        .then(foundUser => {
        if (!foundUser) {
            return res
                .status(401)
                .json({ message: data_1.COMMON_TEXTS.ERRORS.USER_NOT_EXIST });
        }
        const passwordCorrect = bcryptjs_1.default.compareSync(password, foundUser.password);
        if (!passwordCorrect) {
            return res.status(401).json({
                message: data_1.COMMON_TEXTS.ERRORS.AUTH_NOT_POSSIBLE,
            });
        }
        const payload = { user: foundUser };
        const authToken = jsonwebtoken_1.default.sign(payload, utils_2.TOKEN_SECRET, utils_2.jwtConfig);
        return res.status(200).json({ authToken: authToken });
    })
        .catch(err => next(err));
}));
router.get(PATHS.LOGGED_IN, middleware_1.isAuthenticated, (req, res) => {
    const payload = req.payload;
    console.log(`req.payload: ${payload}`);
    return res.status(200).json(payload);
});
router.put(PATHS.VERIFY, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, token } = req.body;
    yield models_1.UserModel.findById(id).then((foundUser) => __awaiter(void 0, void 0, void 0, function* () {
        if (!foundUser) {
            return res
                .status(400)
                .json({ message: data_1.COMMON_TEXTS.ERRORS.USER_NOT_EXIST });
        }
        if (foundUser.verifyToken !== token) {
            return res
                .status(400)
                .json({ message: data_1.COMMON_TEXTS.ERRORS.VERIFY_TOKEN_NOT_MATCH });
        }
        return yield models_1.UserModel.findByIdAndUpdate(id, { verified: true }, { new: true })
            .then(updatedUser => {
            const payload = { user: updatedUser };
            const authToken = jsonwebtoken_1.default.sign(payload, utils_2.TOKEN_SECRET, utils_2.jwtConfig);
            return res.status(200).json({
                user: updatedUser,
                authToken,
            });
        })
            .catch(err => next(err));
    }));
}));
router.post(PATHS.FORGOT_PASSWORD, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const resetToken = (0, utils_1.getRandomString)(20);
    if (!utils_1.emailRegex.test(email)) {
        return res
            .status(400)
            .json({ message: data_1.COMMON_TEXTS.ERRORS.EMAIL_NOT_VALID });
    }
    return yield models_1.UserModel.findOne({ email })
        .then((foundUser) => __awaiter(void 0, void 0, void 0, function* () {
        if (!foundUser) {
            return res
                .status(400)
                .json({ message: data_1.COMMON_TEXTS.ERRORS.USER_NOT_EXIST });
        }
        return yield models_1.UserModel.findOneAndUpdate({ email }, { resetToken }, { new: true }).then(foundUser => {
            console.log("Start send mail");
            (0, utils_2.sendMail)(email, data_1.COMMON_TEXTS.EMAIL_RESET_PASSWORD_TITLE, data_1.COMMON_TEXTS.EMAIL_RESET_PASSWORD_BODY(foundUser, resetToken));
            return res.status(200).json({
                message: "Message has been sent successfully!",
            });
        });
    }))
        .catch(err => next(err));
}));
router.put(PATHS.RESET_PASSWORD, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, resetToken, id } = req.body;
    if (!utils_1.passwordRegex.test(password)) {
        return res
            .status(400)
            .json({ message: data_1.COMMON_TEXTS.ERRORS.EMAIL_NOT_VALID });
    }
    return yield models_1.UserModel.findById(id)
        .then((foundUser) => __awaiter(void 0, void 0, void 0, function* () {
        if (!foundUser) {
            return res
                .status(400)
                .json({ message: data_1.COMMON_TEXTS.ERRORS.USER_NOT_EXIST });
        }
        if (foundUser.resetToken !== resetToken) {
            return res.status(400).json({
                message: data_1.COMMON_TEXTS.ERRORS.PROBLEM_RESET_PASSWORD,
            });
        }
        const salt = bcryptjs_1.default.genSaltSync(utils_2.SALT_ROUNDS);
        const hashedPassword = bcryptjs_1.default.hashSync(password, salt);
        return yield models_1.UserModel.findByIdAndUpdate(id, { password: hashedPassword, resetToken: "" }, { new: true }).then(updatedUser => {
            return res.status(200).json({ user: updatedUser });
        });
    }))
        .catch(err => next(err));
}));
exports.default = router;
