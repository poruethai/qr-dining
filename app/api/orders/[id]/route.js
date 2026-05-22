// import { db } from "@/lib/firebase-admin";

// export async function PATCH(request, context) {
//   try {
//     const { id } = await context.params; // ✅ ต้อง await

//     console.log("ID:", id);

//     if (!id) {
//       return Response.json(
//         { error: "Invalid ID" },
//         { status: 400 }
//       );
//     }

//     const { status } = await request.json();

//     if (!status) {
//       return Response.json(
//         { error: "Status is required" },
//         { status: 400 }
//       );
//     }

//     const docRef = db.collection("orders").doc(id);

//     const doc = await docRef.get();
//     if (!doc.exists) {
//       return Response.json(
//         { error: "Order not found" },
//         { status: 404 }
//       );
//     }

//     await docRef.update({ status });

//     const updatedDoc = await docRef.get();

//     return Response.json({
//       id: updatedDoc.id,
//       ...updatedDoc.data(),
//     });

//   } catch (error) {
//     console.error("Error updating order:", error);
//     return Response.json(
//       { error: "Failed to update order" },
//       { status: 500 }
//     );
//   }
// }

import { db, getUidFromRequest } from "@/lib/firebase-admin";

export async function PATCH(request, context) {
  const uid = await getUidFromRequest(request);
  if (!uid) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await context.params;
  const { status } = await request.json();

  const docRef = db.collection("users").doc(uid).collection("orders").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return Response.json({ error: "Not found" }, { status: 404 });

  await docRef.update({ status });
  return Response.json({ id, ...doc.data(), status });
}