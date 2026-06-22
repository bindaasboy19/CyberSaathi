import { NextResponse } from "next/server";
import {
  fetchUserProfile,
  fetchSupportQueries,
  fetchAllReports,
  fetchAllLegalCases,
} from "@/lib/firebase/firestore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized: Missing userId" }, { status: 401 });
  }

  try {
    const profile = await fetchUserProfile(userId);
    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Administrator role required" }, { status: 403 });
    }

    const [supportQueries, reports, legalCases] = await Promise.all([
      fetchSupportQueries().catch(() => []),
      fetchAllReports().catch(() => []),
      fetchAllLegalCases().catch(() => []),
    ]);

    return NextResponse.json({
      supportQueries,
      reports,
      legalCases,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load admin logs" },
      { status: 500 },
    );
  }
}
