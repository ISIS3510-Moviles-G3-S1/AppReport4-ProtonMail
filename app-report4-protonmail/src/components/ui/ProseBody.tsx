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
      className="rounded px-[0.3em] py-[0.15em] text-[0.85em] font-mono"
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

  return (
    <div className="space-y-3">
      {paragraphs.map(async (para, pi) => {
        const segments = parseSegments(para);
        return (
          <p key={pi} className="text-sm leading-relaxed text-proton-text-secondary">
            {await Promise.all(
              segments.map(async (seg, si) => {
                if (seg.kind === "text") return <span key={si}>{seg.content}</span>;
                return <HighlightedCode key={si} snippet={seg.snippet} />;
              })
            )}
          </p>
        );
      })}
    </div>
  );
}
