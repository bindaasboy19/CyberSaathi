"use client";

import React from "react";
import Founder from "@/components/landing/founder";
import Problem from "@/components/landing/problem";

export default function AboutPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-white pt-10">
      <Founder />
      <Problem />
    </div>
  );
}
