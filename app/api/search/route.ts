import { NextResponse } from "next/server";
import { globalSearch } from "@/lib/services/search.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const results = await globalSearch(query);
  return NextResponse.json(results);
}
