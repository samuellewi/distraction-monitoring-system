"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FormEvent, useState } from "react";
import AuthLayoutUI from "./AuthLayoutUI";

const REGISTER_URL = "http://127.0.0.1:4000/api/auth/register";

type RegisterResponse = {
  success: boolean;
  error?: {
    message?: string;
    details?: {
      fieldErrors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
    };
  };
};

function getRegisterErrorMessage(result: RegisterResponse) {
  const fieldErrors = result.error?.details?.fieldErrors;
  const firstFieldError =
    fieldErrors?.name?.[0] ||
    fieldErrors?.email?.[0] ||
    fieldErrors?.password?.[0];

  return firstFieldError || result.error?.message || "Unable to create account.";
}

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(REGISTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = (await response.json()) as RegisterResponse;

      if (!response.ok || !result.success) {
        throw new Error(getRegisterErrorMessage(result));
      }

      router.push("/login");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to create account.",
      );
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

        <h2 className="text-2xl font-bold mb-6">Create Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="w-full mb-3 p-2 border-b outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full mb-3 p-2 border-b outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full mb-4 p-2 border-b outline-none"
        />

        {error ? (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-sm mt-4">
          Already have account? <span className="text-blue-500">Login</span>
        </p>

        <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300 opacity-50"></div>
            
            <span className="px-3 text-sm text-gray-400">Or</span>
            
            <div className="flex-1 h-px bg-gray-300 opacity-50"></div>
        </div>

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
