import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const path = typeof req.query.path === "string" ? req.query.path : "";
  if (!path) return res.status(400).send("Missing path");
  const bucket = path.startsWith("coach-responses/") ? "coach-responses" : "player-uploads";
  const filePath = path.replace(/^coach-responses\//, "").replace(/^player-uploads\//, "");
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(filePath, 3600);
  if (error || !data) return res.status(500).send(error?.message || "Error");
  return res.redirect(302, data.signedUrl);
}
