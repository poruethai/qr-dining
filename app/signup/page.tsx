import { Suspense } from "react";
import { UtensilsCrossed } from "lucide-react";
import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg mb-3">
            <UtensilsCrossed size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Kitchen Admin</h1>
          <p className="text-gray-500 text-sm mt-1">
            Create your restaurant admin account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create account</h2>

          <Suspense fallback={<div className="h-64 animate-pulse bg-gray-50 rounded-xl" />}>
            <SignUpForm />
          </Suspense>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-semibold hover:text-blue-700">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}