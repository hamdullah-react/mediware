import { PrismaClient } from 'prisma/prisma-client';
const prismaClient = new PrismaClient();

export const DBClient = () => {
  return prismaClient;
};
