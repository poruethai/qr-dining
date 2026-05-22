"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "@/lib/firebase-client";
import { ensureUserDocument } from "@/lib/db";

import { Loader2, Eye, EyeOff } from "lucide-react";

const ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use":
    "อีเมลนี้ถูกใช้งานแล้ว ลองเข้าสู่ระบบแทน",
  "auth/invalid-email": "รูปแบบอีเมลไม่ถูกต้อง",
  "auth/weak-password":
    "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
  "auth/too-many-requests":
    "ลองหลายครั้งเกินไป กรุณารอสักครู่",
};

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError(null);

    if (!name || !email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (password.length < 8) {
      setError(
        "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);

    try {
      // 1. create auth account
      const { user } =
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

      // 2. update display name
      await updateProfile(user, {
        displayName: name,
      });

      // 3. create firestore documents
      await ensureUserDocument({
        ...user,
        displayName: name,
      });

      router.push("/admin");
    } catch (err: any) {
      console.log(err);

      setError(
        ERROR_MESSAGES[err.code] ??
          "เกิดข้อผิดพลาด กรุณาลองใหม่"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Full name
        </label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Enter your name"
          autoComplete="name"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Email address
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="Enter your email"
          autoComplete="email"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Password
        </label>

        <div className="relative">
          <input
            type={
              showPassword ? "text" : "password"
            }
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(!showPassword)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Confirm password
        </label>

        <input
          type={
            showPassword ? "text" : "password"
          }
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          placeholder="Re-enter your password"
          autoComplete="new-password"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2
              size={16}
              className="animate-spin"
            />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
