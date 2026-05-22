import { db, getUidFromRequest } from "@/lib/firebase-admin";

export async function POST(request) {
  try {
    const { table_number, item_name, restaurant_uid } = await request.json();

    if (!table_number || !item_name || !restaurant_uid)
      return Response.json({ error: "Missing fields" }, { status: 400 });

    const docRef = await db
      .collection("users").doc(restaurant_uid)
      .collection("orders").add({
        table_number,
        item_name,
        status: "new",
        created_at: new Date(),
      });

    return Response.json({
      id: docRef.id,
      table_number,
      item_name,
      status: "new",
      created_at: new Date(),
    });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET(request) {
  const uid = await getUidFromRequest(request);
  if (!uid) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const snapshot = await db
    .collection("users").doc(uid)
    .collection("orders")
    .orderBy("created_at", "desc")
    .get();

  const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return Response.json(orders);
}