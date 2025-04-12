#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { getLocalIp } from "./utils";
import { generateQrCode } from "./qr";

const program = new Command();

program
  .name("hostonphone")
  .description("Preview your localhost site on your phone via LAN or tunnel.")
  .version("1.0.0")
  .option("-p, --port <number>", "Port to expose (default: 3000)", "3000")
  .parse();

const options = program.opts();
const port = options.port;

(async () => {
  const ip = getLocalIp();
  if (!ip) {
    console.error(chalk.red("❌ No local network IP found."));
    process.exit(1);
  }

  const url = `http://${ip}:${port}`;
  console.log(chalk.green("📱 Scan this on your phone to preview:"));
  console.log(chalk.cyan(`🔗 ${url}\n`));

  generateQrCode(url);
})();