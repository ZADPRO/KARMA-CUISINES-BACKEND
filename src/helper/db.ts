import { Pool, PoolClient } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || "cuisines_user",
  host: process.env.DB_HOST || "zadroit.brightoncloudtech.com",
  database: process.env.DB_NAME || "karma_cuisines_db",
  password: process.env.DB_PASSWORD || "karmaadmin@1",
  port: Number(process.env.DB_PORT) || 5436,
});

export const executeQuery = async (
  query: string,
  params: any[] = []
): Promise<any[]> => {
  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    const result = await client.query(query, params);
    return result.rows;
  } catch (error: any) {
    throw new Error(`Database query failed : ${error.message}`);
  } finally {
    if (client) {
      client.release();
    }
  }
};

export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect();
  return client;
};

export const closePool = async () => {
  try {
    await pool.end();
    console.log("Database pool - status closed");
  } catch (error: any) {
    console.error("Error in closing pool - status failed ", error.message);
  }
};
