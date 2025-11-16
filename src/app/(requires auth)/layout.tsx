import React from "react";
import AccessDenied from "../access-denied/page";
import { type Metadata } from "next";
import { getServerAuthSession } from "~/server/auth";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();
  if (!session) {
    return <AccessDenied />;
  }
  return <>{children}</>;
}
