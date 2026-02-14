import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const client = await clientPromise;
        const db = client.db("flowrunner");

        const history = await db.collection("history")
            .find({})
            .sort({ createdAt: -1 })
            .limit(20)
            .toArray();

        return NextResponse.json(history);
    } catch (err: any) {
        console.error("API Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
