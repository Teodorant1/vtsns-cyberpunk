"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("ENCRYPTION KEYS DO NOT MATCH");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "REGISTRATION FAILED");
      }

      // Auto-login after successful registration
      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "SYSTEM ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8 text-red-500">
      <div className="mx-auto max-w-md">
        <div className="mb-8 rounded-lg border border-red-800 bg-gray-900 p-6">
          <h1 className="glitch mb-6 text-center text-3xl">
            NETRUNNER REGISTRATION
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm">HANDLE (USERNAME):</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                required
                placeholder="Your cyberpunk handle"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                CONTACT FREQUENCY (EMAIL):
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                required
                placeholder="your.handle@megacorp.net"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                ENCRYPTION KEY (PASSWORD):
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                required
                placeholder="Enter your secure key"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                VERIFY ENCRYPTION KEY:
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                required
                placeholder="Confirm your secure key"
              />
            </div>

            {error && (
              <div className="text-center text-red-600">
                <span className="glitch">{error}</span>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => router.push("/login")}
                className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
              >
                RETURN TO LOGIN
              </Button>
              <Button
                type="submit"
                className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
                disabled={isLoading}
              >
                {isLoading ? "INITIALIZING..." : "CREATE ACCOUNT"}
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center text-sm text-red-400">
          <p>
            By registering, you agree to submit to the authority of the
            megacorporations and accept the risks of netrunning.
          </p>
        </div>
      </div>
    </div>
  );
}
