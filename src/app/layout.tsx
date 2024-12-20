import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import LayoutHeader from "./_components/layoutHeader";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "VTSNS-CYBERPUNK-NEWS",
  description: "VTSNS-CYBERPUNK-NEWS POWERED BY T3",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <LayoutHeader />
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
