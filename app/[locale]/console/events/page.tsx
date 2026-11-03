import { Suspense } from "react";
import { EventsView } from "@/components/console/views/events";

export default function Page() {
  return (
    <Suspense>
      <EventsView />
    </Suspense>
  );
}
