import { NextResponse } from "next/server";
import { fetchAllDbUserProgress, saveDbUserProgress } from "@/lib/firebase/firestore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
  }

  try {
    const progress = await fetchAllDbUserProgress(userId);
    return NextResponse.json({ progress });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch progress" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const progress = await request.json();
    if (!progress.userId || !progress.courseId) {
      return NextResponse.json({ error: "Missing userId or courseId" }, { status: 400 });
    }
    await saveDbUserProgress(progress);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save progress" },
      { status: 500 },
    );
  }
}
