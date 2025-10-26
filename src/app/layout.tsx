import "./globals.css";
import type { Metadata } from "next";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";

export const metadata: Metadata = {
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
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
