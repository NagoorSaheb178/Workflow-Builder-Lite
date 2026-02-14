import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req: Request) {
    try {
        const { input, steps, results, sessionId } = await req.json();

        if (!input || !steps || !results) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("flowrunner");

        const run = {
            input,
            steps,
            results,
            sessionId,
            createdAt: new Date(),
        };

        const result = await db.collection("history").insertOne(run);

        return NextResponse.json({ success: true, id: result.insertedId });
    } catch (err: any) {
        console.error("API Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
