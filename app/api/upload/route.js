import { NextResponse } from "next/server";
import { uploadImage } from "../utils/upload";
import { getUidFromRequest } from "@/lib/firebase-admin"; // ← เปลี่ยนตรงนี้

export async function POST(req) {
  try {
    const uid = await getUidFromRequest(req); // ← ใช้ฟังก์ชันที่มีอยู่แล้ว
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const url = await uploadImage(file, uid);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}