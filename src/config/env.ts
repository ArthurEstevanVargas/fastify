import { config } from 'dotenv';

config();

export type NodeEnv = 'development' | 'test' | 'production';

export type Env = {
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

export const loadEnv = (): Env => {
  const nodeEnv = isNodeEnv(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

  return {
    databaseUrl: process.env.DATABASE_URL,
    nodeEnv,
    port: parsePort(process.env.PORT)
  };
};
