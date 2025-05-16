import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("smart-garbage");
    const body = await req.json();

    const report = {
      ...body,
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection("reports").insertOne(report);

    return NextResponse.json({
      message: "Report saved successfully",
      report: result,
    });
  } catch (error) {
    console.error("❌ Failed to save report:", error);
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }
}
