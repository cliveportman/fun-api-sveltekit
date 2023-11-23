async function seed() {
  const gases = await Promise.all([
    sql`
          INSERT INTO gases (name, formula, lifetime, gwp20, gwp100, gwp500)
          VALUES ('carbon dioxide', 'CO₂', 'Infinity', 1, 1, 1);
      `,
    sql`
          INSERT INTO gases (name, formula, lifetime, gwp20, gwp100, gwp500)
          VALUES ('methane', 'CH₄', '11.8', 81.2, 27.9, 7.95);
      `,
  ]);
  console.log(`Seeded ${gases.length} users`);

  return {
    gases,
  };
}

import { createPool } from "@vercel/postgres";
import { sql } from "@vercel/postgres";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
  const db = createPool();
  const startTime = Date.now();

  try {
    // Make a check first, because the seed() call fails with a 500
    await db.query("SELECT * FROM gases");
    await seed();
    const { rows: gases } = await db.query("SELECT * FROM gases");
    const duration = Date.now() - startTime;
    return json({
      gases: gases,
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
