import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in .env file");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function main() {
  console.log("Running migrations...");

  await migrate(db, { migrationsFolder: "src/db/migrations" });

  console.log("Migrations finished!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
