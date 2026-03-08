import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { NotificationPopups } from "@/components/shared/notification-popups";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "I-Shop - Modern E-Commerce",
    template: "%s | I-Shop",
  },
  description: "A modern e-commerce app built with Next.js App Router and FakeShopAPI.",
  icons: {
    icon: "/iShop-favicon.png",
    shortcut: "/iShop-favicon.png",
    apple: "/iShop-favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var shouldUseDark = stored ? stored === 'dark' : prefersDark;
                  document.documentElement.classList.toggle('dark', shouldUseDark);
                } catch (e) {}
              })();
            `,
          }}
        />
        <AppShell>{children}</AppShell>
        <NotificationPopups />
      </body>
    </html>
  );
}
