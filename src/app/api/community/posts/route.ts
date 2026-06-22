import { NextResponse } from "next/server";
import { fetchPosts, createPost } from "@/lib/firebase/firestore";
import { postSchema } from "@/lib/validation/schemas";

export async function GET() {
  try {
    const posts = await fetchPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch posts" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const { title, content, type, tags } = parsed.data;
    const authorId = body.authorId || "anonymous";
    const authorName = body.authorName || "Anonymous User";

    const id = await createPost({
      title,
      content,
      type,
      authorId,
      authorName,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create post" },
      { status: 500 },
    );
  }
}
