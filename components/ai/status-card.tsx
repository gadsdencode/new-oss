"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Database, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusCardProps {
  status: string;
  database: string;
  ai_endpoint: string;
}

export function StatusCard({ status, database, ai_endpoint }: StatusCardProps) {
  return (
    <Card className="bg-muted/50 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Overall Status</span>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            {status}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Database</span>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            {database}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">AI Endpoint</span>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            {ai_endpoint}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

