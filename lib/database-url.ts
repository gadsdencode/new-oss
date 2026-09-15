export function resolveDatabaseUrl(env: Record<string, string | undefined> = process.env): string | null {
  const url =
    env.DATABASE_URL ||
    env.POSTGRES_URL ||
    env.POSTGRES_PRISMA_URL ||
    env.POSTGRES_URL_NON_POOLING ||
    env.DATABASE_URL_UNPOOLED ||
    env.NEWOSS_DATABASE_URL ||
    env.NEWOSS_POSTGRES_URL ||
    env.NEWOSS_POSTGRES_PRISMA_URL ||
    env.NEWOSS_POSTGRES_URL_NON_POOLING ||
    env.NEWOSS_DATABASE_URL_UNPOOLED ||
    null;
  const trimmed = url?.trim();
  return trimmed ? trimmed : null;
}
