import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  UserCredential,
} from "firebase/auth";

import { auth } from "./firebase-client";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  await signInWithRedirect(auth, provider);
}

export async function checkRedirectResult() {
  const result: UserCredential | null =
    await getRedirectResult(auth);

  if (result && result.user) {
    return result.user;
  }

  return null;
}

export async function logout() {
  await signOut(auth);
}