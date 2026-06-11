"use client";

import { Tree } from "@/components/ui/file-tree";
import type { TreeViewElement } from "@/components/ui/file-tree";

const elements: TreeViewElement[] = [
  {
    id: "catalog",
    type: "folder",
    name: "Data Catalog",
    children: [
      {
        id: "domains",
        type: "folder",
        name: "Domains",
        children: [
          { id: "customer", name: "customer-360" },
          { id: "clinical", name: "clinical-records" },
          { id: "financial", name: "financial-ledger" },
        ],
      },
      {
        id: "governance",
        type: "folder",
        name: "Governance",
        children: [
          { id: "quality", name: "data-quality-rules" },
          { id: "lineage", name: "lineage-map" },
          { id: "access", name: "access-controls" },
        ],
      },
      {
        id: "compliance",
        type: "folder",
        name: "Compliance",
        children: [
          { id: "privacy", name: "privacy-policies" },
          { id: "audit", name: "audit-logs" },
        ],
      },
    ],
  },
];

export function DataCatalogTree() {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border bg-background p-4">
      <Tree
        elements={elements}
        initialExpandedItems={["catalog", "domains", "governance", "compliance"]}
        className="h-[340px] overflow-hidden"
      />
    </div>
  );
}
