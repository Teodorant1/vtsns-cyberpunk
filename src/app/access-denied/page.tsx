"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function AccessDenied() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black text-white">
      <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
      <p className="text-xl">
        You don&apos;t have permission to view this page
      </p>
      <div className="mt-4 flex gap-4">
        <Button
          onClick={() => router.push("/api/auth/signin")}
          className="bg-red-600 hover:bg-red-700"
        >
          Sign In
        </Button>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="border-red-600 text-red-600 hover:bg-red-900/10"
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
