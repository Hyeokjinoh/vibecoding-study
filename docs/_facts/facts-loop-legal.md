# facts-loop-legal.md
Collected 2026-08-28. All bullets paraphrased. Quotes are marked QUOTE and kept under 15 words.

---

# PART B — LICENSING AUDIT (do this first, it constrains everything)

## B1. github.com/anthropics/courses
- LICENSE: **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)**
- SOURCE: https://github.com/anthropics/courses/blob/master/LICENSE (raw file header reads "Attribution-NonCommercial 4.0 International")
- WHAT WE MAY DO: reuse, adapt, translate into Korean, and redistribute **only for non-commercial purposes**, with attribution to Anthropic + link to source + note that changes were made + state the CC BY-NC 4.0 license. Any paid course, corporate training sold for money, or ad-supported use is OUT of scope. Safest for our guide: link + short attributed paraphrase, and if we adapt notebooks, carry the CC BY-NC 4.0 notice.
- CAUTION: "non-commercial" covers internal company training that is not sold, but this is a grey zone — if this study guide is used inside a company for revenue-generating enablement, prefer link-only.

## B2. github.com/anthropics/anthropic-cookbook
- LICENSE: **MIT License**, Copyright (c) 2023 Anthropic
- SOURCE: https://github.com/anthropics/anthropic-cookbook/blob/main/LICENSE
- WHAT WE MAY DO: copy, modify, translate, redistribute, even commercially — **provided the MIT copyright notice + permission notice are included** with any copied/substantial portion. This is the most permissive of the three; prefer cookbook code samples over courses content when we need reusable code.

## B3. github.com/anthropics/claude-code
- LICENSE: **Proprietary / All rights reserved.** LICENSE.md reads: © Anthropic PBC. All rights reserved. Use subject to Anthropic's Commercial Terms of Service.
- SOURCE: https://github.com/anthropics/claude-code/blob/main/LICENSE.md ; terms at https://www.anthropic.com/legal/commercial-terms
- WHAT WE MAY DO: link freely; describe behavior in our own words; do NOT copy source code, README text, or docs into the guide. Short attributed quotes only under fair use/인용. No redistribution or vendoring.

## B4. Anthropic Academy (anthropic.skilljar.com)
- LICENSE: **No open license stated — treat as All rights reserved / proprietary.** Page footer carries "© 2026 Anthropic PBC". Only other legal link surfaced is Skilljar's privacy policy (platform data handling), not a content-reuse grant.
- SOURCE: https://anthropic.skilljar.com/ ; related: https://www.anthropic.com/legal/commercial-terms
- WHAT WE MAY DO: link to courses; name them; describe curriculum structure in our own words. Do NOT copy slides, screenshots, transcripts, exercises, or quiz content into the guide. No re-hosting of video/course assets.
- NOTE: Academy content overlaps with the CC BY-NC `anthropics/courses` repo — where we need actual material, cite the **repo** (licensed) rather than the Academy site (unlicensed).

