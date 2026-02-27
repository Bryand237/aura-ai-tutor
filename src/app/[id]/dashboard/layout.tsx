import Sidenav from "../../ui/dashboard/side-nav";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const sessionUserId = session?.user?.id;

  if (!sessionUserId) {
    redirect("/login");
  }

  if (String(sessionUserId) !== String(id)) {
    redirect(`/${sessionUserId}/dashboard`);
  }

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <Sidenav />
      </div>
      <div className="grow p-3 md:overflow-x-auto md:p-4">{children}</div>
    </div>
  );
}
