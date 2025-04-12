#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { getLocalIp } from "./utils";
import { generateQrCode } from "./qr";
import { isPortAvailable } from "./checkPort";
import axios from "axios";
const localtunnel = require("localtunnel");

const program = new Command();

program
  .name("hostonphone")
  .description("Preview your localhost site on your phone via LAN or tunnel.")
  .version("1.0.0")
  .option("-p, --port <number>", "Port to expose (default: 3000)", "3000")
  .option("--tunnel", "Enable tunnel access over the internet")
  .parse();

const options = program.opts();
const port = options.port;

(async () => {
  const isAvailable = await isPortAvailable(Number(port));
  if (!isAvailable) {
    console.log(chalk.red(`⚠️ - Nothing is running on localhost:${port}`));
    console.log(chalk.yellow("Make sure your dev server is running, or specify a different port.\n"));
    process.exit(1);
  }

  let url = "";
  if (options.tunnel) {
    console.log(chalk.blue("🌐 Tunnel mode enabled. Creating tunnel..."));
    const tunnel = await localtunnel({ port: Number(port) });
    url = tunnel.url;
    try {
      const publicIp = (await axios.get("https://api.ipify.org?format=text")).data;
      console.log(chalk.yellow(`🔐 Tunnel Password (your public IP): ${publicIp}`));
    } catch (err) {
      console.log(chalk.red("⚠️ Failed to retrieve public IP for tunnel password."));
    }
    console.log(chalk.green("🌍 Publicly accessible URL created:"));
  } else {
    const ip = getLocalIp();
    if (!ip) {
      console.error(chalk.red("❌ - No local network IP found."));
      process.exit(1);
    }
    url = `http://${ip}:${port}`;
    console.log(chalk.green("📱 Scan this on your phone to preview:"));
  }

  console.log(chalk.cyan(`🔗 ${url}\n`));
  generateQrCode(url);
})();