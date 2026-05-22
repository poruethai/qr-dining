import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key);
}

export async function uploadImage(file, uid) {
  if (!file) return null;

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${uid}/${Date.now()}.${ext}`;

  const supabase = getSupabase();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("menu-images")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from("menu-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}