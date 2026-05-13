"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FormEvent, useState } from "react";
import AuthLayoutUI from "./AuthLayoutUI";

const LOGIN_URL = "http://127.0.0.1:4000/api/auth/login";

type LoginResponse = {
  success: boolean;
  data?: {
    token: string;
    user: unknown;
  };
  error?: {
    message?: string;
  };
};

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = (await response.json()) as LoginResponse;

      if (!response.ok || !result.success || !result.data?.token) {
        throw new Error(result.error?.message || "Unable to sign in.");
      }

      localStorage.setItem("authToken", result.data.token);
      localStorage.setItem("authUser", JSON.stringify(result.data.user));
      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayoutUI>
      <form className="w-[400px]" onSubmit={handleSubmit}>
        <h1 className="text-lg font-semibold text-center mb-6">
            Productivity Tracker
        </h1>

        <h2 className="text-2xl font-bold mb-6">Sign in</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full border-b mb-4 p-2 outline-none bg-transparent"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full border-b mb-4 p-2 outline-none bg-transparent"
        />

        <div className="flex justify-between items-center text-sm mb-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            Remember me
          </label>

          <div className="flex items-center gap-2 text-blue-600 cursor-pointer">
            <Image src="/icons/lock.svg" alt="" width={16} height={16} />
            <span>forgot password?</span>
          </div>
        </div>

        {error ? (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-3 rounded-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Signing in..." : "Sign in →"}
        </button>

        <p className="text-sm mt-6 text-center">
          No account?{" "}
          <button
            type="button"
            onClick={() => router.push("/register")}
            className="text-blue-600 cursor-pointer"
          >
            Sign up
          </button>
        </p>

        <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <button
              type="button"
              className="flex items-center gap-2 border px-3 py-2 rounded-full text-sm"
            >
                <Image src="/icons/google-symbol.png" alt="" width={20} height={20} />
                Sign in with Google
            </button>

            <button
              type="button"
              className="flex items-center gap-2 border px-3 py-2 rounded-full text-sm"
            >
                <Image src="/icons/facebook.png" alt="" width={20} height={20} />
                Sign in with Facebook
            </button>

            <button
              type="button"
              className="flex items-center gap-2 border px-3 py-2 rounded-full text-sm"
            >
                <Image src="/icons/twitter.png" alt="" width={20} height={20} />
                Sign in with  X
            </button>
        </div>
      </form>
    </AuthLayoutUI>
  );
}
