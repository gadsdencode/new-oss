// components/ai/web-dev-cost-estimator.tsx
"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Calculator,
  CheckCircle2,
  ArrowRight,
  Globe,
  ShoppingCart,
  AppWindow,
  BookOpen,
  MessageSquare,
  Search,
  Sparkles,
  BarChart3,
  Paintbrush,
  Server,
  FileText,
} from "lucide-react";

type SiteType = "marketing" | "ecommerce" | "webapp" | "docs";

interface AiFeatures {
  chatbot: boolean;
  search: boolean;
  recommendations: boolean;
  analytics: boolean;
}

const SITE_TYPE_COSTS: Record<SiteType, number> = {
  marketing: 5000,
  ecommerce: 12000,
  webapp: 15000,
  docs: 4000,
};

const SITE_TYPE_LABELS: Record<SiteType, { label: string; icon: React.ElementType }> = {
  marketing: { label: "Marketing Site", icon: Globe },
  ecommerce: { label: "E-commerce", icon: ShoppingCart },
  webapp: { label: "Web Application", icon: AppWindow },
  docs: { label: "Documentation Portal", icon: BookOpen },
};

const COST_PER_PAGE = 400;

const AI_FEATURE_COSTS: Record<keyof AiFeatures, number> = {
  chatbot: 3000,
  search: 2500,
  recommendations: 4000,
  analytics: 3500,
};

const AI_MONTHLY_COSTS: Record<keyof AiFeatures, number> = {
  chatbot: 200,
  search: 150,
  recommendations: 250,
  analytics: 300,
};

const AI_FEATURE_META: Record<
  keyof AiFeatures,
  { label: string; icon: React.ElementType; color: string }
> = {
  chatbot: { label: "AI Chatbot", icon: MessageSquare, color: "text-purple-500" },
  search: { label: "Intelligent Search", icon: Search, color: "text-cyan-500" },
  recommendations: { label: "Content Recommendations", icon: Sparkles, color: "text-orange-500" },
  analytics: { label: "Predictive Analytics", icon: BarChart3, color: "text-green-500" },
};

const CMS_SETUP_COST = 2000;
const CUSTOM_DESIGN_PREMIUM = 5000;
const MANAGED_HOSTING_MONTHLY = 500;

