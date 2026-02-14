import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        backend: "healthy",
        mongodb: "connected",
        llm: "connected",
        timestamp: new Date().toISOString()
    });
}
