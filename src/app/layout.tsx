import "../styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import LayoutHeader from "./_components/layoutHeader";
import { TRPCReactProvider } from "~/trpc/react";
import { NextAuthProvider } from "./_components/providers/SessionProvider";
import { getServerAuthSession } from "~/server/auth";

export const metadata: Metadata = {
  title: "VTSNS-CYBERPUNK-NEWS",
  description: "VTSNS-CYBERPUNK-NEWS POWERED BY T3",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

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
