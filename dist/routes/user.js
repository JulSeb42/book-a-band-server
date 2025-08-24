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
const utils_2 = require("../utils");
const data_1 = require("../data");
const router = (0, express_1.Router)();
const { USERS: PATHS } = utils_2.SERVER_PATHS;
router.get(PATHS.ALL_USERS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.UserModel.find()
        .then(usersFromDb => res.status(200).json(usersFromDb))
        .catch(err => next(err));
}));
router.get(PATHS.ALL_ARTISTS, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { approved } = req.query;
    return yield models_1.UserModel.find({ role: "artist" })
        .then(found => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filteredArtists = found.map(artist => {
            var _a, _b;
            return (Object.assign(Object.assign({}, ((_b = (_a = artist.toObject) === null || _a === void 0 ? void 0 : _a.call(artist)) !== null && _b !== void 0 ? _b : artist)), { available: Array.isArray(artist.available)
                    ? artist.available
                        .filter(dateStr => {
                        const date = new Date(dateStr);
                        date.setHours(0, 0, 0, 0);
                        return date >= today;
                    })
                        .sort((a, b) => new Date(a) < new Date(b) ? -1 : 0)
                    : [] }));
        });
        if (approved === "true") {
            const approvedArtists = filteredArtists.filter(artist => artist.approved === true);
            return res.status(200).json(approvedArtists);
        }
        return res.status(200).json(filteredArtists);
    })
        .catch(err => next(err));
}));
router.get(PATHS.GET_ALL_CITIES, (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.UserModel.find({ role: "artist" })
        .then(found => {
        const cities = found
            .map(user => user.city)
            .filter(city => city !== null || city !== undefined);
        return res.status(200).json((0, utils_1.deleteDuplicates)(cities));
    })
        .catch(err => next(err));
}));
router.get(PATHS.GET_ALL_GENRES, (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.UserModel.find({ role: "artist" })
        .then(found => {
        const genres = found
            .map(user => user.genre)
            .filter(genre => genre !== null || genre !== undefined);
        return res.status(200).json((0, utils_1.deleteDuplicates)(genres));
    })
        .catch(err => next(err));
}));
router.get(PATHS.GET_USER(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.UserModel.findById(req.params.id)
        .populate({
        path: "conversations",
        populate: [
            { path: "user1", model: "User" },
            { path: "user2", model: "User" },
            {
                path: "messages",
                model: "Message",
                populate: [
                    { path: "sender", model: "User" },
                    { path: "conversation", model: "Conversation" },
                ],
            },
        ],
    })
        .populate("conversations")
        .then(userFromDb => {
        console.log(userFromDb);
        return res.status(200).json(userFromDb);
    })
        .catch(err => {
        next(err);
        return res.status(400).json({
            message: data_1.COMMON_TEXTS.ERRORS.USER_NOT_EXIST,
        });
    });
}));
router.get(PATHS.ARTIST_BY_SLUG(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.UserModel.findOne({ slug: req.params.slug })
        .then(found => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const filteredArtist = Object.assign(Object.assign({}, found._doc), { available: found === null || found === void 0 ? void 0 : found.available.filter(date => new Date(date) >= new Date()).sort((a, b) => (new Date(a) < new Date(b) ? -1 : 0)) });
        return res.status(200).json(filteredArtist);
    })
        .catch(err => next(err));
}));
router.get(PATHS.GET_PRICES, (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.UserModel.find({ role: "artist" })
        .then(found => {
        const prices = found
            .map(user => user.price)
            .sort((a, b) => (a < b ? -1 : 0));
        return res.status(200).json(prices);
    })
        .catch(err => next(err));
}));
router.put(PATHS.EDIT_ACCOUNT(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName } = req.body;
    if (!fullName) {
        return res
            .status(400)
            .json({ message: data_1.COMMON_TEXTS.ERRORS.FULL_NAME_EMPTY });
    }
    return yield models_1.UserModel.findByIdAndUpdate(req.params.id, Object.assign({}, req.body), { new: true })
        .then(updatedUser => {
        const payload = { user: updatedUser };
        const authToken = jsonwebtoken_1.default.sign(payload, utils_2.TOKEN_SECRET, utils_2.jwtConfig);
        return res.status(201).json({
            user: updatedUser,
            authToken: authToken,
        });
    })
        .catch(err => next(err));
}));
router.put(PATHS.EDIT_PASSWORD(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { oldPassword, newPassword } = req.body;
    if (!utils_1.passwordRegex.test(newPassword)) {
        return res.status(400).json({
            message: data_1.COMMON_TEXTS.ERRORS.PASSWORD_NOT_VALID,
        });
    }
    return yield models_1.UserModel.findById(req.params.id)
        .then((foundUser) => __awaiter(void 0, void 0, void 0, function* () {
        if (!foundUser) {
            return res
                .status(400)
                .json({ message: data_1.COMMON_TEXTS.ERRORS.USER_NOT_EXIST });
        }
        if (!(yield bcryptjs_1.default.compare(oldPassword, foundUser === null || foundUser === void 0 ? void 0 : foundUser.password))) {
            return res
                .status(400)
                .json({ message: data_1.COMMON_TEXTS.ERRORS.OLD_PASSWORD_WRONG });
        }
        const salt = bcryptjs_1.default.genSaltSync(utils_2.SALT_ROUNDS);
        const hashedPassword = bcryptjs_1.default.hashSync(newPassword, salt);
        return yield models_1.UserModel.findByIdAndUpdate(req.params.id, { password: hashedPassword }, { new: true }).then(updatedUser => {
            const payload = { user: updatedUser };
            const authToken = jsonwebtoken_1.default.sign(payload, utils_2.TOKEN_SECRET, utils_2.jwtConfig);
            return res.status(201).json({ user: updatedUser, authToken });
        });
    }))
        .catch(err => next(err));
}));
router.delete(PATHS.DELETE_ACCOUNT(), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return yield models_1.UserModel.findByIdAndDelete(req.params.id)
        .then(() => res.status(200).json({ message: data_1.COMMON_TEXTS.USER_DELETED }))
        .catch(err => next(err));
}));
exports.default = router;
