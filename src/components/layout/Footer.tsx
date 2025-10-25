import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-8 text-muted text-sm bg-bg">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center font-clarity">
        <p>© 2025 StudyMate. All rights reserved.</p>
        <div className="space-x-6 mt-4 md:mt-0">
          <Link href="/privacy" className="hover:text-primary transition">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-primary transition">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
