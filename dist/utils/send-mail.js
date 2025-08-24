"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
require("dotenv/config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.WORD,
    },
});
const sendMail = (to, subject, html) => {
    const mailDetails = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        html: html,
    };
    transporter.sendMail(mailDetails, err => {
        if (err) {
            console.log(err);
            return err;
        }
        else {
            console.log("Email sent successfully.");
        }
    });
};
exports.sendMail = sendMail;
