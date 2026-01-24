import "./globals.css";
import type { Metadata } from "next";
import SessionProvider from "@/providers/SessionProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

export const metadata: Metadata = {
  icons: {
    icon: "/icones/icon-192.png",
  },
  title: "StudyMate — AI-Powered Learning",
  description: "Learn smarter with AI-generated flashcards, quizzes and notes.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
      </head>
      <body className="font-clarity bg-bg text-text antialiased">
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>{children}</SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
