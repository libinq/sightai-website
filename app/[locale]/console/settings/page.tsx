import { Suspense } from "react";
import { SettingsView } from "@/components/console/views/settings";

export default function Page() {
  return (
    <Suspense>
      <SettingsView />
    </Suspense>
  );
}
