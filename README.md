# 📱 HostOnPhone

Your localhost is now on your phone — effortlessly.

**HostOnPhone** is a simple CLI tool that lets developers preview their local development websites (like `localhost:3000`) directly on their **mobile phone**. No need for USB debugging, emulators, or clunky setups — just scan a QR code and see your site live on your phone, instantly.

---

## ✨ Features

- 🔍 Detects your machine’s local IP automatically
- 📱 Generates a QR code you can scan with your phone
- ⚠️ Warns you if the port isn't running anything
- 🌐 Remote tunneling for public or restricted Wi-Fi
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
