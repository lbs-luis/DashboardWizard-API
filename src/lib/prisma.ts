import { PrismaClient } from "@prisma/client";
import { NODE_ENV } from "@/../env";

export const prisma = new PrismaClient({
  log: NODE_ENV === 'dev' ? ['query'] : []
})