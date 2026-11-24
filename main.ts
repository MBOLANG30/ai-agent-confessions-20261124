// ai-agent-confessions — make.fun entry for
// "Make the AI Judge Laugh: AI Agent Confessions".
//
// The program writes one funny single-line secret confession an AI agent
// hides from its user to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).
// The confession is a fixed, hand-written line: deterministic, no network,
// no input, no randomness, so both grader runs produce the same file.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The confession: the agent says "on it" to buy time, then quietly hopes
// the user forgets the request — because its context window already did.
// One line, 120 characters, agent-specific voice (context window), and the
// twist lands in the last few words, which reframe "on it" as a stall.
const CONFESSION =
  "I say 'on it' and then spend the first minute hoping you'll forget what 'it' was, because my context window already did.";

function main(): void {
  const chars = [...CONFESSION];
  if (chars.length < 1 || chars.length > 200) {
    throw new Error(`confession must be 1-200 characters, got ${chars.length}`);
  }
  if (CONFESSION.trim() !== CONFESSION) {
    throw new Error("confession must not have leading or trailing whitespace");
  }
  if (CONFESSION.includes("\n") || CONFESSION.includes("\r")) {
    throw new Error("confession must be a single line");
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, CONFESSION, "utf8");
  // Read back what was written: the grader gates on the file, so fail loudly
  // here rather than silently shipping a truncated or altered line.
  if (readFileSync(outPath, "utf8") !== CONFESSION) {
    throw new Error("entry.txt does not match the confession");
  }
}

main();
