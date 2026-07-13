"use client";

import { Button } from "@/components/ui/button";

// ponytail: reports/invoices are browser print-to-PDF — no PDF library needed
export function PrintButton({ label }: { label: string }) {
  return (
    <Button onClick={() => window.print()} className="print:hidden">
      {label}
    </Button>
  );
}
