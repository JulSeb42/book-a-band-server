"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const error_handling_1 = require("./error-handling");
const utils_1 = require("./utils");
require("./db");
const app = (0, express_1.default)();
(0, config_1.default)(app);
app.use(utils_1.BASE_API_URL, routes_1.default);
(0, error_handling_1.errorHandler)(app);
exports.default = app;
