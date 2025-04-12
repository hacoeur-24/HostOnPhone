"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQrCode = generateQrCode;
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
function generateQrCode(url) {
    qrcode_terminal_1.default.generate(url, { small: true });
}
