import { Suspense } from "react";
import { AnalyticsView } from "@/components/console/views/analytics";

export default function Page() {
  return (
    <Suspense>
      <AnalyticsView />
    </Suspense>
  );
}
