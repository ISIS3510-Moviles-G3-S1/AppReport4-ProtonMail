import type { ReactNode } from "react";

type Segment =
  | { kind: "text"; content: string }
  | { kind: "code"; content: string };

function parseInlineMarkdown(text: string): Segment[] {
  const segments: Segment[] = [];
  const parts = text.split("`");

  for (let index = 0; index < parts.length; index += 1) {
    const content = parts[index];
    if (index % 2 === 0) {
      if (content) segments.push({ kind: "text", content });
    } else {
      segments.push({ kind: "code", content });
    }
  }

  return segments;
}

export function InlineMarkdown({ text }: { text: string }) {
  const segments = parseInlineMarkdown(text);

  return (
    <>
      {segments.map((segment, index) =>
        segment.kind === "text" ? (
          <span key={index}>{segment.content}</span>
        ) : (
          <code
            key={index}
            className="rounded bg-[#1b1f2b] px-1.5 py-0.5 text-[0.85em] font-mono text-[#c8d0ff] break-words"
          >
            {segment.content}
          </code>
        )
      )}
    </>
  );
}

export function InlineMarkdownBlock({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <p className={className}>
      <InlineMarkdown text={text} />
    </p>
  );
}
