"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export function ServicesSummaryCard() {
  return (
    <Card className="bg-muted/50 border-primary/20">
      <CardHeader>
        <CardTitle>Our AI & Consulting Services</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" /> AI Strategy & Roadmap
        </p>
        <p className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" /> AI Implementation
        </p>
        <p className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" /> AI Operations & Optimization
        </p>
        <p className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" /> AI Training & Enablement
        </p>
        <p className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" /> AI Governance & Ethics
        </p>
        <p className="flex items-center gap-2">
          <Check className="h-4 w-4 text-primary" /> AI Analytics & Insights
        </p>
      </CardContent>
    </Card>
  );
}

