"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Internal page — demo strings are intentionally not localized.
export function StyleguideInteractive() {
  return (
    <div className="mt-10 grid gap-8 md:grid-cols-2">
      <div className="space-y-6">
        <Tabs defaultValue="cloud">
          <TabsList aria-label="Deployment">
            <TabsTrigger value="cloud">Cloud</TabsTrigger>
            <TabsTrigger value="edge">Edge</TabsTrigger>
            <TabsTrigger value="onprem">On-prem</TabsTrigger>
          </TabsList>
          <TabsContent value="cloud" className="text-sm text-text-2">Cloud params…</TabsContent>
          <TabsContent value="edge" className="text-sm text-text-2">Edge params…</TabsContent>
          <TabsContent value="onprem" className="text-sm text-text-2">On-prem params…</TabsContent>
        </Tabs>
        <Select>
          <SelectTrigger aria-label="Deployment" className="max-w-xs">
            <SelectValue placeholder="Select deployment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cloud">Cloud API</SelectItem>
            <SelectItem value="onprem">On-premises</SelectItem>
            <SelectItem value="edge">Edge box</SelectItem>
          </SelectContent>
        </Select>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog</DialogTitle>
            <DialogDescription>Hairline border, bg-1, backdrop blur.</DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Does it run offline?</AccordionTrigger>
          <AccordionContent>Yes — edge boxes buffer results and sync when the link returns.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Which inputs are supported?</AccordionTrigger>
          <AccordionContent>RTSP, ONVIF, MP4/H.264/H.265 files and image batches.</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
