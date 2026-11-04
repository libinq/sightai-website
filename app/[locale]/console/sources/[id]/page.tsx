import { SourceDetailView } from "@/components/console/views/source-detail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SourceDetailView id={decodeURIComponent(id)} />;
}
