import { Suspense } from "react";
import { PlaygroundView } from "@/components/console/views/playground";

export default function Page() {
  return (
    <Suspense>
      <PlaygroundView />
    </Suspense>
  );
}