const TECHNICAL_HOURLY_RATE = 175;
const CONTENT_HOURLY_RATE = 90;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function WebDevCostEstimator() {
  const [siteType, setSiteType] = React.useState<SiteType>("marketing");
  const [pageCount, setPageCount] = React.useState<number[]>([5]);
  const [aiFeatures, setAiFeatures] = React.useState<AiFeatures>({
    chatbot: false,
    search: false,
    recommendations: false,
    analytics: false,
  });
  const [cmsRequired, setCmsRequired] = React.useState(false);
  const [customDesign, setCustomDesign] = React.useState(false);
  const [managedHosting, setManagedHosting] = React.useState(false);

  const baseCost = SITE_TYPE_COSTS[siteType];
  const pageCost = pageCount[0] * COST_PER_PAGE;

  const aiSetupCost = (Object.keys(aiFeatures) as (keyof AiFeatures)[]).reduce(
    (sum, key) => sum + (aiFeatures[key] ? AI_FEATURE_COSTS[key] : 0),
    0,
  );

  const cmsCost = cmsRequired ? CMS_SETUP_COST : 0;
  const designCost = customDesign ? CUSTOM_DESIGN_PREMIUM : 0;

  const totalSetupCost = baseCost + pageCost + aiSetupCost + cmsCost + designCost;

  const aiMonthlyCost = (Object.keys(aiFeatures) as (keyof AiFeatures)[]).reduce(
    (sum, key) => sum + (aiFeatures[key] ? AI_MONTHLY_COSTS[key] : 0),
    0,
  );

  const hostingMonthlyCost = managedHosting ? MANAGED_HOSTING_MONTHLY : 0;
  const totalMonthlyCost = aiMonthlyCost + hostingMonthlyCost;

  const estimatedTechHours = Math.round(totalSetupCost / TECHNICAL_HOURLY_RATE);
  const estimatedContentHours = Math.round(pageCost / CONTENT_HOURLY_RATE);

  const toggleAiFeature = (feature: keyof AiFeatures) => {
    setAiFeatures((prev) => ({ ...prev, [feature]: !prev[feature] }));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Left Column — Controls */}
      <div className="lg:col-span-3 space-y-6">
        {/* Site Type */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Site Type</CardTitle>
            </div>
            <CardDescription>What kind of website are you building?</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={siteType} onValueChange={(v) => setSiteType(v as SiteType)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select site type" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(SITE_TYPE_LABELS) as SiteType[]).map((key) => {
                  const { label, icon: Icon } = SITE_TYPE_LABELS[key];
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span>{label}</span>
                        <span className="text-xs text-muted-foreground">
                          — base {formatCurrency(SITE_TYPE_COSTS[key])}
                        </span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Page Count */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Page Count</CardTitle>
            </div>
            <CardDescription>How many pages does your site need?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="page-slider" className="text-sm font-medium">
                Pages
              </Label>
              <span className="text-sm font-bold text-primary">{pageCount[0]} pages</span>
            </div>
            <Slider
              id="page-slider"
              min={1}
              max={50}
              step={1}
              value={pageCount}
              onValueChange={setPageCount}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 page</span>
              <span>25 pages</span>
              <span>50 pages</span>
            </div>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500/20 to-pink-500/20">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">AI Features</CardTitle>
            </div>
            <CardDescription>
              Toggle the AI capabilities you want bundled into your site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(Object.keys(AI_FEATURE_META) as (keyof AiFeatures)[]).map((key) => {
              const { label, icon: Icon, color } = AI_FEATURE_META[key];
              return (
                <div
                  key={key}
                  className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-primary/10"
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${color}`} />
                    <div className="space-y-1">
                      <Label htmlFor={`ai-${key}`} className="text-sm font-medium cursor-pointer">
                        {label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        +{formatCurrency(AI_FEATURE_COSTS[key])} setup, +
                        {formatCurrency(AI_MONTHLY_COSTS[key])}/mo
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={`ai-${key}`}
                    checked={aiFeatures[key]}
                    onCheckedChange={() => toggleAiFeature(key)}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Add-ons */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                <Paintbrush className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Add-ons</CardTitle>
            </div>
            <CardDescription>Optional extras to level up your project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* CMS */}
            <div className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-gradient-to-r from-blue-500/5 to-transparent border border-primary/10">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="space-y-1">
                  <Label htmlFor="cms-switch" className="text-sm font-medium cursor-pointer">
                    CMS Integration
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    +{formatCurrency(CMS_SETUP_COST)} one-time setup
                  </p>
                </div>
              </div>
              <Switch id="cms-switch" checked={cmsRequired} onCheckedChange={setCmsRequired} />
            </div>

            {/* Custom Design */}
            <div className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-gradient-to-r from-pink-500/5 to-transparent border border-primary/10">
              <div className="flex items-start gap-3">
                <Paintbrush className="h-5 w-5 text-pink-500 mt-0.5" />
                <div className="space-y-1">
                  <Label htmlFor="design-switch" className="text-sm font-medium cursor-pointer">
                    Fully Custom Design
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    +{formatCurrency(CUSTOM_DESIGN_PREMIUM)} premium (vs. template-based)
                  </p>
                </div>
              </div>
              <Switch id="design-switch" checked={customDesign} onCheckedChange={setCustomDesign} />
            </div>

            {/* Managed Hosting */}
            <div className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-gradient-to-r from-cyan-500/5 to-transparent border border-primary/10">
              <div className="flex items-start gap-3">
                <Server className="h-5 w-5 text-cyan-500 mt-0.5" />
                <div className="space-y-1">
                  <Label htmlFor="hosting-switch" className="text-sm font-medium cursor-pointer">
                    Managed Hosting & Maintenance
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    +{formatCurrency(MANAGED_HOSTING_MONTHLY)}/mo
                  </p>
                </div>
              </div>
              <Switch
                id="hosting-switch"
                checked={managedHosting}
                onCheckedChange={setManagedHosting}
              />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Right Column — Sticky Summary */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 space-y-6">
          <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-purple-500/5 via-card to-cyan-500/5">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-cyan-600">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Cost Summary</CardTitle>
              </div>
              <CardDescription>Real-time estimate based on your configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total */}
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">Estimated Project Cost</p>
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                  {formatCurrency(totalSetupCost)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">One-time implementation cost</p>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                  Implementation Breakdown
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Base ({SITE_TYPE_LABELS[siteType].label})
                    </span>
                    <span className="font-medium">{formatCurrency(baseCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {pageCount[0]} pages
                    </span>
                    <span className="font-medium">{formatCurrency(pageCost)}</span>
                  </div>
                  {aiSetupCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AI Features Setup</span>
                      <span className="font-medium">{formatCurrency(aiSetupCost)}</span>
                    </div>
                  )}
                  {cmsRequired && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CMS Integration</span>
                      <span className="font-medium">{formatCurrency(cmsCost)}</span>
                    </div>
                  )}
                  {customDesign && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Custom Design Premium</span>
                      <span className="font-medium">{formatCurrency(designCost)}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Monthly */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                  Monthly Costs
                </h4>
                {totalMonthlyCost > 0 ? (
                  <div className="space-y-2 text-sm">
                    {aiMonthlyCost > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">AI Feature Maintenance</span>
                        <span className="font-medium">{formatCurrency(aiMonthlyCost)}/mo</span>
                      </div>
                    )}
                    {managedHosting && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Managed Hosting</span>
                        <span className="font-medium">
                          {formatCurrency(hostingMonthlyCost)}/mo
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-primary/10">
                      <span className="font-semibold">Total Monthly</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(totalMonthlyCost)}/mo
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recurring costs selected</p>
                )}
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* CTA */}
              <Button size="lg" className="w-full text-base" asChild>
                <Link href="/contact">
                  Request Detailed Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                This is a ballpark estimate. Final pricing depends on specific requirements.
              </p>

              <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Hours Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-500" />
                  Estimated Hours
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Technical work</span>
                    <span className="font-medium">~{estimatedTechHours} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Content work</span>
                    <span className="font-medium">~{estimatedContentHours} hrs</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rate Card + Quick Info */}
          <Card className="overflow-hidden">
            <CardContent className="pt-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Our Rates
              </p>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Technical updates</span>
                  <span className="font-semibold text-foreground">$175.00/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Content-only updates</span>
                  <span className="font-semibold text-foreground">$90.00/hr</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Free initial consultation included</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Flexible payment plans available</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    AI features can be added post-launch
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
