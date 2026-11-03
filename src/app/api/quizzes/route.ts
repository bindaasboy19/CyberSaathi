import { NextResponse } from "next/server";
import { fetchDbQuizzes } from "@/lib/firebase/firestore";

export async function GET() {
  try {
    const quizzes = await fetchDbQuizzes();
    return NextResponse.json({ quizzes });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch quizzes" },
      { status: 500 },
    );
  }
}
