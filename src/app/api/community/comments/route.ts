import { NextResponse } from "next/server";
import { createComment } from "@/lib/firebase/firestore";
import { commentSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const { text } = parsed.data;
    const parentId = body.parentId;
    const userId = body.userId || "anonymous";
    const authorName = body.authorName || "Anonymous User";

    if (!parentId) {
      return NextResponse.json({ error: "Missing parentId" }, { status: 400 });
    }

    const id = await createComment({
      parentId,
      userId,
      authorName,
      text,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create comment" },
      { status: 500 },
    );
  }
}
