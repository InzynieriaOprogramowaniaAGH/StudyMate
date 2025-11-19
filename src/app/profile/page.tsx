import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

import Header from "@/components/layout/Header";
import ProfileContent from "@/components/profile/ProfileContent";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/login");
  }

  const user = session.user;

  return (
    <>
      <Header />
      <ProfileContent user={user} />
    </>
  );
}
