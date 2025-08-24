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
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const utils_1 = require("@julseb-lib/utils");
const app_1 = __importDefault(require("./app"));
const utils_2 = require("./utils");
const models_1 = require("./models");
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, { cors: { origin: process.env.ORIGIN } });
io.on("connection", socket => {
    console.log(`A user connected: ${socket.id}`);
    socket.on("chat message", (msg) => __awaiter(void 0, void 0, void 0, function* () {
        const { body, sender, conversationId, receiver } = msg;
        const encryptedBody = (0, utils_2.encrypt)(body);
        io.emit("chat message", msg);
        if (conversationId) {
            return yield models_1.ConversationModel.findByIdAndUpdate(conversationId, {
                $push: {
                    messages: {
                        body: encryptedBody,
                        sender,
                        conversationId,
                        receiver,
                    },
                },
            }, { new: true });
        }
        return yield models_1.ConversationModel.create({
            user1: sender,
            user2: receiver,
            readUser1: true,
            readUser2: false,
            messages: [
                {
                    body: encryptedBody,
                    date: (0, utils_1.getToday)(),
                    time: (0, utils_1.getTimeNow)(),
                    sender,
                },
            ],
        });
    }));
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});
server.listen(utils_2.PORT, () => {
    console.log(`🚀 Server & Socket.io listening on port http://localhost:${utils_2.PORT}`);
});
