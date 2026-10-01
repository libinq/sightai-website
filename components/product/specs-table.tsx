"use client";

import { Cloud, Cpu } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function SpecsTable({
  rows,
  labels,
}: {
  rows: { label: string; cloud: string; edge: string }[];
  labels: { cloud: string; edge: string; param: string };
}) {
  const table = (key: "cloud" | "edge") => (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{labels[key]}</caption>
        <thead className="bg-bg-1">
          <tr>
            <th scope="col" className="w-1/3 px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-text-3">
              {labels.param}
            </th>
            <th scope="col" className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-wider text-text-3">
              {labels[key]}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.label} className="transition-colors hover:bg-bg-1/60">
              <th scope="row" className="px-5 py-4 align-top font-normal text-text-2">
                {r.label}
              </th>
              <td className="px-5 py-4 text-text-1 tabular">{r[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Tabs defaultValue="cloud">
      <TabsList aria-label={`${labels.cloud} / ${labels.edge}`}>
        <TabsTrigger value="cloud">
          <Cloud aria-hidden />
          {labels.cloud}
        </TabsTrigger>
        <TabsTrigger value="edge">
          <Cpu aria-hidden />
          {labels.edge}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="cloud">{table("cloud")}</TabsContent>
      <TabsContent value="edge">{table("edge")}</TabsContent>
    </Tabs>
  );
}
