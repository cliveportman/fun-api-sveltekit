import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
export const GET: RequestHandler = () => {
  const activity = json({
    name: "Ultra-trail Snowdonia 100",
    distance: 101517,
    duration: 71100,
  });
  return activity;
};
