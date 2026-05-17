import type { MicroOpt } from "@/lib/types";

export const microOptimizations: MicroOpt[] = [
  {
    id: "bounded-in-memory-cache",
    category: "existing",
    title: "Bounded in-memory cache (≈30 entries)",
    location: {
      file: "Modules/App/Sources/Utils/Cache/MemoryCache.swift",
    },
    what:
      "The `MemoryCache` backs `senderImageCache` and is bounded to a fixed entry count.",
    why:
      "Removes repeated disk I/O and image decoding without architectural changes; bounds RAM for accounts with many distinct senders.",
    purpose: "Predictable RAM, smoother perceived scroll.",
  },
  {
    id: "concurrent-dispatchqueue-barrier-writes",
    category: "existing",
    title: "Concurrent `DispatchQueue` with barrier writes",
    location: {
      file: "Modules/App/Sources/Utils/Cache/MemoryCache.swift",
    },
    what: "Reads use `queue.sync`, writes use `queue.async(flags: .barrier)`.",
    why: "Strictly faster than a serial queue for read-heavy workloads.",
    purpose: "Thread safety without exclusive-access cost on every lookup.",
  },
  {
    id: "nsmaptable-strong-to-weak",
    category: "existing",
    title: "`NSMapTable.strongToWeakObjects()` in `MessagePrinter`",
    location: {
      file: "Modules/App/Sources/Services/MessagePrinter",
    },
    what: "Web views are held in strong-to-weak map table.",
    why: "`WKWebView` is large; strong storage participates in retain cycles.",
    purpose: "Prevent a WebKit retain cycle without changing the printing API.",
  },
  {
    id: "pervasive-weak-self-captures",
    category: "existing",
    title: "Pervasive `[weak self]` captures",
    location: {
      file: "MailboxModel", 
    },
    what: "Long-lived closures capture `self` weakly.",
    why: "Breaks reference cycles between publishers/tasks and their owning view models.",
    purpose: "Prompt deallocation of view models when their view leaves the hierarchy.",
  },
  {
    id: "explicit-script-message-handler-cleanup",
    category: "existing",
    title: "Explicit script-message-handler cleanup",
    location: {
      file: "Modules/App/Sources/UI/Views/MessageBody/MessageBodyReaderView.swift",
    },
    what: "`dismantleUIView` removes registered `WKScriptMessageHandler` instances.",
    why: "`WKUserContentController` strongly retains handlers, which retain `self`.",
    purpose: "Release web view, content controller, and handler together on view dismantle.",
  },
  {
    id: "pagination-mailbox-search-results",
    category: "existing",
    title: "Pagination of mailbox and search results",
    location: {
      file: "MailboxModel, SearchModel",
    },
    what: "Lists fetch and render only the pages relevant to the visible scroll position.",
    why: "Bounds working set regardless of total inbox size.",
    purpose: "Flat RAM and render cost as inbox size grows.",
  },
  {
    id: "orderedset-deque-swift-collections",
    category: "existing",
    title: "`OrderedSet` / `Deque` from `swift-collections`",
    location: {
      file: "Mail-list data paths (see R2 §2.5.8)",
    },
    what: "Replaces `Array` where front-of-list operations or ordered uniqueness dominate.",
    why: "Matches data structure to access pattern; front insertion is `O(1)` on `Deque` vs `O(n)` on `Array`.",
    purpose: "Lower per-operation cost on large mail collections.",
  },
  {
    id: "cache-nsregularexpression",
    category: "tier-1-allocation",
    title: "Cache `NSRegularExpression` in `preProcessedHTML`",
    location: {
      file: "Modules/InboxWebView/Sources/preProcessedHTML.swift",
    },
    what:
      "Hoist the HTTPS-URL regex to a file-scope `let` constant.",
    before: {
      language: "swift",
      code: `public func preProcessedHTML(rawHTML: String) -> String {
    var modifiedHTML = rawHTML

    let httpsURLPattern = #"https://[^"'\\s<>)]+"#
    let regex = try! NSRegularExpression(pattern: httpsURLPattern, options: [])
    let nsString = modifiedHTML as NSString
    let matches = regex.matches(in: modifiedHTML, options: [], range: NSRange(location: 0, length: nsString.length))
    // ...
}`,
    },
    after: {
      language: "swift",
      code: `private let httpsURLRegex = try! NSRegularExpression(pattern: #"https://[^"'\\s<>)]+"#, options: [])

public func preProcessedHTML(rawHTML: String) -> String {
    var modifiedHTML = rawHTML

    let nsString = modifiedHTML as NSString
    let matches = httpsURLRegex.matches(in: modifiedHTML, options: [], range: NSRange(location: 0, length: nsString.length))
    // ...
}`,
    },
    why: "`NSRegularExpression` compilation walks and validates the pattern; the pattern here is a compile-time constant.",
    purpose: "Eliminate redundant compilation on every HTML email render (Scenario 3 hot path).",
  },
  {
    id: "cache-jsonencoder",
    category: "tier-1-allocation",
    title: "Cache `JSONEncoder` in `HtmlSanitizer`",
    location: {
      file: "Modules/InboxComposer/Sources/Composer/Utils/HtmlSanitizer.swift",
    },
    what: "Lift `JSONEncoder()` to a `static let` on the type.",
    before: {
      language: "swift",
      code: `struct HtmlSanitizer {
    static func applyStringLiteralEscapingRules(html: String) -> String {
        let jsonEncodedText = try! JSONEncoder().encode(html)
        let sanitized = String(data: jsonEncodedText, encoding: .utf8)!
        return sanitized
    }
}`,
    },
    after: {
      language: "swift",
      code: `struct HtmlSanitizer {
    private static let encoder = JSONEncoder()

    static func applyStringLiteralEscapingRules(html: String) -> String {
        let jsonEncodedText = try! encoder.encode(html)
        let sanitized = String(data: jsonEncodedText, encoding: .utf8)!
        return sanitized
    }
}`,
    },
    why: "`JSONEncoder` initialization sets up internal state that is reused safely in this read-only usage.",
    purpose: "Remove per-call initialization on every composed message body.",
  },
  {
    id: "cache-dateformatter",
    category: "tier-1-allocation",
    title: "Cache `DateFormatter` for draft expiration display",
    location: {
      file: "Modules/InboxComposer/Sources/Composer/UIKitComponents/Views/DraftActionBarViewController.swift",
    },
    what: "Lift the `DateFormatter` to a file-scope cached instance.",
    before: {
      language: "swift",
      code: `private extension DraftExpirationTime {
    var customDateString: String? {
        if let customDate {
            let formatter = DateFormatter()
            formatter.dateStyle = .medium
            formatter.timeStyle = .short
            return formatter.string(from: customDate)
        }
        return nil
    }
}`,
    },
    after: {
      language: "swift",
      code: `private let customExpirationDateFormatter: DateFormatter = {
    let formatter = DateFormatter()
    formatter.dateStyle = .medium
    formatter.timeStyle = .short
    return formatter
}()

private extension DraftExpirationTime {
    var customDateString: String? {
        if let customDate {
            return customExpirationDateFormatter.string(from: customDate)
        }
        return nil
    }
}`,
    },
    why: "`DateFormatter` is one of the most expensive Foundation initializers (locale resolution, calendar config, pattern parsing).",
    purpose: "Avoid expensive setup on every expiration-time display.",
  },
  {
    id: "composer-count-where",
    category: "tier-2-collection",
    title: "`filter().count` → `count(where:)` in `ComposerModel`",
    location: {
      file: "Modules/InboxComposer/Sources/Composer/Views/ComposerView/ComposerModel.swift",
    },
    what:
      "Replace two `filter().count` calls with single-pass `count(where:)` checks.",
    before: {
      language: "swift",
      code: `let draftAttachments = try await draft.attachmentList().attachments().get()
let dispositions = draftAttachments.map(\.attachment.disposition)
let inlineCount = dispositions.filter { $0 == .inline }.count
let attachmentCount = dispositions.filter { $0 == .attachment }.count`,
    },
    after: {
      language: "swift",
      code: `let draftAttachments = try await draft.attachmentList().attachments().get()
let inlineCount = draftAttachments.count(where: { $0.attachment.disposition == .inline })
let attachmentCount = draftAttachments.count(where: { $0.attachment.disposition == .attachment })`,
    },
    why: "Two `filter().count` calls allocate two intermediate arrays; `count(where:)` (iOS 16+) is single-pass and allocation-free.",
    purpose: "Reduce attachment-bookkeeping cost in the compose workflow.",
  },
  {
    id: "recipient-delete-key-contains",
    category: "tier-2-collection",
    title: "`filter().isEmpty` → `contains(where:)` on recipient delete-key",
    location: {
      file: "Modules/InboxComposer/Sources/Composer/UIKitComponents/RecipientsFieldEditingController.swift",
    },
    what: "Use `contains(where:)` to test for recipient cells before clearing focus.",
    before: {
      language: "swift",
      code: `case .onDeleteKeyPressedOnEmptyTextField:
    if !cellUIModels.filter(\.isRecipient).isEmpty { removeFocusFromCursor() }
    onEvent?(.onDeleteKeyPressedInsideEmptyInputField)`,
    },
    after: {
      language: "swift",
      code: `case .onDeleteKeyPressedOnEmptyTextField:
    if cellUIModels.contains(where: \.isRecipient) { removeFocusFromCursor() }
    onEvent?(.onDeleteKeyPressedInsideEmptyInputField)`,
    },
    why: "`filter` allocates an entire result array only to test emptiness; `contains(where:)` short-circuits on first match.",
    purpose: "Remove per-keystroke allocation in recipient editing.",
  },
  {
    id: "recipient-focus-contains",
    category: "tier-2-collection",
    title: "`filter().isEmpty` → `contains(where:)` on recipient focus",
    location: {
      file: "Modules/InboxComposer/Sources/Composer/UIKitComponents/RecipientsFieldController.swift",
    },
    what: "Use `contains(where:)` to detect selected recipients before focusing the editor.",
    before: {
      language: "swift",
      code: `case .editing:
    updateStateInExpandedAndEditingViews(state)
    if state.recipients.filter(\.isSelected).isEmpty {
        editingController.setFocus()
    }`,
    },
    after: {
      language: "swift",
      code: `case .editing:
    updateStateInExpandedAndEditingViews(state)
    if !state.recipients.contains(where: \.isSelected) {
        editingController.setFocus()
    }`,
    },
    why: "Same allocation issue as the delete-key case.",
    purpose: "Remove per-state-change allocation.",
  },
  {
    id: "sidebar-selection-contains",
    category: "tier-2-collection",
    title: "`filter().isEmpty` → `contains(where:)` on sidebar selection",
    location: {
      file: "Modules/App/Sources/UI/Screens/Sidebar/SidebarModel.swift",
    },
    what: "Use `contains(where:)` when reconciling the selected sidebar item.",
    before: {
      language: "swift",
      code: `private func selectFirstSystemItemIfNeeded() {
    if state.items.filter(\.isSelected).isEmpty, let first = state.system.first {
        select(item: .system(first))
    }
}`,
    },
    after: {
      language: "swift",
      code: `private func selectFirstSystemItemIfNeeded() {
    if !state.items.contains(where: \.isSelected), let first = state.system.first {
        select(item: .system(first))
    }
}`,
    },
    why: "Same allocation issue as the delete-key case.",
    purpose: "Remove allocation on sidebar selection reconciliation.",
  },
  {
    id: "mailbox-voiceover-count",
    category: "tier-2-collection",
    title: "`count > 0` → `!isEmpty` + cached local, mailbox voice-over",
    location: {
      file: "Modules/App/Sources/UI/Views/MailboxItemListView/MailboxItemsListView.swift",
    },
    what: "Cache `previewables` locally, then use `isEmpty` before building the VoiceOver string.",
    before: {
      language: "swift",
      code: `let attachments =
    item.attachments.previewables.count > 0
    ? L10n.Mailbox.VoiceOver.attachments(count: item.attachments.previewables.count).string
    : ""`,
    },
    after: {
      language: "swift",
      code: `let previewables = item.attachments.previewables
let attachments =
    previewables.isEmpty
    ? ""
    : L10n.Mailbox.VoiceOver.attachments(count: previewables.count).string`,
    },
    why: "`previewables` was accessed twice; `.isEmpty` is `O(1)` for all `Collection`s, while `count > 0` is only guaranteed `O(1)` for `RandomAccessCollection`.",
    purpose: "Reduce per-cell work during mailbox scrolling (Scenario 2).",
  },
  {
    id: "trackers-ui-model-empty",
    category: "tier-2-collection",
    title: "`count > 0` → `!isEmpty` on `TrackersUIModel`",
    location: {
      file: "Modules/App/Sources/UI/Views/TrackersInfo/TrackersUIModel.swift",
    },
    what: "Replace count comparisons with `isEmpty` checks.",
    before: {
      language: "swift",
      code: `var areTrackersPresented: Bool {
    blockedTrackers.count > 0 || (blockedTrackers.isEmpty && cleanedLinks.isEmpty)
}

var areLinksPresented: Bool {
    cleanedLinks.count > 0
}`,
    },
    after: {
      language: "swift",
      code: `var areTrackersPresented: Bool {
    !blockedTrackers.isEmpty || (blockedTrackers.isEmpty && cleanedLinks.isEmpty)
}

var areLinksPresented: Bool {
    !cleanedLinks.isEmpty
}`,
    },
    why: "`isEmpty` is the idiomatic Swift form, `O(1)` for all `Collection`s; futureproofs against `LazySequence` chains.",
    purpose: "Align with Swift conventions and preserve `O(1)` evaluation.",
  },
];

export const microOptimizationFolders = {
  existing: microOptimizations.filter((item) => item.category === "existing"),
  tier1: microOptimizations.filter((item) => item.category === "tier-1-allocation"),
  tier2: microOptimizations.filter((item) => item.category === "tier-2-collection"),
  outOfScope: [
    {
      title: "Items identified but out of scope",
      body: [
        "`DatePickerView.swift:124, 139–143` — formatter and `Calendar.current` calls inside `#Preview` (non-production).",
        "`ScheduleSendDateFormatter.swift` — cached `DateFormatter` has properties mutated by each format method without reset (e.g., `doesRelativeDateFormatting`). Correctness issue, not perf — separate change.",
        "`MailboxItemCell.swift:361, 401` — `Calendar.current` inside SwiftUI preview/test data.",
        "`AppLogger.Category.rawValue` — calls `String(describing: self)` + prefix-uppercase per log call. Cleanest fix changes log output bytes; needs verification no parser depends on byte-identical output.",
        "Various `Calendar.current` accesses in picker `range` configuration — execute few times per view lifetime; not worth the diff.",
      ],
    },
  ],
};
