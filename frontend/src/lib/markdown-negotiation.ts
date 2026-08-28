import * as cheerio from "cheerio";
import TurndownService from "turndown";

const NON_CONTENT_SELECTORS =
  "script, style, nav, header, footer, noscript, svg, iframe";

/** ponytail: estimativa chars/4 — trocar por tokenizer se precisar de precisão */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

function yamlValue(value: string): string {
  if (/[:#\n\r"'\\]/.test(value)) {
    return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return value;
}

function buildFrontmatter(meta: {
  title?: string;
  description?: string;
  image?: string;
}): string {
  const lines: string[] = [];
  if (meta.title) lines.push(`title: ${yamlValue(meta.title)}`);
  if (meta.description) lines.push(`description: ${yamlValue(meta.description)}`);
  if (meta.image) lines.push(`image: ${yamlValue(meta.image)}`);

  if (lines.length === 0) return "";
  return `---\n${lines.join("\n")}\n---\n\n`;
}

function extractJsonLd($: cheerio.CheerioAPI): string {
  const blocks: string[] = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).html()?.trim();
    if (raw) blocks.push(raw);
  });

  if (blocks.length === 0) return "";
  return `\n\n\`\`\`json\n${blocks.join("\n")}\n\`\`\``;
}

function extractMetadata($: cheerio.CheerioAPI) {
  const title =
    $("title").first().text().trim() ||
    $('meta[property="og:title"]').attr("content")?.trim();
  const description =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim();
  const image = $('meta[property="og:image"]').attr("content")?.trim();

  return { title, description, image };
}

export function htmlToMarkdown(html: string): string {
  const $ = cheerio.load(html);
  const metadata = extractMetadata($);
  const jsonLd = extractJsonLd($);

  $(NON_CONTENT_SELECTORS).remove();

  const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
  const bodyHtml = $("body").html() ?? "";
  const bodyMarkdown = turndown.turndown(bodyHtml).trim();

  const frontmatter = buildFrontmatter(metadata);
  const parts = [frontmatter + bodyMarkdown, jsonLd].filter(Boolean);

  return parts.join("").trim() + "\n";
}

export function wantsMarkdown(acceptHeader: string | null): boolean {
  if (!acceptHeader) return false;
  return acceptHeader
    .split(",")
    .some((part) => part.trim().split(";")[0].trim() === "text/markdown");
}