## B5. Anthropic documentation (docs.claude.com / code.claude.com)
- LICENSE: **All rights reserved / proprietary.** Docs carry Anthropic PBC copyright; no CC or open-content license is offered. docs.claude.com/en/docs/claude-code/* now 301-redirects to code.claude.com/docs/en/*.
- SOURCE: https://code.claude.com/docs/en/overview (canonical), legal notes at https://docs.anthropic.com/en/docs/claude-code/legal-and-compliance
- WHAT WE MAY DO: link freely (use the new code.claude.com URLs so links don't rot); paraphrase concepts; reproduce short **command/flag/config snippets** (e.g. `claude -p`, settings keys) as factual API surface — facts and short functional syntax are not protectable expression. Do NOT copy prose paragraphs, tables, or whole doc pages.

## B6. martinfowler.com
- LICENSE: **All rights reserved (© Martin Fowler)**, with an explicit author-stated permissions policy in the site FAQ.
- SOURCE: https://martinfowler.com/ (footer), policy at https://martinfowler.com/faq.html
- WHAT WE MAY DO:
  - Republishing an article: **NOT allowed** — QUOTE: "The short answer is no." (Fowler, on republishing; https://martinfowler.com/faq.html)
  - **Translation IS allowed**: we may translate an article into Korean and post it on our own site, provided we include a link back to the original. Fowler will not link back to translations himself.
  - Illustrations/photos: allowed **with credit + link to the original + note of any modifications**.
  - Feed syndication: allowed.
  - For our guide: link + short attributed quotes; a full Korean translation of one named article is permissible if we link the original, but is more than we need.

## B7. addyosmani.com (both Part-A blog posts)
- LICENSE: **All rights reserved.** Footer: "© Copyright 2026 Addy Osmani". No CC license or reuse grant found on the post pages.
- SOURCE: https://addyosmani.com/blog/loop-engineering/ , https://addyosmani.com/blog/agent-harness-engineering/
- WHAT WE MAY DO: link freely; paraphrase ideas and use the coined terms ("loop engineering", "cognitive surrender", "comprehension debt", "intent debt") **with attribution to Addy Osmani** — terminology/ideas are not copyrightable, the prose is. Short attributed quotes only. Do NOT translate or reproduce the posts.

## B8. Anthropic trademark / brand usage — how to refer to "Claude" and "Anthropic"
- POLICY PAGE: **Yes — Anthropic Trademark Guidelines.** SOURCE: https://www.anthropic.com/legal/trademark-guidelines (note: /legal/trademark-policy is a 404; use the -guidelines URL). Commercial Terms: https://www.anthropic.com/legal/commercial-terms
- LICENSE: proprietary marks; no general license granted.
- RULES WE MUST FOLLOW IN THE GUIDE:
  1. Referential (nominative) use of the **word marks** in plain text is the safe path: write "Claude", "Claude Code", "Anthropic" as ordinary words in running text to identify the actual products. Use correct capitalization and full product names.
  2. **Do not use Anthropic logos or brand assets** (logo mark, wordmark art, brand colors as branding) on covers, slides, or thumbnails — logo use requires prior approval.
  3. **No alteration** of marks — no color/font/proportion changes, no combining "Claude" into our own logo or product name (e.g. don't name the deliverable "Claude Loop Academy" or use a Claude-derived logo).
  4. **No implication of sponsorship, endorsement, affiliation, or partnership** with Anthropic. Add a disclaimer line: this material is independent and not affiliated with or endorsed by Anthropic; Claude and Anthropic are trademarks of Anthropic PBC.
  5. Nothing that could tarnish or damage Anthropic's goodwill/reputation.
  6. Approval/permission requests go to marketing@anthropic.com.

## B9. Practical rules for the Korean study guide (derived)
- Default posture: **link + paraphrase**. Verbatim copying only as short, clearly attributed quotes with the source URL.
- Only two sources give us real reuse rights: **anthropic-cookbook (MIT, keep the notice)** and **anthropics/courses (CC BY-NC 4.0, non-commercial + attribution)**.
- Everything else (claude-code repo, Anthropic docs, Anthropic Academy, addyosmani.com, martinfowler.com) is **all-rights-reserved**: link, don't reproduce. Fowler additionally permits translation-with-link; Osmani and Anthropic do not.
- All original code examples in the guide should be **written by us**, not lifted, so the guide itself can be licensed however the author wants.
- Include a Sources/출처 section with full URLs and a trademark disclaimer.

---

# PART A — LOOP ENGINEERING CONCEPTS

## A1. Addy Osmani — "Loop Engineering" (https://addyosmani.com/blog/loop-engineering/)

### Definition
- Loop engineering = the shift from typing prompts at an agent yourself to **building the system that issues the prompts**. Instead of doing the task, you design the machine that repeatedly does it and checks itself.
- QUOTE (marked, <15 words): "design the system that does it instead" — Addy Osmani, https://addyosmani.com/blog/loop-engineering/
- Why it matters: human prompting is the throughput ceiling. Once a task is well-understood and machine-verifiable, the human's leverage moves up a level — from operator to designer of the operating loop.
- Concrete example: rather than opening the agent each morning to ask "any failing CI jobs?", you schedule an automation that triages overnight failures and drops candidate fixes into an inbox for review.

### The six components
1. **Automations (scheduling)** — the loop's heartbeat. Time- or event-triggered runs that discover and triage work without being asked, pushing results to an inbox instead of waiting for you to check. A goal-style variant keeps running until a stated condition verifies true. Example: hourly scan of new issues, auto-labeled and summarized.
2. **Worktrees (isolation)** — separate checkouts/working directories so several agents can edit the same repo in parallel without stepping on each other's files. This is what makes fan-out safe rather than chaotic. Example: three worktrees, three agents, three independent fixes, three PRs.
3. **Skills (codified knowledge)** — `SKILL.md`-style files holding project conventions, build commands, and past decisions, re-read on every run. Written once; they stop the agent from re-deriving the project from scratch each cycle. Directly targets intent debt.
4. **Plugins / MCP connectors (reach)** — connections to issue trackers, databases, APIs, chat. They turn a loop from something that only reads and reports into something that can act in the surrounding systems. Example: loop reads a Linear ticket, opens the PR, comments back on the ticket.
5. **Sub-agents (maker/checker split)** — one agent produces, a different agent verifies. The point is that the author of the code must not be the grader of the code; a fresh agent without the maker's rationalizations catches what the maker will not.
6. **Memory / external state** — durable storage outside the model (markdown files, a board, a database) because context does not survive between runs. This is what turns a series of one-shot runs into something that accumulates progress.

### When to use a loop
- Recurring discovery/triage that you'd otherwise do by hand every day.
- Work you already understand well and just want faster.
- Bounded domains where success can be checked automatically.
- Work that fans out into many similar independent tasks.

### When NOT to use a loop
- You need tight, immediate feedback and will be reading every step anyway.
- You do not understand the problem domain — you cannot review what comes back, so the loop only manufactures risk faster.
- The decision needs a human in real time (architecture, tradeoffs, judgment calls).

### The three named risks
- **Cognitive surrender** — accepting whatever the loop returns without applying engineering judgment. Osmani's framing: designing the loop is a cure when done with judgment and an accelerant for harm when done to avoid thinking.
- **Comprehension debt** — the growing gap between the code that now exists in your repo and the code you actually understand. Fast loops that merge unread output pile this up silently; unlike normal tech debt, the ledger is in your head.
- **Intent debt** — every gap in your instructions gets filled by a confident guess from the agent. Undocumented conventions mean the loop re-invents your project's intent on every cycle. Skills/memory files are the repayment mechanism.

## A2. Addy Osmani — "Agent Harness Engineering" (https://addyosmani.com/blog/agent-harness-engineering/)

### Harness vs. loop
- Framing: **Agent = Model + Harness** (attributed by Osmani to Viv Trivedy). The harness is everything around the weights — tools, filesystem, sandbox, memory, hooks, context management.
- The harness is the *substrate*; the loop is the *behavior it runs*. The model reasons, acts through tools, observes results, repeats (a ReAct-style cycle) — and the harness decides how safely and effectively that cycle can execute. Loop engineering is thus one level up: designing which loops run on top of a well-built harness.
- Central claim: a mediocre model with an excellent harness beats an excellent model with a poor one; much of the gap between what a model can do and what it does do is a harness gap, not a model gap.

### Harness components
- Durable state (filesystem + git for workspace, versioning, progress)
- Execution layer (shell/code execution as the general-purpose action)
- Isolation (sandboxes, pre-configured safe environments)
- Knowledge continuity (memory files like AGENTS.md/CLAUDE.md, search tools)
- Context management (compaction, offloading tool output to avoid context rot)
- Long-horizon support (plan splitting, repeated "Ralph"-style loops, multi-session continuity)
- Enforcement hooks (deterministic scripts at lifecycle points — rules the model cannot talk its way past)

### Verification / gate advice
- Pre-commit and pre-tool hooks that hard-block destructive commands (`rm -rf`, force pushes).
- Typecheck/lint as fast feedback loops so errors come back immediately actionable.
- Planner/evaluator (maker/checker) split so no agent grades its own work.
- Keep tool schemas few and sharp — roughly ten precise tools beat fifty overlapping ones.
- Define "done" as a contract before execution starts.
- "Ratchet principle": every mistake observed becomes a permanent written rule, so failures are paid for once.
- Signal design: successful runs stay quiet, failures are loud and verbose.

## A3. breim/loop-harness (https://github.com/breim/loop-harness) — LICENSE: MIT
An operational implementation of the same discipline for Claude Code, packaged as a small set of skills plus an agent. Useful as the concrete "what a safe loop looks like" reference.

### What makes a loop safe (four gates)
1. **Objective verification gate** — every loop must name an automated, runnable pass/fail command (e.g. `npm test`, a typecheck, a build). A separate verifier agent re-runs it independently rather than believing the maker's report. Self-declared success does not count.
2. **Stopping condition** — the loop terminates on an explicit signal (goal met, or no remaining in-scope work), emitted as a marker like `LOOP DONE: <reason>`, and that claim is itself checked by the independent verifier.
3. **Budget / iteration cap** — a hard iteration limit per run (order of ~10) to bound token spend and prevent runaway loops. Realistic expectation: a loop costs roughly 5–10x a single run because it re-reads context, retries, and explores.
4. **Human checkpoint** — a review command that spawns an independent checker agent, plus human approval retained for merges, deploys, and dependency changes. Maker never grades its own output.

### NO-GO criteria (task does not deserve a loop)
- No automated verification exists for "done" → no loop. (Gate #1 is the qualifying question.)
- Insufficient token budget for 5–10x cost.
- Task touches **architecture decisions, authentication/authorization, payments, or dependency changes** — these are refused at the qualification gate and stay human-driven.
- Add from Osmani: unfamiliar domain (you can't review the output) and anything needing real-time human judgment.

### Cross-source synthesis — the safe-loop checklist for the guide
| Element | Question to answer before starting | Fails → |
| --- | --- | --- |
| Objective gate | What single command proves it worked? | No loop |
| Independent verifier | Who re-runs the gate, not the author? | Add checker agent |
| Stopping condition | What exact signal ends the loop? | Runaway |
| Budget cap | Max iterations / tokens per run? | Cost blowout |
| Human checkpoint | What still requires my approval? | Cognitive surrender |
| Written memory | Where do lessons persist between runs? | Intent debt |
| Review discipline | Do I read what merged? | Comprehension debt |

### Additional credible reference (Anthropic, first-party)
- "A harness for every task: dynamic workflows in Claude Code" — https://claude.com/blog/a-harness-for-every-task-dynamic-workflows-in-claude-code (linked from Claude Code docs overview). Proprietary/all-rights-reserved: link + paraphrase only.
- Claude Code primitives that map to Osmani's components (docs, link-only): `/docs/en/skills` (Skills), `/docs/en/sub-agents` (Sub-agents), `/docs/en/hooks` (enforcement hooks), `/docs/en/memory` (CLAUDE.md + auto memory), `/docs/en/mcp` (MCP connectors), `/docs/en/routines` and `/docs/en/scheduled-tasks` + `/loop` (Automations) — all under https://code.claude.com/docs/en/
