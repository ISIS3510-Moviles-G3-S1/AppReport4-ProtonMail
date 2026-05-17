export type RiskScore = 1 | 2 | 3 | 4 | 5;
export type RiskDimension =
  | "cpu"
  | "gpu"
  | "overdraw"
  | "memory"
  | "threading"
  | "power";

export type RiskProfile = Record<RiskDimension, RiskScore>;

export type AnalysisBlock = {
  estimate: "low" | "low-medium" | "medium" | "medium-high" | "high";
  body: string;
  problemsAndStrengths: string;
};

export type Scenario = {
  id: "cold-launch" | "scroll-mailbox" | "rich-email" | "search" | "compose";
  title: string;
  description: string;
  risks: RiskProfile;
  analyses: {
    gpuRendering: AnalysisBlock;
    overdrawing: AnalysisBlock;
    memoryManagement: AnalysisBlock;
    threading: AnalysisBlock;
  };
};

export type MemoryFinding = {
  id: string;
  title: string;
  body: string;
  category: "leak-risk" | "ram-consumption" | "tooling-recommendation";
  references?: string[];
};

export type ThreadingFinding = {
  id: string;
  title: string;
  body: string;
  category: "thread-creation" | "main-thread-stall" | "effect-analysis";
  references?: string[];
};

export type MicroOptCategory =
  | "existing"
  | "tier-1-allocation"
  | "tier-2-collection"
  | "out-of-scope";

export type CodeSnippet = { language: "swift"; code: string };

export type MicroOpt = {
  id: string;
  category: MicroOptCategory;
  title: string;
  location: { file: string; lines?: [number, number] };
  what: string;
  before?: CodeSnippet;
  after?: CodeSnippet;
  why: string;
  purpose: string;
};
