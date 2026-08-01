import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

let authInstance: any = null;

export const getAuth = async () => {
  if (authInstance) return authInstance;

  const connectionString =
    process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/foodos';
  
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const { betterAuth } = await (new Function("return import('better-auth')"))();
  const { prismaAdapter } = await (new Function("return import('better-auth/adapters/prisma')"))();

  authInstance = betterAuth({
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
    }),
    emailAndPassword: {
      enabled: true,
    },
  });

  return authInstance;
};
