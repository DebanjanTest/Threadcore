import { NextResponse } from "next/server";
import { CATALOG } from "@/lib/catalog-data";

export async function GET() {
  return NextResponse.json(CATALOG, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "X-Schema-Version": CATALOG.schemaVersion,
      "X-Catalog-Id": CATALOG.catalogId,
    },
  });
}
