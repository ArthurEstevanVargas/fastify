import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Pool } from 'pg';
import { loadEnv } from '../../config/env';

const run = async (): Promise<void> => {
  const env = loadEnv();

  if (!env.databaseUrl) {
    throw new Error('DATABASE_URL is required to run seeds');
  }

  const pool = new Pool({ connectionString: env.databaseUrl });
  const seedsDir = join(__dirname, 'seeds');

  try {
    const files = (await readdir(seedsDir)).filter((file) => file.endsWith('.sql')).sort();

    for (const file of files) {
      const sql = await readFile(join(seedsDir, file), 'utf8');
      await pool.query(sql);
      console.log(`Applied seed ${file}`);
    }
  } finally {
    await pool.end();
  }
};

void run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
