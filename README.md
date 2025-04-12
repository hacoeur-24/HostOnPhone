# 📱 PhoneHost

Your localhost is now on your phone — effortlessly.

**PhoneHost** is a simple CLI tool that lets developers preview their local development websites (like `localhost:3000`) directly on their **mobile phone**. No need for USB debugging, emulators, or clunky setups — just scan a QR code and see your site live on your phone, instantly.

---

## 💡 Why PhoneHost?

Responsive web development often requires testing on real mobile devices — not just Chrome DevTools. But setting up a way to preview your localhost on your phone can be annoying. **PhoneHost** eliminates that pain with one simple CLI command.

Whether you're building with:
- Next.js
- Vite
- React
- Vue
- Svelte
- ...or anything that runs on `localhost`

This tool helps you test on real hardware in seconds.

---

## ✨ Features

- 🔍 Detects your machine’s local IP automatically
- 📱 Generates a QR code you can scan with your phone
- ⚠️ Warns you if the port isn't running anything
- 🌐 Remote tunneling for public or restricted Wi-Fi
- 📦 Lightweight, zero config, runs instantly

---

## 📦 Installation

Install it globally via NPM:

```bash
npm install -g phonehost
```

Or use it directly via `npx`:

```bash
npx phonehost --port 3000
```

---

## 🚀 Usage

Make sure your local dev server is running (like `npm run dev` for Next.js) on the port you want (e.g. `3000`), then:

```bash
phonehost --port 3000
```
or
```bash
phonehost -p 3000
```

> Note: If you don't specify the port it will search for an active port from theses : [3000, 5173, 8080, 4321, 4200].

You’ll get output like:

```
📱 Scan this on your phone to preview:
🔗 http://192.168.1.42:3000
[QR CODE]
```

Open your phone’s camera or a QR app — and you’ll instantly see your site on your mobile browser over your local Wi-Fi.

---
## 🌩️ How to use when your devices are not on the same network or while on public network

### 🔌 By default: PhoneHost uses LocalTunnel (No Extra Install Required)

If your phone is **not on the same Wi-Fi** or you're on **public or restricted networks**, you can use PhoneHost's built-in tunneling feature to create a public link using [localtunnel](https://theboroer.github.io/localtunnel-www/).

This option works out-of-the-box — **no additional installation required**.

#### 🛠️ To use it:

```bash
phonehost --port 3000 --tunnel
```
or
```bash
phonehost -p 3000 -t
```

You’ll get a public link like:

```
🔗 https://your-link.loca.lt
```

> ⚠️ Note: On some networks, `loca.lt` may ask for your **public IP as a password** to access the link. This is a security feature from the service. The Password will be displated in your Terminal.

### 🌩️ Optional: Use Cloudflare Tunnel (No Password Prompt)

By default, PhoneHost uses [localtunnel](https://theboroer.github.io/localtunnel-www/) for public access — but this may require entering your public IP as a password when accessing the link from your phone.

To avoid this prompt, you can switch to **Cloudflare Tunnel**, which provides a clean and password-free experience.

#### 🛠️ Step-by-step:

1. **Install `cloudflared`** (only once):

```bash
npm install -g cloudflared
```

> Or download manually from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation

2. **Use PhoneHost with Cloudflare:**

```bash
phonehost -p 3000 -t --provider cloudflare
```

You’ll get a public URL like `https://your-site.trycloudflare.com` without any password screen.

> 💡 If `cloudflared` is not installed, the CLI will let you know and give you the install command.

---

## 🧑‍💻 Dev Setup (For Contributors)

Clone the project:

```bash
git clone https://github.com/yourusername/phonehost.git
cd phonehost
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
