import { NextResponse } from "next/server";
import { createAnswer } from "@/lib/firebase/firestore";
import { answerSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = answerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const { content } = parsed.data;
    const questionId = body.questionId;
    const userId = body.userId || "anonymous";
    const authorName = body.authorName || "Anonymous User";
    const isExpert = Boolean(body.isExpert);

    if (!questionId) {
      return NextResponse.json({ error: "Missing questionId" }, { status: 400 });
    }

    const id = await createAnswer({
      questionId,
      userId,
      authorName,
      content,
      isExpert,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to post answer" },
      { status: 500 },
    );
  }
}
