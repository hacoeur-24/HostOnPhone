#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import boxen from "boxen";
const localtunnel = require("localtunnel");
import { getLocalIp } from "./utils";
import { generateQrCode } from "./qr";
import { isPortAvailable } from "./checkPort";
import axios from "axios";
import { execSync, spawn } from "child_process";
import os from "os";
import ora from "ora";
import clipboard from "clipboardy";

const program = new Command();

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
      if (await isPortAvailable(Number(testPort))) {
        port = testPort;
        console.log(chalk.blue(`ℹ️  No port specified. Using detected active port: ${port}`));
        break;
      }
    }
    if (!port) {
      console.log(chalk.red("❌ No active port found on common defaults. Please start your dev server or specify a port."));
      process.exit(1);
    }
  }

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
            console.log(
              boxen(`🔗 ${url}`, {
                padding: 1,
                borderStyle: "round",
                borderColor: "cyan",
                align: "center",
              })
            );
            clipboard.writeSync(url);
            console.log(chalk.gray("📋 Link copied to clipboard!"));
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
            console.log(
              boxen(`🔗 ${url}`, {
                padding: 1,
                borderStyle: "round",
                borderColor: "cyan",
                align: "center",
              })
            );
            clipboard.writeSync(url);
            console.log(chalk.gray("📋 Link copied to clipboard!"));
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
        console.log(chalk.blue(`🔐 Tunnel Password (your public IP): ${publicIp}`));
      } catch {
        console.log(chalk.red("⚠️  Failed to retrieve public IP for tunnel password."));
      }

      console.log(chalk.green("🌍 Publicly accessible URL created (LocalTunnel):"));
      console.log(
        boxen(`🔗 ${url}`, {
          padding: 1,
          borderStyle: "round",
          borderColor: "cyan",
          align: "center",
        })
      );
      clipboard.writeSync(url);
      console.log(chalk.gray("📋 Link copied to clipboard!"));
      generateQrCode(url);
    }
  }

  if (!options.tunnel) {
    const ip = getLocalIp();
    if (!ip) {
      console.error(chalk.red("❌ No local network IP found."));
      process.exit(1);
    }

    url = `http://${ip}:${port}`;
    console.log(chalk.green("📱 Scan this on your phone to preview:"));
    console.log(
      boxen(`🔗 ${url}`, {
        padding: 1,
        borderStyle: "round",
        borderColor: "cyan",
        align: "center",
      })
    );
    clipboard.writeSync(url);
    console.log(chalk.gray("📋 Link copied to clipboard!"));
    generateQrCode(url);
  }
})();

if (os.userInfo().username && process.env.npm_config_user_agent) {
  console.log(chalk.magenta(
    "\n💡 Tip: To avoid entering a password every time, you can install Cloudflare Tunnel:\n" +
    "👉 npm install -g cloudflared\n" +
    "👉 Then run: hostonphone --tunnel --provider cloudflare"
  ));
}