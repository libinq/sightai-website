import { notFound } from "next/navigation";
import { getCapability } from "@/content/industries";
import { CapabilityDetailView } from "@/components/console/views/capability-detail";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getCapability(id)) notFound();
  return <CapabilityDetailView id={id} />;
}
