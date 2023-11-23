async function drop() {
  const dropTable = await sql`
    DROP TABLE gases;
    `;
  console.log(`Dropped "gases" table`);

  return {
    dropTable,
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
    // drop it
    await drop();
    return json({
      message: 'Table "gases" dropped',
      duration: duration,
    });
  } catch (error) {
    if (error?.message === `relation "gases" does not exist`) {
      const duration = Date.now() - startTime;
      return json({
        message: 'Table "gases" does not exist',
        duration: duration,
      });
    } else {
      throw error;
    }
  }
};
