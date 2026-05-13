import { config } from 'dotenv';

config();

export type NodeEnv = 'development' | 'test' | 'production';

export type Env = {
  adminApiKey: string | undefined;
  corsOrigins: string[];
  databaseUrl: string | undefined;
  nodeEnv: NodeEnv;
  port: number;
};

const isNodeEnv = (value: string | undefined): value is NodeEnv => {
  return value === 'development' || value === 'test' || value === 'production';
};

const parsePort = (value: string | undefined): number => {
  if (!value) {
    return 3000;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }

  return port;
};

const parseCorsOrigins = (value: string | undefined): string[] => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const loadEnv = (): Env => {
  const nodeEnv = isNodeEnv(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';
  const adminApiKey = process.env.ADMIN_API_KEY;
  const databaseUrl = process.env.DATABASE_URL;

  if (adminApiKey && adminApiKey.length < 32) {
    throw new Error('ADMIN_API_KEY must be at least 32 characters');
  }

  if (nodeEnv === 'production' && !adminApiKey) {
    throw new Error('ADMIN_API_KEY is required in production');
  }

  if (nodeEnv === 'production' && !databaseUrl) {
    throw new Error('DATABASE_URL is required in production');
  }

  return {
    adminApiKey,
    corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
    databaseUrl,
    nodeEnv,
    port: parsePort(process.env.PORT)
  };
};
