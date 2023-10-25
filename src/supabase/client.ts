import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

export const client = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_ANON_KEY as string,
);