import { Suspense } from "react";
import { ApiKeysView } from "@/components/console/views/api-keys";

export default function Page() {
  return (
    <Suspense>
      <ApiKeysView />
    </Suspense>
  );
}
