import CreateCoursForm from "./CreateCoursForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);

  return <CreateCoursForm userId={userId} />;
}
