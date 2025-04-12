#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
const localtunnel = require("localtunnel");
import { getLocalIp } from "./utils";
import { generateQrCode } from "./qr";
import { isPortAvailable } from "./checkPort";
import axios from "axios";
import { execSync, spawn } from "child_process";
import os from "os";
import ora from "ora";

const program = new Command();

program
  .name("hostonphone")
  .description("Preview your localhost site on your phone via LAN or tunnel.")
  .version("1.0")
  .option("-p, --port <number>", "Port to expose (default: 3000)", "3000")
  .option("-t, --tunnel", "Enable tunnel access over the internet")
  .option("--provider <type>", "Tunnel provider: localtunnel (default) or cloudflare")
  .parse();

const options = program.opts();
const port = options.port;

(async () => {
  const isAvailable = await isPortAvailable(Number(port));
  if (!isAvailable) {
    console.log(chalk.red(`⚠️  Nothing is running on localhost:${port}`));
    console.log(chalk.yellow("Make sure your dev server is running, or specify a different port.\n"));
    process.exit(1);
  }

  let url = "";
  if (options.tunnel) {
    const provider = options.provider || "localtunnel";

    if (provider === "cloudflare") {
      try {
        execSync("which cloudflared", { stdio: "ignore" });

        console.log(chalk.blue("🌐 Tunnel mode enabled. Using Cloudflare Tunnel..."));
        const spinner = ora("Creating Cloudflare Tunnel...").start();
        let urlFound = false;

        const tunnel = spawn("cloudflared", ["tunnel", "--url", `http://localhost:${port}`]);

        tunnel.stderr?.on("data", (data) => {
          const line = data.toString();
          let match = line.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
          if (!match) {
            const fallback = line.match(/https:\/\/[^\s|]+\.trycloudflare\.com/);
            if (fallback) match = fallback;
          }
          if (match && !urlFound) {
            url = match[0].trim();
            urlFound = true;
            spinner.succeed("Cloudflare Tunnel created!");
            console.log(chalk.green("🌍 Publicly accessible URL created (Cloudflare):"));
            console.log(chalk.cyan(`🔗 ${url}\n`));
            generateQrCode(url);
          }

          if (line.toLowerCase().includes("error") || line.toLowerCase().includes("fail")) {
            spinner.fail("Cloudflare tunnel failed to start.");
            console.error(chalk.red(`❌ Cloudflare: ${line}`));
          }
        });

        tunnel.stdout?.on("data", (data) => {
          console.log(chalk.gray(`[cloudflared] ${data.toString().trim()}`)); // debug log
          let match = data.toString().match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
          if (!match) {
            const fallback = data.toString().match(/https:\/\/[^\s|]+\.trycloudflare\.com/);
            if (fallback) match = fallback;
          }
          if (match && !urlFound) {
            url = match[0].trim();
            urlFound = true;
            spinner.succeed("Cloudflare Tunnel created!");
            console.log(chalk.green("🌍 Publicly accessible URL created (Cloudflare):"));
            console.log(chalk.cyan(`🔗 ${url}\n`));
            generateQrCode(url);
          }
        });

        // Timeout if tunnel is too slow or fails silently
        setTimeout(() => {
          if (!urlFound) {
            spinner.fail("Cloudflare Tunnel timed out. No public URL detected.");
            console.log(chalk.yellow("ℹ️ This might be due to network issues or Cloudflare being slow."));
            process.exit(1);
          }
        }, 15000);

      } catch {
        console.log(chalk.red("❌ Cloudflared is not installed."));
        console.log(chalk.yellow("To install it, run: npm install -g cloudflared"));
        process.exit(1);
      }

      return;
    } else {
      console.log(chalk.blue("🌐 Tunnel mode enabled. Using LocalTunnel..."));
      const tunnel = await localtunnel({ port: Number(port) });
      url = tunnel.url;

      try {
        const publicIp = (await axios.get("https://api.ipify.org?format=text")).data;
        console.log(chalk.yellow(`🔐 Tunnel Password (your public IP): ${publicIp}`));
      } catch {
        console.log(chalk.red("⚠️  Failed to retrieve public IP for tunnel password."));
      }

      console.log(chalk.green("🌍 Publicly accessible URL created (LocalTunnel):"));
    }
  }

  console.log(chalk.cyan(`🔗 ${url}\n`));
  generateQrCode(url);
})();

if (os.userInfo().username && process.env.npm_config_user_agent) {
  console.log(chalk.magentaBright(
    "\n💡 Tip: To avoid entering a password every time, you can install Cloudflare Tunnel:\n" +
    "👉 npm install -g cloudflared\n" +
    "👉 Then run: hostonphone --tunnel --provider cloudflare"
  ));
}