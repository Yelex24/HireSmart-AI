"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-xl border border-gray-200 text-center">
          <h1 className="text-2xl font-bold text-gray-900">HireSmart</h1>
          <p className="mt-4 text-gray-600">
            ✅ Already signed in as <span className="font-medium">{session.user.email}</span>
          </p>
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-6 w-full py-3 rounded-xl border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 transition"
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-10 bg-white rounded-2xl shadow-xl border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            HireSmart
          </h1>
          <p className="mt-3 text-gray-600 text-base">
            Streamline your hiring process with AI-powered candidate screening
          </p>
        </div>

        {/* Divider with text */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              Sign in to continue
            </span>
          </div>
        </div>

        {/* Sign In Button */}
        <Button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-3 py-5 text-base font-medium rounded-xl border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 transition cursor-pointer"
        >
          <FcGoogle size={22} />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
