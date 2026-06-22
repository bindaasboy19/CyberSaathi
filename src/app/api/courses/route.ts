import { NextResponse } from "next/server";
import { fetchDbCourses } from "@/lib/firebase/firestore";

export async function GET() {
  try {
    const courses = await fetchDbCourses();
    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch courses" },
      { status: 500 },
    );
  }
}
