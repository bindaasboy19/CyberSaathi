import type { ReactNode } from "react";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-4">
            <SidebarNav />
          </div>
        </aside>
        <div className="space-y-4">
          <Topbar />
          <SidebarNav mode="mobile" />
          <main className="space-y-6 pb-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
