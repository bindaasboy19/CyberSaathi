"use client";

import React from "react";
import LegalDocs from "@/components/landing/legal-docs";

export default function TermsPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-white pt-10">
      <LegalDocs initialTab="terms" />
    </div>
  );
}
