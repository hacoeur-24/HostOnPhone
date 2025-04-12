import qrcode from "qrcode-terminal";

export function generateQrCode(url: string) {
  qrcode.generate(url, { small: true });
}