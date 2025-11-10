"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import AccessDenied from "~/app/access-denied/page";
import ErrorPopup from "~/components/ui/error-popup";

export default function SubmitIntelPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const subjects = api.post.getSubjects.useQuery();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    subject: "",
    link: "",
  });

  const submitIntel = api.intel.submitIntel.useMutation({
    onSuccess: () => {
      router.push("/intel");
      setIsLoading(false);
    },
    onError: (err) => {
      setErrorText(err.message);
      setIsLoading(false);
      setError(true);
    },
  });

  function handle_submitIntel(e: React.FormEvent) {
    if (isLoading) return;
    setIsLoading(true);
    e.preventDefault();
    submitIntel.mutate({
      ...formData,
    });
  }

  if (!session) {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-black p-8 text-red-500">
      <ErrorPopup
        visible={error}
        message={errorText}
        onClose={() => setError(false)}
        timeout={15000}
      />
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-lg border border-red-800 bg-gray-900 p-6">
          <h1 className="glitch mb-6 text-3xl">SUBMIT MEGACORP INTEL</h1>

          <form
            onSubmit={(e) => {
              handle_submitIntel(e);
            }}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block text-sm">INTEL TITLE:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                required
                placeholder="e.g., ARASAKA CORP SECURITY PROTOCOLS"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">Link:</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                className="w-full rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                placeholder="e.g., https://arasaka.net/security-protocols"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">SUBJECT/DIVISION:</label>
              <select
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                required
              >
                <option value="">Select Division</option>
                {subjects.data
                  ?.filter((subject) => subject.name !== "All")
                  .map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* <div>
              <label className="mb-2 block text-sm">OPERATION DATE:</label>
              <input
                type="datetime-local"
                value={formData.examDate}
                onChange={(e) =>
                  setFormData({ ...formData, examDate: e.target.value })
                }
                className="w-full rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                required
              />
            </div> */}

            {/* <div>
              <label className="mb-2 block text-sm">DIFFICULTY RATING:</label>
              <select
                value={formData.difficulty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    difficulty: Number(e.target.value),
                  })
                }
                className="w-full rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                required
              >
                <option value="1">Level 1 - Basic Security</option>
                <option value="2">Level 2 - Enhanced Protocols</option>
                <option value="3">Level 3 - Advanced Systems</option>
                <option value="4">Level 4 - Elite Defenses</option>
                <option value="5">Level 5 - Maximum Security</option>
              </select>
            </div> */}

            <div>
              <label className="mb-2 block text-sm">INTEL DETAILS:</label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                rows={6}
                required
                placeholder="Detail the security systems, required preparations, and potential complications..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={() => router.back()}
                className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
              >
                ABORT
              </Button>
              <Button
                type="submit"
                className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
                disabled={submitIntel.isPending}
              >
                {submitIntel.isPending ? "ENCRYPTING..." : "SUBMIT INTEL"}
              </Button>
            </div>

            {/* {submitIntel.error && (
              <div className="mt-4 text-red-600">
                {submitIntel.error.message}
              </div>
            )} */}
          </form>
        </div>
      </div>
    </div>
  );
}
