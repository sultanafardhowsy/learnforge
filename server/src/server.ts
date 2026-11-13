import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

async function start() {
  await prisma.$connect();
  app.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
