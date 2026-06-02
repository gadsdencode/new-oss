"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Database, 
  Server, 
  Zap, 
  Cpu,
  Cloud,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code,
  Brain,
  Globe
} from "lucide-react";
import Link from "next/link";

// Extended model type with all latest models (2024-2025)
type BaseModel = 
  // Meta Llama Models
  | "llama-3.3-70b"
  | "llama-4-scout"
  | "llama-4-maverick"
  // Mistral Models (Latest 2024-2025)
  | "mistral-large-3"
  | "mistral-medium-3"
  | "mistral-small-3"
  | "codestral-25.08"
  | "ministral-8b"
  // OpenAI Models
  | "gpt-4o-finetune"
  | "gpt-4o-mini-finetune"
  // DeepSeek Models
  | "deepseek-v3"
  | "deepseek-r1"
  // Qwen Models
  | "qwen-2.5-72b";

interface Features {
  ragEnabled: boolean;
  apiIntegration: boolean;
  hosting: boolean;
}

interface ModelConfig {
  name: string;
  shortName: string;
  setupMultiplier: number;
  monthlyMultiplier: number;
  isApiOnly: boolean;
  isOpenSource: boolean;
  parameters: string;
  contextWindow: string;
  specialty: string;
  color: string;
}

// Comprehensive model configurations with latest 2024-2025 models
const MODEL_CONFIGS: Record<BaseModel, ModelConfig> = {
  // ============ META LLAMA MODELS ============
  "llama-3.3-70b": { 
    name: "Llama 3.3 (70B)", 
    shortName: "Llama 3.3",
    setupMultiplier: 1.3, 
    monthlyMultiplier: 1.0,
    isApiOnly: false,
    isOpenSource: true,
    parameters: "70B",
    contextWindow: "128K",
    specialty: "General Purpose",
    color: "text-primary-500"
  },
  "llama-4-scout": { 
    name: "Llama 4 Scout (109B)", 
    shortName: "Llama 4 Scout",
    setupMultiplier: 1.6, 
    monthlyMultiplier: 1.2,
    isApiOnly: false,
    isOpenSource: true,
    parameters: "109B (17B active)",
    contextWindow: "10M",
    specialty: "Long Context",
    color: "text-primary-500"
  },
  "llama-4-maverick": { 
    name: "Llama 4 Maverick (400B)", 
    shortName: "Llama 4 Maverick",
    setupMultiplier: 2.0, 
    monthlyMultiplier: 1.5,
    isApiOnly: false,
    isOpenSource: true,
    parameters: "400B (17B active)",
    contextWindow: "1M",
    specialty: "Multimodal MoE",
    color: "text-primary-500"
  },
  
  // ============ MISTRAL MODELS (Latest 2024-2025) ============
  "mistral-large-3": { 
    name: "Mistral Large 3 (675B MoE)", 
    shortName: "Mistral Large 3",
    setupMultiplier: 2.2, 
    monthlyMultiplier: 1.6,
    isApiOnly: false,
    isOpenSource: true,
    parameters: "41B active / 675B total",
    contextWindow: "256K",
    specialty: "Flagship Multimodal",
    color: "text-orange-500"
  },
  "mistral-medium-3": { 
    name: "Mistral Medium 3", 
    shortName: "Mistral Medium 3",
    setupMultiplier: 1.4, 
    monthlyMultiplier: 1.0,
    isApiOnly: false,
    isOpenSource: false,
    parameters: "Not Disclosed",
    contextWindow: "128K",
    specialty: "8x Lower Cost",
    color: "text-amber-500"
  },
  "mistral-small-3": { 
    name: "Mistral Small 3", 
    shortName: "Mistral Small 3",
    setupMultiplier: 1.0, 
    monthlyMultiplier: 0.8,
    isApiOnly: false,
    isOpenSource: false,
    parameters: "~22B",
    contextWindow: "128K",
    specialty: "Enterprise Compact",
    color: "text-yellow-500"
  },
  "codestral-25.08": { 
    name: "Codestral 25.08", 
    shortName: "Codestral",
    setupMultiplier: 1.5, 
    monthlyMultiplier: 1.1,
    isApiOnly: false,
    isOpenSource: false,
    parameters: "22B",
    contextWindow: "256K",
    specialty: "Code Generation",
    color: "text-cyan-500"
  },
  "ministral-8b": { 
    name: "Ministral 8B", 
    shortName: "Ministral 8B",
    setupMultiplier: 0.8, 
    monthlyMultiplier: 0.6,
    isApiOnly: false,
    isOpenSource: true,
    parameters: "8B",
    contextWindow: "128K",
    specialty: "Edge Deployment",
    color: "text-teal-500"
  },
  
  // ============ OPENAI MODELS ============
  "gpt-4o-finetune": { 
    name: "GPT-4o Fine-tune", 
    shortName: "GPT-4o",
    setupMultiplier: 2.5, 
    monthlyMultiplier: 2.0,
    isApiOnly: true,
    isOpenSource: false,
    parameters: "Not Disclosed",
    contextWindow: "128K",
    specialty: "Multimodal Flagship",
    color: "text-green-500"
  },
  "gpt-4o-mini-finetune": { 
    name: "GPT-4o mini Fine-tune", 
    shortName: "GPT-4o mini",
    setupMultiplier: 1.5, 
    monthlyMultiplier: 1.2,
    isApiOnly: true,
    isOpenSource: false,
    parameters: "Not Disclosed",
    contextWindow: "128K",
    specialty: "Cost-Efficient",
    color: "text-emerald-500"
  },
  
  // ============ DEEPSEEK MODELS ============
  "deepseek-v3": { 
    name: "DeepSeek V3 (671B MoE)", 
    shortName: "DeepSeek V3",
    setupMultiplier: 1.8, 
    monthlyMultiplier: 0.9,
    isApiOnly: false,
    isOpenSource: true,
    parameters: "671B (37B active)",
    contextWindow: "128K",
    specialty: "Cost-Effective",
    color: "text-blue-500"
  },
  "deepseek-r1": { 
    name: "DeepSeek R1 (Reasoning)", 
    shortName: "DeepSeek R1",
    setupMultiplier: 1.9, 
    monthlyMultiplier: 1.0,
    isApiOnly: false,
    isOpenSource: true,
    parameters: "671B (37B active)",
    contextWindow: "128K",
    specialty: "Advanced Reasoning",
    color: "text-sky-500"
  },
  
  // ============ QWEN MODELS ============
  "qwen-2.5-72b": { 
    name: "Qwen 2.5 (72B)", 
    shortName: "Qwen 2.5",
    setupMultiplier: 1.4, 
    monthlyMultiplier: 0.9,
    isApiOnly: false,
    isOpenSource: true,
    parameters: "72B",
    contextWindow: "128K",
    specialty: "Multilingual",
    color: "text-rose-500"
  },
};

