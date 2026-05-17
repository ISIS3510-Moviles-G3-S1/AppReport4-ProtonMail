import type { MemoryFinding } from "@/lib/types";

export type MemoryRamRow = {
  scenario: string;
  estimate: string;
  detail: string;
};

export const memoryLeakFindings: MemoryFinding[] = [
  {
    id: "memory-leak-risks",
    title: "Does the app have memory leaks?",
    category: "leak-risk",
    references: ["4.3 Memory management", "4.4.1 Existing micro-optimizations"],
    body:
      "No confirmed memory leak can be proven without Instruments Leaks or the Xcode Memory Graph. Static analysis shows several good leak-prevention patterns: `MessageBodyReaderView.dismantleUIView` removes script message handlers from `WKWebView`, `MessagePrinter` stores web views in `NSMapTable.strongToWeakObjects()`, many Combine and async closures use `[weak self]`, and sender image caching is bounded to around 30 images.\n\nThe main risks are lifetime-extension issues rather than confirmed leaks. Long-running unstructured `Task` blocks can keep models or views alive longer than intended, `WKWebView` can consume large amounts of memory for complex HTML even without leaking, attachment preview creates temporary files and can increase memory or disk pressure, and `MemoryCache.object(for:)` mutates FIFO ordering inside a concurrent queue `sync` block that deserves thread-safety review.",
  },
  {
    id: "attachment-and-webview-pressure",
    title: "Where memory pressure is most likely to appear",
    category: "ram-consumption",
    references: ["Scenario 3 — Open rich email body", "4.3 Scenario 3"],
    body:
      "The highest RAM pressure comes from rich email rendering and attachment handling. `WKWebView` initializes HTML content, scripts, attachments, and rendering buffers together, so complex newsletters or image-heavy emails can increase temporary allocation substantially. Attachment preview also copies files to temporary storage before preview, so memory and disk pressure scale with attachment size. Search and compose stay lower than rich email rendering, but both keep temporary state active while they are in use.",
  },
  {
    id: "memory-tooling",
    title: "Recommended tools for leak management",
    category: "tooling-recommendation",
    references: ["4.3 Memory management", "4.3 Global Threading Analysis"],
    body:
      "The recommended native tools are Xcode Memory Graph, Instruments Allocations, and Instruments Leaks. Memory Graph snapshots help inspect object reference chains, while Allocations tracks heap and virtual-memory growth over time. Apple also documents command-line tools such as `vmmap` and `leaks` for deeper investigation. Possible debug-only helpers include FBRetainCycleDetector, LifetimeTracker, and LeakDetector. These tools should not replace Instruments, but they can catch regressions earlier during development.",
  },
];

export const memoryRamRows: MemoryRamRow[] = [
  {
    scenario: "Launch / loading",
    estimate: "Medium",
    detail:
      "App state, SDK session setup, skeleton animations, and the first mailbox state create moderate startup RAM usage.",
  },
  {
    scenario: "Mailbox scrolling",
    estimate: "Medium",
    detail:
      "Pagination helps, but loaded items, cached images, and row state remain in memory while scrolling.",
  },
  {
    scenario: "Rich email body",
    estimate: "Medium-high to high",
    detail:
      "`WKWebView` holds HTML, images, scripts, layout state, and rendering buffers, making this the largest memory consumer.",
  },
  {
    scenario: "Search",
    estimate: "Medium",
    detail:
      "Temporary query state, scroller objects, paginated results, and selected message information remain active during search.",
  },
  {
    scenario: "Attachment preview",
    estimate: "Potentially high",
    detail:
      "Large attachments are copied to temporary storage and previewed, so memory pressure scales with attachment size.",
  },
  {
    scenario: "Compose",
    estimate: "Medium",
    detail:
      "Draft text, recipient state, attachment references, and thumbnails remain active; usage increases with attachments.",
  },
];
