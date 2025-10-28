import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const user = session.user;

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <a
            href="/dashboard"
            className="text-[var(--color-primary)] hover:underline"
          >
            ← Back to Dashboard
          </a>
        </div>

        {/* Profile Card */}
        <section className="bg-[var(--color-bg-light)] border border-[var(--color-border)] rounded-2xl p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-2xl">
              {user?.name?.[0] || "U"}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Personal Information Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                First Name
              </label>
              <input
                type="text"
                defaultValue={user?.name?.split(" ")[0] || ""}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-200 focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue={user?.email || ""}
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-800 text-gray-200 focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <button className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-medium py-2 px-4 rounded-lg transition">
              Save Changes
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
