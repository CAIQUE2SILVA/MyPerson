import { describe, it, expect } from "vitest";
import {
  estimateTokenCount,
  htmlToMarkdown,
  wantsMarkdown,
} from "./markdown-negotiation";

describe("wantsMarkdown", () => {
  it("retorna true quando Accept inclui text/markdown", () => {
    expect(wantsMarkdown("text/markdown, text/html")).toBe(true);
  });

  it("retorna false para requisições HTML comuns", () => {
    expect(wantsMarkdown("text/html,application/xhtml+xml")).toBe(false);
  });
});

describe("htmlToMarkdown", () => {
  it("converte corpo e inclui frontmatter com metadados", () => {
    const html = `<!DOCTYPE html>
<html>
<head>
  <title>Página de Teste</title>
  <meta name="description" content="Resumo da página" />
</head>
<body>
  <header><nav>Menu</nav></header>
  <main><h1>Título</h1><p>Conteúdo útil.</p></main>
  <footer>Rodapé</footer>
</body>
</html>`;

    const markdown = htmlToMarkdown(html);

    expect(markdown).toContain("title: Página de Teste");
    expect(markdown).toContain("description: Resumo da página");
    expect(markdown).toContain("# Título");
    expect(markdown).toContain("Conteúdo útil.");
    expect(markdown).not.toContain("Menu");
    expect(markdown).not.toContain("Rodapé");
  });

  it("preserva JSON-LD como bloco fenced", () => {
    const html = `<html><head><title>x</title></head><body>
      <p>ok</p>
      <script type="application/ld+json">{"@type":"WebPage"}</script>
    </body></html>`;

    const markdown = htmlToMarkdown(html);

    expect(markdown).toContain("```json");
    expect(markdown).toContain('"@type":"WebPage"');
  });
});

describe("estimateTokenCount", () => {
  it("estima tokens a partir do tamanho do texto", () => {
    expect(estimateTokenCount("abcd")).toBe(1);
    expect(estimateTokenCount("abcdefgh")).toBe(2);
  });
});
