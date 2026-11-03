import { NextResponse } from "next/server";
import { createSupportQuery } from "@/lib/firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, category, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, message)." },
        { status: 400 },
      );
    }

    const id = await createSupportQuery({
      name,
      email,
      category: category || "general",
      message,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit support query" },
      { status: 500 },
    );
  }
}
