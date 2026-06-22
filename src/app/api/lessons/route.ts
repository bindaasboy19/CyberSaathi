import { NextResponse } from "next/server";
import { fetchDbLessons } from "@/lib/firebase/firestore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId parameter" }, { status: 400 });
  }

  try {
    const lessons = await fetchDbLessons(courseId);
    return NextResponse.json({ lessons });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch lessons" },
      { status: 500 },
    );
  }
}
