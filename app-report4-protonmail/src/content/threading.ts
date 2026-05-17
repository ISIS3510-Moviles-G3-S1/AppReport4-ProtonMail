import type { ThreadingFinding } from "@/lib/types";

export const threadingFindings: ThreadingFinding[] = [
  {
    id: "threading-usage",
    title: "Where threads or async features are used",
    category: "thread-creation",
    references: ["Global Threading Analysis"],
    body:
      "The application uses Swift concurrency and asynchronous patterns extensively. `Task` blocks appear in `AppDelegate`, `SceneDelegate`, `MailboxModel`, `SearchModel`, `ConversationDetailModel`, `HomeScreen`, sender image loading, and user actions. `@MainActor` is used heavily for UI models so that state changes affecting SwiftUI rendering occur on the correct thread. `AsyncStream` is used in `ScrollerUpdatesAsync` to consume mailbox scroller updates. Actors are used in services such as `DeviceTokenRegistrar`, `LegacyMigrationService`, `SettingsMigrator`, and `MainKeyUnlocker`. Combine uses `.receive(on: DispatchQueue.main)` for UI updates. `MemoryCache` uses a concurrent `DispatchQueue` with barrier writes, and `NetworkMonitoringService` uses a dedicated queue.",
  },
  {
    id: "threading-stalls",
    title: "Possible main-thread locks or stalls",
    category: "main-thread-stall",
    references: ["Global Threading Analysis"],
    body:
      "The most important possible main-thread stall is `AttachmentViewLoader.load()`, which runs on `@MainActor` and performs synchronous file copying after fetching an attachment. Large attachments could block UI responsiveness. `MemoryCache.object(for:)` uses `queue.sync`, so frequent cache reads could briefly block callers. `WKWebView` height updates send messages back to the main actor and can trigger layout changes. Search and mailbox scroller callbacks also update SwiftUI state on the main actor; large batches of updates could create UI bursts.",
  },
  {
    id: "threading-effect",
    title: "Effect of async and multithreading on performance",
    category: "effect-analysis",
    references: ["Global Threading Analysis", "Technical Audit"],
    body:
      "The app benefits from async usage because network work, SDK operations, live queries, search, mailbox updates, and image loading are separated from immediate UI interaction. This should improve responsiveness and reduce visible blocking. However, the same architecture introduces coordination risk: too many unstructured tasks or too many main-actor updates during scrolling and searching can cause frame drops, higher CPU usage, and increased power consumption. The best optimization would be to keep expensive I/O and file operations off the main actor, debounce search updates, cancel obsolete tasks, and batch UI updates where possible.",
  },
];
