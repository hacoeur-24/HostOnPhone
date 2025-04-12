"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPortAvailable = isPortAvailable;
const http_1 = __importDefault(require("http"));
function isPortAvailable(port) {
    return new Promise((resolve) => {
        const req = http_1.default.get({ hostname: "127.0.0.1", port, timeout: 1000 }, (res) => {
            res.resume(); // consume response data
            resolve(true); // success!
        });
        req.on("error", () => {
            resolve(false);
        });
        req.on("timeout", () => {
            req.destroy();
            resolve(false);
        });
    });
}
