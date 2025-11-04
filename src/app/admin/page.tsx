"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";

export default function AdminPage() {
  const usersQuery = api.admin.listUsers.useQuery();
  const pendingIntelQuery = api.admin.listPendingIntel.useQuery(undefined, {
    enabled: true,
  });

  const updateRole = api.admin.updateUserRole.useMutation();
  const verifyIntel = api.admin.verifyIntel.useMutation();

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black p-8 text-red-500">
      <div className="mx-auto max-w-6xl">
        <h1 className="glitch mb-6 text-3xl">ADMIN CONTROL NODE</h1>

        <section className="mb-8 rounded-lg border border-red-800 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl text-red-400">REGISTERED OPERATIVES</h2>
          {usersQuery.isLoading ? (
            <div>Loading operatives...</div>
          ) : (
            <div className="space-y-2">
              {usersQuery.data?.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between rounded border border-red-800 p-3"
                >
                  <div>
                    <div className="text-lg text-white">{u.username}</div>
                    <div className="text-sm text-red-400">{u.email}</div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedUser === u.id ? u.role : u.role}
                      onChange={(e) => {
                        updateRole.mutate(
                          {
                            userId: u.id,
                            role: e.target.value as "user" | "admin",
                          },
                          {
                            onSuccess: () => void usersQuery.refetch(),
                          },
                        );
                      }}
                      className="rounded border border-red-800 bg-gray-800 p-2 text-red-500"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                    <Button
                      onClick={() => {
                        setSelectedUser(u.id);
                      }}
                      className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
                    >
                      SELECT
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-red-800 bg-gray-900 p-6">
          <h2 className="mb-4 text-xl text-red-400">PENDING INTEL</h2>
          {pendingIntelQuery.isLoading ? (
            <div>Loading pending intel...</div>
          ) : (
            <div className="space-y-4">
              {pendingIntelQuery.data?.map((i) => (
                <div key={i.id} className="rounded border border-red-800 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <div className="text-lg text-white">{i.title}</div>
                      <div className="text-sm text-red-400">
                        {i.subject} • Difficulty {i.difficulty}
                      </div>
                    </div>
                    <div className="text-sm text-red-400">
                      By: {i.author?.username ?? i.author?.email}
                    </div>
                  </div>

                  <div className="mb-4 text-red-300">{i.content}</div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      onClick={() => {
                        verifyIntel.mutate(
                          { id: i.id },
                          { onSuccess: () => void pendingIntelQuery.refetch() },
                        );
                      }}
                      className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
                    >
                      VERIFY
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
