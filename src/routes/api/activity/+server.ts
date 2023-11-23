import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

interface Gwp {
  name: string;
  formula: string;
  lifetime: number;
  gwp20: number;
  gwp100: number;
  gqp500: number;
}

export const GET: RequestHandler = () => {
  const gases = json([
    {
      name: "co2",
      lifetime: 0,
      gwp20: 0,
    },
  ]);
  return gases;
};
