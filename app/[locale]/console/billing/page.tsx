import { Suspense } from "react";
import { BillingView } from "@/components/console/views/billing";

export default function Page() {
  return (
    <Suspense>
      <BillingView />
    </Suspense>
  );
}
