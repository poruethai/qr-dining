import { db, getUidFromRequest } from "@/lib/firebase-admin";

export async function PATCH(request, context) {
  const uid = await getUidFromRequest(request);
  if (!uid) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await context.params;
    const body = await request.json();

    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.category !== undefined) updateData.category = body.category;
    if (body.available !== undefined) updateData.available = body.available;
    if (body.image_url !== undefined) updateData.image_url = body.image_url;

    if (Object.keys(updateData).length === 0)
      return Response.json({ error: "No fields to update" }, { status: 400 });

    const docRef = db.collection("users").doc(uid).collection("menu").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return Response.json({ error: "Menu item not found" }, { status: 404 });

    await docRef.update(updateData);
    return Response.json({ id, ...doc.data(), ...updateData });
  } catch (error) {
    console.error("PATCH /api/menu/[id] error:", error);
    return Response.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const uid = await getUidFromRequest(request);
  if (!uid) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await context.params;
    const docRef = db.collection("users").doc(uid).collection("menu").doc(id);
    const doc = await docRef.get();

    if (!doc.exists) return Response.json({ error: "Menu item not found" }, { status: 404 });

    await docRef.delete();
    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/menu/[id] error:", error);
    return Response.json({ error: "Failed to delete menu item" }, { status: 500 });
  }
}