import React from "react";
import AccessDenied from "../access-denied/page";
import { type Metadata } from "next";
import { getServerAuthSession } from "~/server/auth";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import LayoutHeader from "../_components/layoutHeader";
import { NextAuthProvider } from "../_components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "VTSNS-CYBERPUNK-NEWS",
  description: "VTSNS-CYBERPUNK-NEWS POWERED BY T3",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();
  if (!session) {
    return <AccessDenied />;
  }
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <div className="scanline" />
        <NextAuthProvider session={session}>
          <LayoutHeader />
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
