import { NextResponse } from "next/server";
import { fetchLegalCases, createLegalCase } from "@/lib/firebase/firestore";
import { legalCaseSchema } from "@/lib/validation/schemas";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
  }

  try {
    const cases = await fetchLegalCases(userId);
    return NextResponse.json({ cases });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch legal cases" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = legalCaseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const { problemType, description, generatedReport, status } = parsed.data;
    const userId = body.userId;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId in request body" }, { status: 400 });
    }

    const id = await createLegalCase({
      userId,
      problemType,
      description,
      generatedReport,
      status,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create legal case" },
      { status: 500 },
    );
  }
}
