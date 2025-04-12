# 📱 HostOnPhone

Your localhost is now on your phone — effortlessly.

**HostOnPhone** is a simple CLI tool that lets developers preview their local development websites (like `localhost:3000`) directly on their **mobile phone**. No need for USB debugging, emulators, or clunky setups — just scan a QR code and see your site live on your phone, instantly.

---

## ✨ Features

- 🔍 Detects your machine’s local IP automatically
- 📱 Generates a QR code you can scan with your phone
- ⚠️ Warns you if the port isn't running anything
- 🌐 Optional remote tunneling for public or restricted Wi-Fi (coming soon!)
- 📦 Lightweight, zero config, runs instantly

---

## 📦 Installation

Once published, you’ll be able to install it globally via NPM:

```bash
npm install -g hostonphone
```

Or use it directly via `npx` (no install needed):

```bash
npx hostonphone --port 3000
```

> 📝 For now (before publishing), clone the repo and run it manually using the command below.

---

## 🚀 Usage

Make sure your local dev server is running (like `npm run dev` for Next.js) on the port you want (e.g. `3000`), then:

```bash
npm run start -- --port 3000
```

You’ll get output like:

```
📱 Scan this on your phone to preview:
🔗 http://192.168.1.42:3000
[QR CODE]
```

Open your phone’s camera or a QR app — and you’ll instantly see your site on your mobile browser over your local Wi-Fi.

---

## 🌩️ Optional: Use Cloudflare Tunnel (No Password Prompt)

By default, HostOnPhone uses [localtunnel](https://theboroer.github.io/localtunnel-www/) for public access — but this may require entering your public IP as a password when accessing the link from your phone.

To avoid this prompt, you can switch to **Cloudflare Tunnel**, which provides a clean and password-free experience.

### 🛠️ Step-by-step:

1. **Install `cloudflared`** (only once):

```bash
brew install cloudflare/cloudflare/cloudflared
```

> Or download manually from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation

2. **Use HostOnPhone with Cloudflare:**

```bash
npx hostonphone --tunnel --provider cloudflare
```

You’ll get a public URL like `https://your-site.trycloudflare.com` without any password screen.

> 💡 If `cloudflared` is not installed, the CLI will let you know and give you the install command.

---

## 💡 Why HostOnPhone?

Responsive web development often requires testing on real mobile devices — not just Chrome DevTools. But setting up a way to preview your localhost on your phone can be annoying. **HostOnPhone** eliminates that pain with one simple CLI command.

Whether you're building with:
- Next.js
- Vite
- React
- Vue
- Svelte
- ...or anything that runs on `localhost`

This tool helps you test on real hardware in seconds.

---

## 📚 Coming Soon

- `--tunnel` mode to allow remote preview from **any network** (powered by `localtunnel`)
- Automatic port detection if `--port` is omitted
- Clipboard copy support
- CLI banners and polish
- Optional mobile-friendly dashboard view

---

## 🧑‍💻 Dev Setup (For Contributors)

Clone the project:

```bash
git clone https://github.com/yourusername/hostonphone.git
cd hostonphone
npm install
```

Run the CLI locally:

```bash
npm run start -- --port 3000
```

---

## 📜 License

MIT © 2025 Adil Hussain

---

## ❤️ Built with care to make devs’ lives easier.
