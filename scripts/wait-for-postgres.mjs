import net from "node:net";

const url = new URL(process.env.DATABASE_URL ?? "postgresql://localhost:5432");
const host = url.hostname;
const port = Number(url.port || 5432);
const timeoutMs = 60_000;
const started = Date.now();

function tryConnect() {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port }, () => {
      socket.end();
      resolve(true);
    });
    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });
  });
}

while (Date.now() - started < timeoutMs) {
  if (await tryConnect()) {
    console.log(`PostgreSQL joignable sur ${host}:${port}`);
    process.exit(0);
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

console.error(`Impossible de joindre PostgreSQL sur ${host}:${port}`);
process.exit(1);
