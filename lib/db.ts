import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
} from "firebase/firestore";

import { db } from "./firebase-client";

export async function ensureUserDocument(user: any) {
  const userRef = doc(db, "users", user.uid);

  const existing = await getDoc(userRef);

  // ถ้ามี user แล้ว
  if (existing.exists()) {
    return existing.data();
  }

  // trial 30 วัน
  const trialEndDate = new Date();
  trialEndDate.setDate(trialEndDate.getDate() + 30);

  // สร้าง restaurant
  const restaurantRef = await addDoc(collection(db, "restaurants"), {
    name: `${user.displayName || "My"} Restaurant`,
    ownerId: user.uid,
    // subscription
    plan: "free",
    subscriptionStatus: "trial",
    trialEndsAt: trialEndDate,
    subscriptionEndsAt: null, 
    createdAt: new Date(),
  });

  // user profile
  const userData = {
    uid: user.uid,
    name: user.displayName || "",
    email: user.email || "",
    role: "owner",
    restaurantId: restaurantRef.id,
    createdAt: new Date(),
  };

  await setDoc(userRef, userData);

  return userData;
}