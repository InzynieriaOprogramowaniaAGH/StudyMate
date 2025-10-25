import "./globals.css";
import type { Metadata } from "next";

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
    <html lang="en">
      <body className="font-clarity bg-bg text-text antialiased">
        {children}
      </body>
    </html>
  );
}
