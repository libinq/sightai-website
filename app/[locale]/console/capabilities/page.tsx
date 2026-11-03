import { Suspense } from "react";
import { CapabilitiesView } from "@/components/console/views/capabilities";

export default function Page() {
  return (
    <Suspense>
      <CapabilitiesView />
    </Suspense>
  );
}
