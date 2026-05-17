import type { Scenario } from "@/lib/types";

export const scenarios: Scenario[] = [
  {
    id: "cold-launch",
    title: "Cold Launch",
    description:
      "User opens Proton Mail from a cold start and waits until the mailbox appears.",
    risks: { cpu: 3, gpu: 4, overdraw: 3, memory: 3, threading: 4, power: 4 },
    analyses: {
      gpuRendering: {
        estimate: "medium-high",
        body: "Mailbox loading presents a medium-high GPU rendering cost because the application displays approximately 25 animated Lottie skeleton rows while mailbox data is loading. The initial rendering pass also includes multiple mailbox cells, avatars, labels, icons, and animations simultaneously. This creates significant compositing work during the first visible frame.",
        problemsAndStrengths:
          "GPU rendering is estimated as medium-high because `MailboxSkeletonView` renders approximately 25 looping Lottie skeleton rows while mailbox content is loading. This is useful for perceived responsiveness because the user sees immediate feedback instead of a blank screen, but continuous vector animation increases Core Animation work and power usage. Once mailbox data appears, the screen also renders avatars, labels, icons, dates, badges, and row content. Pagination is a strength because the UI does not render all emails at once, but the initial loading state still creates a visible GPU risk.",
      },
      overdrawing: {
        estimate: "medium",
        body: "The mailbox list contains layered UI components including background containers, sender avatars, labels, unread indicators, attachment icons, and swipe-action overlays. Although the UI design is relatively flat, the repeated layering of mailbox cells generates moderate overdraw during scrolling and initial rendering.",
        problemsAndStrengths:
          "Overdraw is estimated as medium. The mailbox view is composed of several layered SwiftUI views, including row backgrounds, list containers, toolbar overlays, loading bars, swipe-action containers, and skeleton animations. Solid row backgrounds reduce excessive transparency, which is a strength. However, clipping, rounded corners, compositing groups, and animated placeholders can increase blending or offscreen rendering during loading.",
      },
      memoryManagement: {
        estimate: "medium",
        body: "Mailbox data remains cached as the user scrolls through messages. Sender images are stored in an in-memory cache with a limit of approximately 30 images, which helps bound memory usage. However, mailbox previews, labels, and view state remain active during scrolling, producing medium memory pressure.",
        problemsAndStrengths:
          "Memory consumption is estimated as medium. The app initializes mailbox state, SDK/session objects, list data, skeleton animation resources, and sender image cache structures. Pagination reduces memory pressure because only portions of the mailbox are loaded, and the sender image cache is bounded to around 30 images. The main risk is that loaded mailbox items remain in memory as the user continues navigating.",
      },
      threading: {
        estimate: "medium-high",
        body: "Mailbox initialization involves asynchronous loading, network requests, cache population, and UI updates occurring simultaneously. The application uses Swift concurrency and background tasks effectively, but the amount of coordination between mailbox loading and rendering increases threading complexity during startup.",
        problemsAndStrengths:
          "Threading complexity is estimated as medium-high. This scenario uses async mailbox loading, live update streams, main-actor UI state changes, Combine callbacks, and background work for network or SDK-related operations. This architecture is a strength because it avoids doing all work directly on the main thread. The risk is that many state updates may converge on the main actor at the same time during initial rendering, causing short UI bursts.",
      },
    },
  },
  {
    id: "scroll-mailbox",
    title: "Scroll Mailbox",
    description:
      "User scrolls through the mailbox list after it has loaded, exercising cell reuse, pagination, and swipe actions.",
    risks: { cpu: 3, gpu: 3, overdraw: 3, memory: 3, threading: 3, power: 3 },
    analyses: {
      gpuRendering: {
        estimate: "medium",
        body: "Scrolling performance is relatively stable because mailbox cells are paginated and reused efficiently. GPU rendering remains moderate due to continuous compositing of avatars, icons, labels, and animations while scrolling.",
        problemsAndStrengths:
          "GPU rendering is estimated as medium. The mailbox list benefits from pagination and SwiftUI List row reuse, so the app should not redraw the entire mailbox for every scroll frame. Most rows use text and system-like icons rather than expensive custom drawing. The performance risk comes from conditional row content such as avatars, labels, star indicators, attachment icons, badges, dates, swipe actions, and animations that may be active while scrolling.",
      },
      overdrawing: {
        estimate: "medium",
        body: "Each mailbox cell includes several conditional subviews such as stars, labels, attachments, timestamps, and unread indicators. These overlapping components create consistent but manageable overdraw across the scrolling list.",
        problemsAndStrengths:
          "Overdraw is estimated as medium because each mailbox row contains multiple visual layers. Row backgrounds, unread indicators, swipe containers, and conditional accessory views can stack on top of each other. This is not necessarily a defect, but it should be verified with Color Blended Layers and Color Offscreen-Rendered overlays. Red blended areas or frequent flashing without actual visual changes would indicate inefficient rendering.",
      },
      memoryManagement: {
        estimate: "medium",
        body: "Mailbox items remain in memory while the user scrolls, especially recently visited cells and cached sender images. However, the bounded cache implementation prevents uncontrolled memory growth.",
        problemsAndStrengths:
          "Memory consumption is estimated as medium. Pagination helps because not all mailbox messages are fetched and rendered at once. However, loaded mailbox items, sender images, cached previews, and list state remain in memory as the user scrolls. The bounded sender image cache is a strength because it limits uncontrolled image growth.",
      },
      threading: {
        estimate: "medium",
        body: "Scrolling triggers asynchronous updates for cell reuse, image loading, and pagination callbacks. The workload is distributed across multiple lightweight background tasks, producing moderate thread activity.",
        problemsAndStrengths:
          "Threading is estimated as medium. Scrolling can trigger sender image reads, pagination requests, cache lookups, and list updates. Async behavior improves performance by separating network or SDK work from immediate UI interaction. The main risk is that frequent cache reads or state updates may briefly block or overload the main actor if they arrive in large bursts.",
      },
    },
  },
  {
    id: "rich-email",
    title: "Rich Email Body",
    description:
      "User opens an email with rich HTML content, exercising WKWebView rendering, injected scripts, and height observation.",
    risks: { cpu: 4, gpu: 4, overdraw: 3, memory: 4, threading: 4, power: 4 },
    analyses: {
      gpuRendering: {
        estimate: "medium-high",
        body: "Opening a rich email body produces medium-high GPU usage because the application renders HTML content using `WKWebView`. Complex email layouts with CSS, embedded images, and scripts increase rendering and compositing work significantly.",
        problemsAndStrengths:
          "GPU rendering is estimated as medium-high. `MessageBodyReaderView` uses `WKWebView` to render email HTML. Rich emails can include nested layouts, images, CSS, injected scripts, and dynamic height measurement. These features can cause rendering spikes because WebKit must parse, lay out, and composite the message body. The strength is that `WKWebView` is the standard iOS mechanism for HTML content and isolates complex web rendering from the rest of the SwiftUI interface.",
      },
      overdrawing: {
        estimate: "medium",
        body: "HTML-based email rendering naturally introduces layered backgrounds, containers, and images inside `WKWebView`. Although overdraw is partially isolated inside the WebView process, multiple overlapping HTML layers still generate moderate rendering redundancy.",
        problemsAndStrengths:
          "Overdraw is estimated as medium. `MessageBodyHTMLView` uses a `ZStack` with a loading spinner and `WKWebView`, so both layers may exist briefly while the email loads. Rich HTML can also include background containers, images, and nested elements that overlap inside the WebView. Overdraw should be checked using blended-layer and offscreen-rendering diagnostics.",
      },
      memoryManagement: {
        estimate: "high",
        body: "`WKWebView` initialization creates additional memory pressure because HTML content, scripts, attachments, and rendering buffers are loaded simultaneously. Rich email bodies and embedded resources increase temporary memory allocation substantially.",
        problemsAndStrengths:
          "Memory consumption is estimated as medium-high to high. `WKWebView` is memory-expensive compared with normal SwiftUI text views because it holds HTML content, layout state, JavaScript context, rendering buffers, and images. Complex newsletters or image-heavy emails can increase RAM use even when no leak exists.",
      },
      threading: {
        estimate: "medium-high",
        body: "Message loading involves background decryption, WebView preparation, JavaScript injection, and height observation callbacks. Multiple asynchronous operations execute concurrently, producing high threading activity during email rendering.",
        problemsAndStrengths:
          "Threading complexity is estimated as medium-high. The scenario uses asynchronous message loading, WebKit rendering work, JavaScript message callbacks, and main-actor layout updates caused by dynamic height observation. Async behavior improves responsiveness, but repeated height updates can trigger layout-recalculation bursts on the main actor.",
      },
    },
  },
  {
    id: "search",
    title: "Search Messages",
    description:
      "User enters a query and scrolls through results, exercising async callbacks, pagination, and live query updates.",
    risks: { cpu: 4, gpu: 3, overdraw: 2, memory: 3, threading: 4, power: 4 },
    analyses: {
      gpuRendering: {
        estimate: "medium",
        body: "GPU rendering remains moderate because search results update dynamically while the user types. Incremental result rendering and list updates generate repeated but relatively lightweight rendering operations.",
        problemsAndStrengths:
          "GPU rendering is estimated as medium. Search results are usually simpler than the full mailbox loading screen, but every query update can insert, remove, or refresh result rows. The strength is that results are paginated, so rendering is limited to visible or fetched results. The risk is repeated UI refreshes during active typing.",
      },
      overdrawing: {
        estimate: "low-medium",
        body: "Search result cells reuse the same visual structure as mailbox cells, but fewer visual decorations are active simultaneously. As a result, overdraw remains relatively low compared to the full mailbox view.",
        problemsAndStrengths:
          "Overdraw is estimated as low-medium. The search screen uses a full background plus list/content layers, but it generally has fewer decorative elements than the mailbox. Because empty/loading states are separated from data states, the app avoids rendering complex rows when there are no results.",
      },
      memoryManagement: {
        estimate: "medium",
        body: "Search results are stored temporarily while the query remains active. Paginated search responses and cached mailbox previews create moderate memory pressure, although the memory footprint remains controlled.",
        problemsAndStrengths:
          "Memory consumption is estimated as medium. Search keeps temporary query state, scroller objects, paginated results, and selected message information. Memory should return close to baseline when search is dismissed. If results or callbacks remain retained, Memory Graph would reveal `SearchModel` or scroller objects that survive longer than expected.",
      },
      threading: {
        estimate: "medium-high",
        body: "Search operations rely heavily on asynchronous callbacks, pagination, and live query updates. Every user keystroke can trigger background processing and result updates, increasing thread activity considerably during active search sessions.",
        problemsAndStrengths:
          "Threading complexity is estimated as medium-high. Search uses async scrollers, live callbacks, and main-actor state updates. This is a strength because query work can be separated from UI rendering. The main risk is the absence of strong cancellation or debounce behavior: rapid typing could create many active tasks or result updates, increasing CPU, thread coordination, and power consumption.",
      },
    },
  },
  {
    id: "compose",
    title: "Compose Email",
    description:
      "User opens the compose screen, writes a message, and prepares it for sending with optional attachments.",
    risks: { cpu: 3, gpu: 2, overdraw: 2, memory: 3, threading: 3, power: 3 },
    analyses: {
      gpuRendering: {
        estimate: "low-medium",
        body: "The compose interface is relatively lightweight because it mainly consists of text fields and simple toolbar components. GPU rendering cost remains low-medium except when image attachments are added.",
        problemsAndStrengths:
          "GPU rendering is estimated as low-medium. The compose UI is mostly text fields, buttons, recipient chips, and toolbar controls, so it is less graphically demanding than rich email rendering. GPU risk increases only when previews or attachment thumbnails are displayed.",
      },
      overdrawing: {
        estimate: "low-medium",
        body: "The compose screen uses a flat layout with limited layered UI components, resulting in relatively low overdraw compared to mailbox and email rendering screens.",
        problemsAndStrengths:
          "Overdraw is estimated as low-medium because the compose screen uses a relatively flat interface with fewer layered elements than the mailbox. Toolbars, recipient chips, and attachment thumbnails add some layers, but the overall visual structure is not complex.",
      },
      memoryManagement: {
        estimate: "medium",
        body: "Composing emails generates moderate memory usage because draft state, text buffers, and temporary attachment references remain active while editing. Memory usage increases slightly when attachments are inserted.",
        problemsAndStrengths:
          "Memory consumption is estimated as medium. Draft text, recipient state, attachment references, and temporary files or thumbnails remain active while composing. Memory risk increases when attachments are added because both preview data and upload/encryption preparation may exist at the same time.",
      },
      threading: {
        estimate: "medium",
        body: "Background tasks are used for autosave operations, attachment handling, and send preparation. However, concurrency complexity is lower than in mailbox loading or search workflows.",
        problemsAndStrengths:
          "Threading is estimated as medium. Compose can use background tasks for autosave, attachment handling, and send preparation. Async usage contributes positively because sending and attachment preparation should not block typing. The main risk is long-running unstructured `Task` blocks capturing model or coordinator objects strongly after the compose screen is dismissed.",
      },
    },
  },
];
