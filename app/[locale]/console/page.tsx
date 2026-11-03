import { Suspense } from "react";
import { OverviewView } from "@/components/console/views/overview";

export default function Page() {
  return (
    <Suspense>
      <OverviewView />
    </Suspense>
  );
}
