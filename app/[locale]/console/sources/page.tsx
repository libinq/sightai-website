import { Suspense } from "react";
import { SourcesView } from "@/components/console/views/sources";

export default function Page() {
  return (
    <Suspense>
      <SourcesView />
    </Suspense>
  );
}
