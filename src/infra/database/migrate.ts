import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Pool } from 'pg';
import { loadEnv } from '../../config/env';

const run = async (): Promise<void> => {
  const env = loadEnv();

  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL is required to run migrations');
  }

  const pool = new Pool({ connectionString: env.databaseUrl });
  const migrationsDir = join(__dirname, 'migrations');

  try {
    const files = (await readdir(migrationsDir)).filter((file) => file.endsWith('.sql')).sort();

    for (const file of files) {
      const sql = await readFile(join(migrationsDir, file), 'utf8');
      await pool.query(sql);
      console.log(`Applied migration ${file}`);
    }
  } finally {
    await pool.end();
  }
};

void run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
