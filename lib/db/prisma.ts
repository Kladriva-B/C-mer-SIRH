import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const SCHEMA_REV = "camer-sirh-prisma-4";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaRev?: string;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL n'est pas défini.");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

function isUsable(client: PrismaClient | undefined) {
  return Boolean(
    client &&
      globalForPrisma.prismaRev === SCHEMA_REV &&
      typeof (client as unknown as { leaveRequest?: { count?: unknown } }).leaveRequest?.count === "function" &&
      typeof (client as unknown as { evaluation?: { findMany?: unknown } }).evaluation?.findMany === "function",
  );
}

function getClient() {
  if (isUsable(globalForPrisma.prisma)) {
    return globalForPrisma.prisma as PrismaClient;
  }
  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  globalForPrisma.prismaRev = SCHEMA_REV;
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, _receiver) {
    const client = getClient();
    const value = Reflect.get(client, prop, client) as unknown;
    return typeof value === "function" ? (value as (...args: never[]) => unknown).bind(client) : value;
  },
});
