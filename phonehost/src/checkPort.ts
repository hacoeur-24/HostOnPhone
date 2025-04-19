import http from "http";

export async function isPortAvailable(port: number): Promise<boolean> {
  const hosts = ["127.0.0.1", "localhost"];

  for (const host of hosts) {
    try {
      const success = await new Promise<boolean>((resolve) => {
        const req = http.get({ hostname: host, port, timeout: 1000 }, (res) => {
          res.resume();
          resolve(true);
        });
        req.on("error", () => resolve(false));
        req.on("timeout", () => {
          req.destroy();
          resolve(false);
        });
      });
      if (success) return true;
    } catch { }
  }

  return false;
}