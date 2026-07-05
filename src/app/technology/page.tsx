"use client";

import React from "react";
import AIShowcase from "@/components/landing/ai-showcase";
import Comparison from "@/components/landing/comparison";

export default function TechnologyPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-white pt-10">
      <AIShowcase />
      <Comparison />
    </div>
  );
}
