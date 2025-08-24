"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("utils");
mongoose_1.default
    .connect(utils_1.MONGODB_URI)
    .then(x => {
    console.log(`📥 Connected to Mongo! Database name: "${x.connections[0].name}"`);
})
    .catch(err => {
    console.error("Error connecting to mongo: ", err);
});
