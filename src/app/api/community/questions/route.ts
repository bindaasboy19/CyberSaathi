import { NextResponse } from "next/server";
import { fetchQuestions, createQuestion } from "@/lib/firebase/firestore";
import { questionSchema } from "@/lib/validation/schemas";

export async function GET() {
  try {
    const questions = await fetchQuestions();
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch questions" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = questionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const { title, description, category } = parsed.data;
    const userId = body.userId || "anonymous";
    const authorName = body.authorName || "Anonymous User";

    const id = await createQuestion({
      title,
      description,
      category,
      userId,
      authorName,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create question" },
      { status: 500 },
    );
  }
}
