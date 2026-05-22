import { db, getUidFromRequest } from "@/lib/firebase-admin";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const publicUid = searchParams.get("uid");

  let uid = publicUid;

  if (!uid) {
    uid = await getUidFromRequest(request);
    if (!uid) return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const snapshot = await db
      .collection("users").doc(uid)
      .collection("menu")
      .get();

    let items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (publicUid) {
      items = items.filter((item) => item.available);
    }

    items.sort((a, b) => {
      if (a.category === b.category) return a.name.localeCompare(b.name);
      return a.category.localeCompare(b.category);
    });

    return Response.json(items);
  } catch (error) {
    console.error("GET /api/menu error:", error);
    return Response.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}

export async function POST(request) {
  const uid = await getUidFromRequest(request);
  if (!uid) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, description = "", price, category = "Mains", available = true, image_url = null } = await request.json();

    if (!name || price === undefined || price === null)
      return Response.json({ error: "Name and price are required" }, { status: 400 });

    const docRef = await db
      .collection("users").doc(uid)
      .collection("menu")
      .add({ name, description, price: parseFloat(price), category, available, image_url, created_at: new Date() });

    return Response.json(
      { id: docRef.id, name, description, price: parseFloat(price), category, available, image_url },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/menu error:", error);
    return Response.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}