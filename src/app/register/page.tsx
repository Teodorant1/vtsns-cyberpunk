"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import ErrorPopup from "~/components/ui/error-popup";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");

  const registerMutation = api.auth.register.useMutation({
    onSuccess: async (data) => {
      if (data.error) {
        setErrorText(data.errorText ?? "REGISTRATION FAILED");
        setError(true);
      } else {
        setError(false);
        setErrorText("");

        await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
      }
    },
  });

  function handle_registerMutation(e: React.FormEvent) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorText("ENCRYPTION KEYS DO NOT MATCH");
      setError(true);
      return;
    }

    registerMutation.mutate({
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });
  }

  return (
    <div className="min-h-screen bg-black p-8 text-red-500">
      <div className="mx-auto max-w-md">
        <div className="mb-8 rounded-lg border border-red-800 bg-gray-900 p-6">
          <h1 className="glitch mb-6 text-center text-3xl">
            NETRUNNER REGISTRATION
          </h1>

          <form onSubmit={handle_registerMutation} className="space-y-6">
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

            <ErrorPopup
              visible={error}
              message={errorText}
              onClose={() => setError(false)}
              timeout={15000}
            />

            <div className="flex w-full justify-between px-4">
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
            By registering, you agree to NEVER submit to the authority of the
            megacorporations and always stand against them.
          </p>
        </div>
      </div>
    </div>
  );
}
