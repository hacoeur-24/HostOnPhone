import http from "http";

export function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get({ hostname: "127.0.0.1", port, timeout: 1000 }, (res) => {
      res.resume(); // consume response data
      resolve(true); // success!
    });

    req.on("error", () => {
      resolve(false);
    });

    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}