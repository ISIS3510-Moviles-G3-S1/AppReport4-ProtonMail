import { tokenizeSwift, type HighlightToken } from "@/lib/highlight";

type Segment =
  | { kind: "text"; content: string }
  | { kind: "code"; snippet: string };

function parseSegments(text: string): Segment[] {
  const out: Segment[] = [];
  const re = /`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push({ kind: "text", content: text.slice(last, m.index) });
    out.push({ kind: "code", snippet: m[1] });
    last = re.lastIndex;
  }
  if (last < text.length) out.push({ kind: "text", content: text.slice(last) });
  return out;
}

async function HighlightedCode({ snippet }: { snippet: string }) {
  const tokens: HighlightToken[] = await tokenizeSwift(snippet);
  return (
    <code
      className="rounded px-[0.3em] py-[0.15em] text-[0.85em] font-mono break-words"
      style={{ backgroundColor: "rgba(109,74,255,0.14)" }}
    >
      {tokens.map((t, i) => (
        <span key={i} style={{ color: t.color }}>
          {t.content}
        </span>
      ))}
    </code>
  );
}

export async function ProseBody({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);

  // Resolve every paragraph (and its segments) before returning JSX, so we
  // never hand React an array of unresolved promises as children.
  const renderedParagraphs = await Promise.all(
    paragraphs.map(async (para, pi) => {
      const segments = parseSegments(para);
      const renderedSegments = await Promise.all(
        segments.map(async (seg, si) => {
          if (seg.kind === "text") return <span key={si}>{seg.content}</span>;
          return <HighlightedCode key={si} snippet={seg.snippet} />;
        })
      );
      return (
        <p
          key={pi}
          className="text-sm leading-relaxed text-proton-text-secondary break-words"
        >
          {renderedSegments}
        </p>
      );
    })
  );

  return <div className="space-y-3">{renderedParagraphs}</div>;
}
