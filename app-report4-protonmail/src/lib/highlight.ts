import { getSingletonHighlighter } from "shiki";

export type HighlightToken = { content: string; color: string | undefined };

async function getHighlighter() {
  return getSingletonHighlighter({
    themes: ["github-dark-default"],
    langs: ["swift"],
  });
}

export async function tokenizeSwift(code: string): Promise<HighlightToken[]> {
  const hl = await getHighlighter();
  const { tokens } = hl.codeToTokens(code, {
    lang: "swift",
    theme: "github-dark-default",
  });
  return tokens.flat().map((t) => ({ content: t.content, color: t.color }));
}

export async function tokenizeSwiftLines(code: string): Promise<HighlightToken[][]> {
  const hl = await getHighlighter();
  const { tokens } = hl.codeToTokens(code, {
    lang: "swift",
    theme: "github-dark-default",
  });

  return tokens.map((line) => line.map((t) => ({ content: t.content, color: t.color })));
}
