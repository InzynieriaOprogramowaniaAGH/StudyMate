import "./globals.css";
import type { Metadata } from "next";
import SessionProvider from "@/providers/SessionProvider";

export const metadata: Metadata = {
  icons: {
    icon: "/icones/icon-192.png",
  },
  title: "StudyMate — AI-Powered Learning",
  description: "Learn smarter with AI-generated flashcards, quizzes and notes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="font-clarity bg-bg text-text antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
