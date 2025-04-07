import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  }).$extends({
    query: {
      async $allOperations({ operation, model, args, query }) {
        const start = performance.now();
        try {
          const result = await query(args);
          return result;
        } catch (error) {
          console.error('Prismaクエリエラー:', {
            operation,
            model,
            error:
              error instanceof Error
                ? {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                  }
                : error,
            timestamp: new Date().toISOString(),
          });
          throw error;
        } finally {
          const end = performance.now();
          console.log(`${model}.${operation} 実行時間: ${end - start}ms`);
        }
      },
    },
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
