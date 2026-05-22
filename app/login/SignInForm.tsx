"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signInWithGoogle } from "@/lib/auth";
import { ensureUserDocument } from "@/lib/db";
import { auth } from "@/lib/firebase-client";
import { Loader2, Eye, EyeOff } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/user-not-found": "ไม่พบบัญชีนี้ในระบบ",
  "auth/wrong-password": "รหัสผ่านไม่ถูกต้อง",
  "auth/invalid-credential": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "auth/too-many-requests": "ลองหลายครั้งเกินไป กรุณารอสักครู่",
  "auth/invalid-email": "รูปแบบอีเมลไม่ถูกต้อง",
};

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      setError(ERROR_MESSAGES[err.code] ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
      setLoading(false);
    }
  };
  
  const [googleLoading, setGoogleLoading] = useState(false);

async function handleGoogleLogin() {
  setError(null);
  setGoogleLoading(true);

  try {
    const user = await signInWithGoogle();

    await ensureUserDocument(user);

    router.push("/admin");
  } catch (err: any) {
    setError("Google sign in failed");
    console.error(err);
  } finally {
    setGoogleLoading(false);
  }
}

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Email address
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </button>
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition cursor-pointer disabled:opacity-60"
      >
        {googleLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />

            Continue with Google
          </>
        )}
      </button>
    </form>
  );
}