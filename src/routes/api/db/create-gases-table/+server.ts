async function create() {
  const createTable = await sql`
    CREATE TABLE IF NOT EXISTS gases (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      formula VARCHAR(255) NOT NULL,
      lifetime DECIMAL NOT NULL,
      gwp20 DECIMAL NOT NULL,
      gwp100 DECIMAL NOT NULL,
      gwp500 DECIMAL NOT NULL,
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `;
  console.log(`Created "gases" table`);

  return {
    createTable,
  };
}

import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { createPool } from "@vercel/postgres";
import { sql } from "@vercel/postgres";

export const GET: RequestHandler = async () => {
  const db = createPool();
  const startTime = Date.now();

  try {
    const { rows: gases } = await db.query("SELECT * FROM gases");
    const duration = Date.now() - startTime;
    return json({
      message: 'Table "gases" already exists',
      gases: gases,
      duration: duration,
    });
  } catch (error) {
    if (error?.message === `relation "gases" does not exist`) {
      console.log("Table does not exist, creating it now...");
      await create();
      const { rows: gases } = await db.query("SELECT * FROM gases");
      const duration = Date.now() - startTime;
      return json({
        message: 'Table "gases" created',
        gases: gases,
        duration: duration,
      });
    } else {
      throw error;
    }
  }
};
