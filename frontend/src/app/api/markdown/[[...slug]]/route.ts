import { NextRequest } from "next/server";
import {
  estimateTokenCount,
  htmlToMarkdown,
} from "@/lib/markdown-negotiation";

export const runtime = "nodejs";

const SKIP_HEADER = "x-markdown-skip";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await context.params;
  const path = slug?.length ? `/${slug.join("/")}` : "/";
  const query = request.nextUrl.search;

  const htmlUrl = new URL(`${path}${query}`, request.nextUrl.origin);
  const htmlResponse = await fetch(htmlUrl, {
    headers: {
      Accept: "text/html",
      [SKIP_HEADER]: "1",
    },
    cache: "no-store",
  });

  if (!htmlResponse.ok) {
    return new Response(htmlResponse.statusText, { status: htmlResponse.status });
  }

  const html = await htmlResponse.text();
  const markdown = htmlToMarkdown(html);
  const markdownTokens = estimateTokenCount(markdown);
  const originalTokens = estimateTokenCount(html);

  return new Response(markdown, {
    status: htmlResponse.status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "x-markdown-tokens": String(markdownTokens),
      "x-original-tokens": String(originalTokens),
    },
  });
}
