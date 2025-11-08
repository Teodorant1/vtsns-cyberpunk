"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    handle: "",
    specialization: "",
    bio: "",
  });

  const { data: profile, refetch } = api.intel.getProfile.useQuery(
    {
      userId: session?.user?.id ?? "",
    },
    {
      enabled: !!session?.user?.id,
    },
  );

  const updateProfile = api.intel.updateProfile.useMutation({
    onSuccess: () => {
      void refetch();
      setIsEditing(false);
    },
  });

  if (!session) {
    return (
      <div className="min-h-screen bg-black p-8 text-red-500">
        <div className="text-center">
          <h1 className="glitch text-2xl">ACCESS DENIED</h1>
          <p className="mt-4">
            Authentication required to access this terminal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8 text-red-500">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-lg border border-red-800 bg-gray-900 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="glitch text-3xl">NETRUNNER PROFILE</h1>
            {!isEditing && (
              <Button
                onClick={() => {
                  setFormData({
                    handle: profile?.handle ?? "",
                    specialization: profile?.specialization ?? "",
                    bio: profile?.bio ?? "",
                  });
                  setIsEditing(true);
                }}
                className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
              >
                MODIFY
              </Button>
            )}
          </div>

          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfile.mutate(formData);
              }}
              className="space-y-4"
            >
              <div>
                <label className="mb-2 block text-sm">HANDLE:</label>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) =>
                    setFormData({ ...formData, handle: e.target.value })
                  }
                  className="w-full rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm">SPECIALIZATION:</label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  className="w-full rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm">BIO:</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
                >
                  CANCEL
                </Button>
                <Button
                  type="submit"
                  className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? "UPLOADING..." : "SAVE"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="mb-2 text-lg text-red-400">HANDLE</h2>
                <p className="text-xl">{profile?.handle ?? "Not set"}</p>
              </div>
              <div>
                <h2 className="mb-2 text-lg text-red-400">RANK</h2>
                <p className="text-xl">{profile?.rank ?? "Rookie"}</p>
              </div>
              <div>
                <h2 className="mb-2 text-lg text-red-400">REPUTATION</h2>
                <p className="text-xl">{profile?.reputation ?? 0}</p>
              </div>
              <div>
                <h2 className="mb-2 text-lg text-red-400">SPECIALIZATION</h2>
                <p className="text-xl">
                  {profile?.specialization ?? "Not specified"}
                </p>
              </div>
              <div>
                <h2 className="mb-2 text-lg text-red-400">BIO</h2>
                <p className="text-xl">{profile?.bio ?? "No bio available"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
