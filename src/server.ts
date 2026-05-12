import { buildApp } from './app';
import { loadEnv } from './config/env';

const start = async (): Promise<void> => {
  const env = loadEnv();
  const app = await buildApp();

  const close = async (signal: NodeJS.Signals): Promise<void> => {
    app.log.info({ signal }, 'Shutting down');
    await app.close();
    process.exit(0);
  };

  process.once('SIGTERM', close);
  process.once('SIGINT', close);

  try {
    await app.listen({ host: '0.0.0.0', port: env.port });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
