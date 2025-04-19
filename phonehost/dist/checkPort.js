"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPortAvailable = isPortAvailable;
const http_1 = __importDefault(require("http"));
async function isPortAvailable(port) {
    const hosts = ["127.0.0.1", "localhost"];
    for (const host of hosts) {
        try {
            const success = await new Promise((resolve) => {
                const req = http_1.default.get({ hostname: host, port, timeout: 1000 }, (res) => {
                    res.resume();
                    resolve(true);
                });
                req.on("error", () => resolve(false));
                req.on("timeout", () => {
                    req.destroy();
                    resolve(false);
                });
            });
            if (success)
                return true;
        }
        catch { }
    }
    return false;
}
