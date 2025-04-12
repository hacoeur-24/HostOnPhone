#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const boxen_1 = __importDefault(require("boxen"));
const localtunnel = require("localtunnel");
const utils_1 = require("./utils");
const qr_1 = require("./qr");
const checkPort_1 = require("./checkPort");
const axios_1 = __importDefault(require("axios"));
const child_process_1 = require("child_process");
const os_1 = __importDefault(require("os"));
const ora_1 = __importDefault(require("ora"));
const clipboardy_1 = __importDefault(require("clipboardy"));
const program = new commander_1.Command();
program
    .name("hostonphone")
    .description("Preview your localhost site on your phone via LAN or tunnel.")
    .version("1.0")
    .option("-p, --port <number>", "Port to expose")
    .option("-t, --tunnel", "Enable tunnel access over the internet")
    .option("--provider <type>", "Tunnel provider: localtunnel (default) or cloudflare")
    .parse();
const options = program.opts();
let port = options.port;
(async () => {
    if (!port) {
        const commonPorts = [3000, 5173, 8080, 4321, 4200];
        for (const testPort of commonPorts) {
            if (await (0, checkPort_1.isPortAvailable)(Number(testPort))) {
                port = testPort;
                console.log(chalk_1.default.blue(`ℹ️  No port specified. Using detected active port: ${port}`));
                break;
            }
        }
        if (!port) {
            console.log(chalk_1.default.red("❌ No active port found on common defaults. Please start your dev server or specify a port."));
            process.exit(1);
        }
    }
    const isAvailable = await (0, checkPort_1.isPortAvailable)(Number(port));
    if (!isAvailable) {
        console.log(chalk_1.default.red(`⚠️  Nothing is running on localhost:${port}`));
        console.log(chalk_1.default.yellow("Make sure your dev server is running, or specify a different port.\n"));
        process.exit(1);
    }
    let url = "";
    if (options.tunnel) {
        const provider = options.provider || "localtunnel";
        if (provider === "cloudflare") {
            try {
                (0, child_process_1.execSync)("which cloudflared", { stdio: "ignore" });
                console.log(chalk_1.default.blue("🌐 Tunnel mode enabled. Using Cloudflare Tunnel..."));
                const spinner = (0, ora_1.default)("Creating Cloudflare Tunnel...").start();
                let urlFound = false;
                const tunnel = (0, child_process_1.spawn)("cloudflared", ["tunnel", "--url", `http://localhost:${port}`]);
                tunnel.stderr?.on("data", (data) => {
                    const line = data.toString();
                    let match = line.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
                    if (!match) {
                        const fallback = line.match(/https:\/\/[^\s|]+\.trycloudflare\.com/);
                        if (fallback)
                            match = fallback;
                    }
                    if (match && !urlFound) {
                        url = match[0].trim();
                        urlFound = true;
                        spinner.succeed("Cloudflare Tunnel created!");
                        console.log(chalk_1.default.green("🌍 Publicly accessible URL created (Cloudflare):"));
                        console.log((0, boxen_1.default)(`🔗 ${url}`, {
                            padding: 1,
                            borderStyle: "round",
                            borderColor: "cyan",
                            align: "center",
                        }));
                        clipboardy_1.default.writeSync(url);
                        console.log(chalk_1.default.gray("📋 Link copied to clipboard!"));
                        (0, qr_1.generateQrCode)(url);
                    }
                    if (line.toLowerCase().includes("error") || line.toLowerCase().includes("fail")) {
                        spinner.fail("Cloudflare tunnel failed to start.");
                        console.error(chalk_1.default.red(`❌ Cloudflare: ${line}`));
                    }
                });
                tunnel.stdout?.on("data", (data) => {
                    console.log(chalk_1.default.gray(`[cloudflared] ${data.toString().trim()}`)); // debug log
                    let match = data.toString().match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
                    if (!match) {
                        const fallback = data.toString().match(/https:\/\/[^\s|]+\.trycloudflare\.com/);
                        if (fallback)
                            match = fallback;
                    }
                    if (match && !urlFound) {
                        url = match[0].trim();
                        urlFound = true;
                        spinner.succeed("Cloudflare Tunnel created!");
                        console.log(chalk_1.default.green("🌍 Publicly accessible URL created (Cloudflare):"));
                        console.log((0, boxen_1.default)(`🔗 ${url}`, {
                            padding: 1,
                            borderStyle: "round",
                            borderColor: "cyan",
                            align: "center",
                        }));
                        clipboardy_1.default.writeSync(url);
                        console.log(chalk_1.default.gray("📋 Link copied to clipboard!"));
                        (0, qr_1.generateQrCode)(url);
                    }
                });
                // Timeout if tunnel is too slow or fails silently
                setTimeout(() => {
                    if (!urlFound) {
                        spinner.fail("Cloudflare Tunnel timed out. No public URL detected.");
                        console.log(chalk_1.default.yellow("ℹ️ This might be due to network issues or Cloudflare being slow."));
                        process.exit(1);
                    }
                }, 15000);
            }
            catch {
                console.log(chalk_1.default.red("❌ Cloudflared is not installed."));
                console.log(chalk_1.default.yellow("To install it, run: npm install -g cloudflared"));
                process.exit(1);
            }
            return;
        }
        else {
            console.log(chalk_1.default.blue("🌐 Tunnel mode enabled. Using LocalTunnel..."));
            const tunnel = await localtunnel({ port: Number(port) });
            url = tunnel.url;
            try {
                const publicIp = (await axios_1.default.get("https://api.ipify.org?format=text")).data;
                console.log(chalk_1.default.blue(`🔐 Tunnel Password (your public IP): ${publicIp}`));
            }
            catch {
                console.log(chalk_1.default.red("⚠️  Failed to retrieve public IP for tunnel password."));
            }
            console.log(chalk_1.default.green("🌍 Publicly accessible URL created (LocalTunnel):"));
            console.log((0, boxen_1.default)(`🔗 ${url}`, {
                padding: 1,
                borderStyle: "round",
                borderColor: "cyan",
                align: "center",
            }));
            clipboardy_1.default.writeSync(url);
            console.log(chalk_1.default.gray("📋 Link copied to clipboard!"));
            (0, qr_1.generateQrCode)(url);
        }
    }
    if (!options.tunnel) {
        const ip = (0, utils_1.getLocalIp)();
        if (!ip) {
            console.error(chalk_1.default.red("❌ No local network IP found."));
            process.exit(1);
        }
        url = `http://${ip}:${port}`;
        console.log(chalk_1.default.green("📱 Scan this on your phone to preview:"));
        console.log((0, boxen_1.default)(`🔗 ${url}`, {
            padding: 1,
            borderStyle: "round",
            borderColor: "cyan",
            align: "center",
        }));
        clipboardy_1.default.writeSync(url);
        console.log(chalk_1.default.gray("📋 Link copied to clipboard!"));
        (0, qr_1.generateQrCode)(url);
    }
})();
if (os_1.default.userInfo().username && process.env.npm_config_user_agent) {
    console.log(chalk_1.default.magenta("\n💡 Tip: To avoid entering a password every time, you can install Cloudflare Tunnel:\n" +
        "👉 npm install -g cloudflared\n" +
        "👉 Then run: hostonphone --tunnel --provider cloudflare"));
}
