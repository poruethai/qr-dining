import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  return createClient(url, key);
}

export async function uploadImage(file, uid) {
  if (!file) return null;

  const ext = file.name.split(".").pop() ?? "jpg";
  const safeUid = (uid || "menu").replace(/[^a-zA-Z0-9_-]/g, "_");
  const fileName = `${safeUid}/${Date.now()}.${ext}`;

  console.log("=== UPLOAD DEBUG ===");
  console.log("file.name:", file.name);
  console.log("file.type:", file.type);
  console.log("uid:", uid);
  console.log("fileName:", fileName);

  const supabase = getSupabase();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("menu-img")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("menu-img")
    .getPublicUrl(fileName);

  return data.publicUrl;
}