// Pricing constants
const BASE_SETUP_FEE = 5000;
const COST_PER_RECORD = 0.05;
const RAG_SETUP_FEE = 2500;
const RAG_MONTHLY_FEE = 500;
const API_INTEGRATION_FEE = 3000;
const BASE_HOSTING_MONTHLY_FEE = 800;

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}k`;
  }
  return num.toString();
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function LLMCostEstimator() {
  const [datasetSize, setDatasetSize] = React.useState<number[]>([100000]);
  const [baseModel, setBaseModel] = React.useState<BaseModel>("llama-3.3-70b");
  const [features, setFeatures] = React.useState<Features>({
    ragEnabled: false,
    apiIntegration: false,
    hosting: false,
  });

  // Calculate costs
  const modelConfig = MODEL_CONFIGS[baseModel];
  
  // One-time setup costs
  const baseSetup = BASE_SETUP_FEE * modelConfig.setupMultiplier;
  const datasetCost = datasetSize[0] * COST_PER_RECORD;
  const ragSetup = features.ragEnabled ? RAG_SETUP_FEE : 0;
  const apiSetup = features.apiIntegration ? API_INTEGRATION_FEE : 0;
  
  const totalSetupCost = baseSetup + datasetCost + ragSetup + apiSetup;
  
  // Monthly recurring costs with model-specific multiplier
  const ragMonthly = features.ragEnabled ? RAG_MONTHLY_FEE : 0;
  const hostingMonthly = features.hosting && !modelConfig.isApiOnly 
    ? BASE_HOSTING_MONTHLY_FEE * modelConfig.monthlyMultiplier 
    : 0;
  
  const totalMonthlyCost = ragMonthly + hostingMonthly;

  const handleFeatureToggle = (feature: keyof Features) => {
    setFeatures((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  // Model option renderer
  const renderModelOption = (modelKey: BaseModel) => {
    const config = MODEL_CONFIGS[modelKey];
    return (
      <SelectItem key={modelKey} value={modelKey}>
        <div className="flex items-center gap-2">
          <Sparkles className={`h-4 w-4 ${config.color}`} />
          <span className="font-medium">{config.shortName}</span>
          <span className="text-xs text-muted-foreground">— {config.specialty}</span>
        </div>
      </SelectItem>
    );
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Left Column - Controls */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="overflow-hidden">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-cyan-500/20">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Dataset Configuration</CardTitle>
            </div>
            <CardDescription>
              Specify the size of your training dataset for fine-tuning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dataset-slider" className="text-sm font-medium">
                  Dataset Size
                </Label>
                <span className="text-sm font-bold text-primary">
                  {formatNumber(datasetSize[0])} records
                </span>
              </div>
              <Slider
                id="dataset-slider"
                min={0}
                max={1000000}
                step={10000}
                value={datasetSize}
                onValueChange={setDatasetSize}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0 records</span>
                <span>500k records</span>
                <span>1M records</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-500/20">
                <Cpu className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Base Model Selection</CardTitle>
            </div>
            <CardDescription>
              Choose from the latest 2024-2025 foundation models for your custom LLM solution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={baseModel} onValueChange={(value: BaseModel) => setBaseModel(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                {/* Mistral Models Group */}
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2 text-orange-500">
                    <Globe className="h-3 w-3" />
                    Mistral AI (Latest 2024-2025)
                  </SelectLabel>
                  {renderModelOption("mistral-large-3")}
                  {renderModelOption("mistral-medium-3")}
                  {renderModelOption("mistral-small-3")}
                  {renderModelOption("codestral-25.08")}
                  {renderModelOption("ministral-8b")}
                </SelectGroup>
                
                {/* Meta Llama Models Group */}
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2 text-primary-500 mt-2">
                    <Brain className="h-3 w-3" />
                    Meta Llama (Latest)
                  </SelectLabel>
                  {renderModelOption("llama-3.3-70b")}
                  {renderModelOption("llama-4-scout")}
                  {renderModelOption("llama-4-maverick")}
                </SelectGroup>
                
                {/* OpenAI Models Group */}
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2 text-green-500 mt-2">
                    <Sparkles className="h-3 w-3" />
                    OpenAI Fine-tuning
                  </SelectLabel>
                  {renderModelOption("gpt-4o-finetune")}
                  {renderModelOption("gpt-4o-mini-finetune")}
                </SelectGroup>
                
                {/* DeepSeek Models Group */}
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2 text-blue-500 mt-2">
                    <Code className="h-3 w-3" />
                    DeepSeek (Open Source)
                  </SelectLabel>
                  {renderModelOption("deepseek-v3")}
                  {renderModelOption("deepseek-r1")}
                </SelectGroup>
                
                {/* Qwen Models Group */}
                <SelectGroup>
                  <SelectLabel className="flex items-center gap-2 text-rose-500 mt-2">
                    <Globe className="h-3 w-3" />
                    Alibaba Qwen
                  </SelectLabel>
                  {renderModelOption("qwen-2.5-72b")}
                </SelectGroup>
              </SelectContent>
            </Select>
            
            {/* Model Info Badge */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="text-xs">
                <Cpu className="h-3 w-3 mr-1" />
                {modelConfig.parameters}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Database className="h-3 w-3 mr-1" />
                {modelConfig.contextWindow} context
              </Badge>
              {modelConfig.isOpenSource && (
                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                  Open Source
                </Badge>
              )}
              {modelConfig.isApiOnly && (
                <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600 border-blue-500/20">
                  <Cloud className="h-3 w-3 mr-1" />
                  API Only
                </Badge>
              )}
            </div>
            
            {modelConfig.isApiOnly && (
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Cloud className="h-3 w-3" />
                API-based model — No self-hosting fees required
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-primary-500/20">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Additional Features</CardTitle>
            </div>
            <CardDescription>
              Enhance your LLM solution with optional add-ons
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* RAG Toggle */}
            <div className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-gradient-to-r from-primary-500/5 to-transparent border border-primary/10">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-primary-500 mt-0.5" />
                <div className="space-y-1">
                  <Label htmlFor="rag-switch" className="text-sm font-medium cursor-pointer">
                    RAG / Vector Database Setup
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    +{formatCurrency(RAG_SETUP_FEE)} setup, +{formatCurrency(RAG_MONTHLY_FEE)}/mo maintenance
                  </p>
                </div>
              </div>
              <Switch
                id="rag-switch"
                checked={features.ragEnabled}
                onCheckedChange={() => handleFeatureToggle("ragEnabled")}
              />
            </div>

            {/* API Integration Toggle */}
            <div className="flex items-center justify-between space-x-4 p-4 rounded-lg bg-gradient-to-r from-accent-500/5 to-transparent border border-primary/10">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-accent-500 mt-0.5" />
                <div className="space-y-1">
                  <Label htmlFor="api-switch" className="text-sm font-medium cursor-pointer">
                    Custom API Endpoint Development
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    +{formatCurrency(API_INTEGRATION_FEE)} one-time setup
                  </p>
                </div>
              </div>
              <Switch
                id="api-switch"
                checked={features.apiIntegration}
                onCheckedChange={() => handleFeatureToggle("apiIntegration")}
              />
            </div>

            {/* Hosting Toggle */}
            <div className={`flex items-center justify-between space-x-4 p-4 rounded-lg bg-gradient-to-r from-cyan-500/5 to-transparent border border-primary/10 transition-opacity ${modelConfig.isApiOnly ? "opacity-50" : ""}`}>
              <div className="flex items-start gap-3">
                <Server className="h-5 w-5 text-cyan-500 mt-0.5" />
                <div className="space-y-1">
                  <Label 
                    htmlFor="hosting-switch" 
                    className={`text-sm font-medium ${modelConfig.isApiOnly ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    Managed Hosting & Maintenance
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {modelConfig.isApiOnly 
                      ? "Not available for API-based models" 
                      : `+${formatCurrency(Math.round(BASE_HOSTING_MONTHLY_FEE * modelConfig.monthlyMultiplier))}/mo hosting & support`}
                  </p>
                </div>
              </div>
              <Switch
                id="hosting-switch"
                checked={features.hosting}
                onCheckedChange={() => handleFeatureToggle("hosting")}
                disabled={modelConfig.isApiOnly}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Sticky Summary */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 space-y-6">
          <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary-500/5 via-card to-secondary-500/5">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-secondary-600">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Cost Summary</CardTitle>
              </div>
              <CardDescription>
                Real-time estimate based on your configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total Price Display */}
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground mb-2">Estimated Total Investment</p>
                <div className="text-4xl sm:text-5xl font-bold text-primary">
                  {formatCurrency(totalSetupCost)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">One-time implementation cost</p>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Implementation Cost Breakdown */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary-500" />
                  Implementation Cost
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Setup ({modelConfig.shortName})</span>
                    <span className="font-medium">{formatCurrency(baseSetup)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dataset Processing</span>
                    <span className="font-medium">{formatCurrency(datasetCost)}</span>
                  </div>
                  {features.ragEnabled && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">RAG Setup</span>
                      <span className="font-medium">{formatCurrency(ragSetup)}</span>
                    </div>
                  )}
                  {features.apiIntegration && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">API Development</span>
                      <span className="font-medium">{formatCurrency(apiSetup)}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Monthly OpEx */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-500" />
                  Monthly OpEx
                </h4>
                {totalMonthlyCost > 0 ? (
                  <div className="space-y-2 text-sm">
                    {features.ragEnabled && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">RAG Maintenance</span>
                        <span className="font-medium">{formatCurrency(ragMonthly)}/mo</span>
                      </div>
                    )}
                    {features.hosting && !modelConfig.isApiOnly && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Managed Hosting</span>
                        <span className="font-medium">{formatCurrency(Math.round(hostingMonthly))}/mo</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-primary/10">
                      <span className="font-semibold">Total Monthly</span>
                      <span className="font-bold text-primary">{formatCurrency(Math.round(totalMonthlyCost))}/mo</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No recurring costs selected
                  </p>
                )}
              </div>

              <Separator className="bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* CTA Button */}
              <Button size="lg" className="w-full text-base" asChild>
                <Link href="/contact">
                  Request Detailed Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                This is a ballpark estimate. Final pricing depends on specific requirements.
              </p>
            </CardContent>
          </Card>

          {/* Quick Info Card */}
          <Card className="overflow-hidden">
            <CardContent className="pt-6">
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
                  <span className="text-muted-foreground">Enterprise discounts for large projects</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
