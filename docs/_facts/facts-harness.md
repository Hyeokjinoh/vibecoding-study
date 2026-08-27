# Harness Engineering — research facts (paraphrased; no verbatim copying except marked QUOTEs)

## 0. Source licensing posture (read before citing)
- **martinfowler.com** — "Harness Engineering for Coding Agent Users", by Birgitta Böckeler (Distinguished Engineer, Thoughtworks), published 2026-04-02. Footer marks the site as © Martin Fowler. No Creative Commons or open license is stated; the site is all-rights-reserved editorial content. Safe usage: link to the URL, name the author, paraphrase, and quote at most a short attributed phrase. Do NOT reproduce diagrams, tables, or paragraphs.
- **Anthropic engineering / Claude Code docs** — © 2026 Anthropic PBC. `anthropic.com/engineering/claude-code-best-practices` now 308-redirects to `code.claude.com/docs/en/best-practices`. No open license stated; governed by Anthropic's site terms. Same rule: link + paraphrase + short attributed quote only. Code snippets in the docs are illustrative config/CLI usage and are safe to adapt as our own examples (rewrite rather than transplant).
- Practical rule for the Korean guide: every borrowed idea gets a 출처 link; all prose is ours; at most one short quoted phrase per source, in quotation marks with the URL.

---

## Harness (하네스) — the overall concept
- DEFINITION (my words): The engineered environment of rules, docs, tools and automated checks that surrounds a coding agent and constrains it toward acceptable output — the engineering discipline of building and tuning that environment rather than hand-writing the code.
- WHY IT MATTERS: An agent produces plausible code quickly; without a surrounding control system the human becomes the only quality gate and cannot scale. Investment shifts from writing code to designing the controls that make generated code trustworthy.
- CONCRETE EXAMPLE: A repo whose harness = AGENTS.md conventions + a strict tsconfig + ESLint with custom rules + a fast Vitest suite + an ArchUnit-style dependency test + a CI review agent.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html

## Guides (feedforward controls)
- DEFINITION: Controls applied *before* the agent acts, that raise the chance the first attempt is right by shaping what the agent knows and can do.
- WHY IT MATTERS: Feedback alone means the agent repeats the same mistake every session; guides encode the team's conventions once so the mistake is never made.
- CONCRETE EXAMPLE: A `SKILL.md` stating "all list endpoints must be paginated, JSON keys camelCase, version in the URL path"; a language server that lets the agent resolve real symbols instead of guessing APIs.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html
- QUOTE (<15 words): "steer [the agent] _before_ it acts"

## Sensors (feedback controls)
- DEFINITION: Controls that observe the result of the agent's work and return a signal the agent can read and act on, so it self-corrects.
- WHY IT MATTERS: Guides are unverified assumptions until something measures whether they were followed; sensors close the loop and let a run finish unattended.
- CONCRETE EXAMPLE: A pytest suite whose failure output is short, deterministic and machine-readable (`FAILED tests/test_auth.py::test_refresh - AssertionError: expected 401, got 500`) — the agent can parse it, fix, and re-run without a human.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html
- NOTE: Böckeler's point is that feedforward-only never validates the rules, feedback-only endlessly re-corrects; a working harness needs both.

## Computational controls
- DEFINITION: Deterministic, CPU-executed checks — same input, same verdict, results in milliseconds to seconds.
- WHY IT MATTERS: Cheap and trustworthy, so they can run on every edit and every commit; they are the load-bearing part of the harness.
- CONCRETE EXAMPLE: `tsc --noEmit`, ESLint, a pre-commit hook running ArchUnit tests, a coverage threshold gate.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html
- QUOTE (<15 words): "deterministic and fast, run by the CPU"

## Inferential controls
- DEFINITION: Checks or guidance produced by semantic/LLM judgment rather than fixed computation — slower, costlier, non-deterministic, but able to judge things no rule can express.
- WHY IT MATTERS: Many quality properties (is this over-engineered? is this test meaningful?) are not computable; inferential controls cover that gap, at the price of variance — so budget them for the pipeline, not every keystroke.
- CONCRETE EXAMPLE: An AI code-review subagent that reads only the diff plus PLAN.md and reports requirement gaps; an AGENTS.md; a custom linter whose message is written to be *read by an LLM* ("use repository.findBy…, not raw SQL — see src/db/README").
- SOURCE: https://martinfowler.com/articles/harness-engineering.html

## The 2x2 (Guides x Sensors) × (Computational x Inferential)
- DEFINITION: The taxonomy's grid — computational guide / computational sensor / inferential guide / inferential sensor.
- WHY IT MATTERS: A quick audit tool: map your current controls onto the grid and the empty cell tells you what your harness is missing.
- CONCRETE EXAMPLE: computational guide = language server + type stubs; computational sensor = ESLint/tests; inferential guide = AGENTS.md, skills; inferential sensor = review agent, LLM-targeted lint messages.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html

## Maintainability harness
- DEFINITION: The subset of controls regulating internal code quality — structure, duplication, complexity, test coverage, style, architectural drift.
- WHY IT MATTERS: The most mature dimension: existing static-analysis tooling transfers almost directly, so it is the cheapest place to start. Its limit is that no tool catches "you built the wrong thing".
- CONCRETE EXAMPLE: Computational — SonarQube complexity + duplication gates, coverage floor. Inferential — a reviewer agent flagging *semantically* duplicated helpers, redundant tests, or a brute-force fix that suppresses a symptom.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html

## Architecture fitness harness
- DEFINITION: Controls expressing architectural characteristics (performance, observability, security, modularity) as fitness functions — explicit, runnable definitions of "still architecturally acceptable".
- WHY IT MATTERS: Cross-cutting qualities degrade silently under high-velocity agent edits; a fitness function converts an architecture principle into a signal the agent itself can read.
- CONCRETE EXAMPLE: A k6/Gatling test asserting p95 latency < 200ms on the checkout endpoint (sensor) paired with a skill documenting the perf budget (guide); a structured-logging convention skill plus a debugging instruction that makes the agent critique its own log output.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html

## Behaviour harness
- DEFINITION: Controls for functional correctness — does the software do what was actually asked?
- WHY IT MATTERS: Böckeler calls this the weakest dimension. Today it means a written functional spec (feedforward) plus AI-generated tests and coverage numbers (feedback), which leans heavily on tests the same class of model wrote; human/manual verification is still required.
- CONCRETE EXAMPLE: An approved-fixtures / golden-file approach — a human signs off on expected outputs once, and the agent diffs its run against those fixtures; contract tests and BDD scenarios written by a human before the agent codes.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html
- QUOTE (<15 words): "This approach puts a lot of faith into the AI-generated tests"

## Steering loop
- DEFINITION: The human's primary work moves up a level: instead of correcting each output, you iterate on the harness so the recurring failure becomes improbable or impossible.
- WHY IT MATTERS: Correcting the same thing twice is a signal, not an accident. Fixing the harness makes the correction permanent and team-wide; fixing the output makes it disposable. Agents can now build harness pieces cheaply themselves.
- CONCRETE EXAMPLE: The agent keeps importing across module boundaries → rather than saying "don't" again, have it write an ArchUnit/dependency-cruiser rule that fails the build, plus one line in AGENTS.md. Next session the mistake is unrepeatable.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html

## Keep quality left (control timing)
- DEFINITION: Placing each control at the earliest lifecycle stage where it is affordable — fast cheap checks before commit, expensive ones after integration, drift/runtime checks continuously.
- WHY IT MATTERS: The earlier a defect surfaces, the cheaper it is to fix — and for an agent, an early signal arrives while the relevant context is still in the window, so it can fix it itself.
- CONCRETE EXAMPLE: pre-commit → prettier, eslint, changed-file unit tests, a quick review agent. CI → full suite, mutation testing, comprehensive architecture review agent. Continuous → dead-code and dependency drift scans, SLO alerts, sampling production response quality.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html

## Harnessability
- DEFINITION: How readily a given codebase can *have* a harness built around it.
- WHY IT MATTERS: It is a first-class technology-selection criterion now. And the cruel asymmetry: legacy systems need the harness most and support it least — so greenfield teams should design harnessability in on day one.
- CONCRETE EXAMPLE: High — TypeScript strict mode + a modular monolith with enforceable module boundaries + a mainstream framework with conventional layout: type checks, arch rules and codegen all attach easily. Low — a dynamically-typed PHP monolith with no seams, DB-coupled logic and no test harness: nothing deterministic can be asserted.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html
- QUOTE (<15 words): "The harness is most needed where it is hardest to build."

## Ambient affordances
- DEFINITION: Term credited to Ned Letcher — the structural properties of the environment itself that make a system legible, navigable and workable for an agent, independent of any explicit instruction.
- WHY IT MATTERS: Reframes architecture and tooling choices as agent-usability decisions: the environment teaches the agent by its shape, so you write fewer rules.
- CONCRETE EXAMPLE: Consistent directory conventions, a monorepo task runner where `make test` works identically in every package, explicit types, an OpenAPI schema, a README per module — the agent orients itself without being told.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html

## Harness templates
- DEFINITION: Reusable bundles of guides + sensors matched to a standard service topology and tech stack, analogous to service templates / starter kits.
- WHY IT MATTERS: Enterprises repeat 3–5 topologies (CRUD service, event processor, data dashboard); packaging the harness per topology avoids every team reinventing it — and may eventually influence which stack a team picks. Caveat: same versioning/drift problems as service templates, likely worse for non-deterministic controls.
- CONCRETE EXAMPLE: An internal `platform-crud-service` template shipping AGENTS.md, lint config, arch-rule tests, a contract-test skeleton and a CI review-agent workflow.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html

## The human as implicit harness
- DEFINITION: The unwritten controls an experienced developer applies — absorbed team conventions, taste, organizational context, accountability.
- WHY IT MATTERS: A harness is an attempt to externalize this and can never fully do so; the goal is not to remove the human but to route human attention to where it is decisive (intent, tradeoffs, sign-off).
- CONCRETE EXAMPLE: No linter flags "we deliberately avoid this library because of a licence issue two years ago" — that belongs in AGENTS.md or in a human review gate.
- SOURCE: https://martinfowler.com/articles/harness-engineering.html
- QUOTE (<15 words): "no aesthetic disgust at a 300-line function"

---

# Anthropic: practical harness setup (Claude Code best practices)
SOURCE for this whole section: https://code.claude.com/docs/en/best-practices (© 2026 Anthropic PBC; canonical redirect from anthropic.com/engineering/claude-code-best-practices)

## Give the agent a check it can run (= building a Sensor)
- DEFINITION: Supply something that returns a readable pass/fail — test suite, build exit code, linter, fixture diff, screenshot comparison — so the agent's loop closes without a human.
- WHY IT MATTERS: Without a check, "looks done" is the only stop signal and the human becomes the verification loop. This is Anthropic's operational statement of Böckeler's Sensor.
- CONCRETE EXAMPLE: Escalating strength of gate: (1) in-prompt "run the tests and iterate"; (2) a `/goal` condition re-evaluated every turn; (3) a **Stop hook** that scripts the check and blocks the turn from ending until it passes; (4) a verification subagent with fresh context. Also: demand evidence (command + output), not an assertion of success.
- QUOTE (<15 words): "If you can't verify it, don't ship it."

## CLAUDE.md / AGENTS.md as the core inferential guide
- DEFINITION: A file loaded at the start of every session carrying persistent project context the agent cannot infer from code — build commands, style deltas, test runners, repo etiquette, environment quirks, gotchas.
- WHY IT MATTERS: Its cost is paid in every conversation, so bloat is actively harmful: an over-long file makes the agent lose the rules that matter. Test for each line — "would deleting this cause a mistake?"
- CONCRETE EXAMPLE: Include "prefer running single tests, not the whole suite"; exclude "write clean code" and file-by-file descriptions. Rules only sometimes relevant → move to a Skill (loaded on demand). A rule the agent keeps breaking → convert to a hook, which is deterministic where the doc is advisory.

## Hooks vs docs (deterministic vs advisory)
- DEFINITION: Hooks are scripts fired at fixed points in the agent loop; docs are instructions the model may or may not honour.
- WHY IT MATTERS: The exact computational-vs-inferential distinction, made operational: use hooks for anything that must happen every time.
- CONCRETE EXAMPLE: A PostToolUse hook running eslint --fix after every edit; a hook that blocks any write to `migrations/`.

## Explore → Plan → Implement → Commit
- DEFINITION: Separate research and planning (plan mode, read-only) from execution, so the agent isn't solving the wrong problem quickly.
- WHY IT MATTERS: Feedforward at the task level. Worth the overhead when the change spans files or the approach is uncertain; skip it when the diff fits in one sentence.
- CONCRETE EXAMPLE: Plan mode read of `/src/auth` → written plan → implement + run tests → commit + PR. For big features: have the agent interview you and write SPEC.md, then execute in a *fresh* session against that spec.

## Context as the binding constraint
- DEFINITION: The context window holds every message, file read and command output; performance degrades as it fills.
- WHY IT MATTERS: Most other practices are downstream of this one — it justifies short CLAUDE.md, subagents, `/clear`, scoped investigations.
- CONCRETE EXAMPLE: `/clear` between unrelated tasks; `/compact Focus on the API changes`; delegate "how does token refresh work?" to a subagent that reads 40 files and returns 10 lines.

## Course correction & the two-correction rule
- DEFINITION: Interrupt early (Esc), rewind to a checkpoint (Esc Esc / /rewind), or reset; after correcting the same issue twice, clear and rewrite the prompt instead of continuing.
- WHY IT MATTERS: Accumulated failed attempts poison context; a clean session with a better prompt beats a long session full of corrections. Repeated corrections are also the trigger for a steering-loop harness change.
- CONCRETE EXAMPLE: Named failure patterns worth reusing in the guide — kitchen-sink session; correcting over and over; over-specified CLAUDE.md; trust-then-verify gap; infinite exploration.

## Adversarial review / Writer–Reviewer (inferential sensor)
- DEFINITION: A second agent with fresh context reviews only the diff plus stated criteria, so the author is not the grader.
- WHY IT MATTERS: A fresh context is unbiased toward the code it just wrote. Caveat: a reviewer asked to find gaps will always find some — scope it to correctness and stated requirements or you get over-engineering.
- CONCRETE EXAMPLE: "Use a subagent to review the rate-limiter diff against PLAN.md; report gaps, not style preferences." Or two sessions: A implements, B reviews `@src/middleware/rateLimiter.ts`, A applies B's findings.

## Non-interactive mode & fan-out (harness at scale)
- DEFINITION: `claude -p "…"` with `--output-format json|stream-json` for CI, pre-commit hooks and scripted batch work; `--allowedTools` narrows what an unattended run may do.
- WHY IT MATTERS: Lets the harness itself be automated — the agent becomes a pipeline stage subject to the same gates.
- CONCRETE EXAMPLE: `for f in $(cat files.txt); do claude -p "Migrate $f from Python 2 to 3. Return OK or FAIL." --allowedTools "Edit,Bash(git commit *)"; done` — validate on 2–3 files, then run at scale.

---

# Anthropic: Effective context engineering for AI agents
SOURCE: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents (© 2026 Anthropic PBC)

## Context engineering (vs prompt engineering)
- DEFINITION: Curating and maintaining the smallest sufficient set of tokens in the window across a whole multi-turn run — system prompt, tools, retrieved data, history — not just authoring one prompt.
- WHY IT MATTERS: In an agentic loop the prompt is a small fraction of what occupies attention; managing the rest is the real lever.
- CONCRETE EXAMPLE: Deciding that the agent reads `src/auth/token.ts` on demand instead of pre-pasting the whole auth module into the system prompt.

## Context rot / attention as a finite budget
- DEFINITION: Accuracy degrades as context grows, rooted in the transformer's n² pairwise attention over n tokens; treat context as a resource with diminishing returns.
- WHY IT MATTERS: Justifies "smallest high-signal set of tokens" as the design objective, and explains why a bloated AGENTS.md actively harms compliance.
- CONCRETE EXAMPLE: A 900-line CLAUDE.md where rule #7 is silently ignored; trimming to 40 lines restores compliance.

## System prompt altitude (the Goldilocks zone)
- DEFINITION: Write instructions at the right level of abstraction — above brittle hardcoded if/else logic, below vague aspiration.
- WHY IT MATTERS: Too prescriptive is fragile and unmaintainable; too vague gives no behavioural signal. Aim for strong heuristics.
- CONCRETE EXAMPLE: Bad-low: "if the file ends in .test.ts and the name starts with 'should', then…". Bad-high: "write good tests". Right: "one behaviour per test; no mocks for code we own; assert on observable output."

## Tool design
- DEFINITION: Tools should be self-contained, error-tolerant, and unambiguous about when to use them.
- WHY IT MATTERS: Bloated or overlapping tool sets create ambiguous decision points and waste tokens; tool surfaces are part of the harness.
- CONCRETE EXAMPLE: Replace `read_data`, `fetch_rows`, `query_db` with one `query(sql)` that returns a bounded, labelled result and an actionable error message.

## Just-in-time context retrieval
- DEFINITION: Keep lightweight identifiers (file paths, queries, links) in context and load the actual content at runtime via tools.
- WHY IT MATTERS: Mirrors how people work from an index rather than memorizing everything; keeps the window small while access stays total.
- CONCRETE EXAMPLE: Give the agent `rg`/glob plus a repo map rather than dumping 200 files; it pulls only the 6 it needs.

## Compaction
- DEFINITION: Near the window limit, summarize the conversation and restart a new window seeded with that summary.
- WHY IT MATTERS: Enables long-horizon tasks; the skill is choosing what survives — architectural decisions, open bugs, key implementation details — while dropping redundant tool output.
- CONCRETE EXAMPLE: A CLAUDE.md line: "when compacting, always keep the list of modified files and the exact test commands."

## Structured note-taking (agentic memory)
- DEFINITION: The agent writes durable notes to files outside the context window and re-reads them later.
- WHY IT MATTERS: Persistent memory at near-zero context cost; survives compaction and session boundaries.
- CONCRETE EXAMPLE: Maintaining `PROGRESS.md` / `NOTES.md` with completed steps and open questions during a multi-hour migration.

## Sub-agent architectures
- DEFINITION: Specialized sub-agents work focused tasks in clean windows and return distilled summaries to a coordinator.
- WHY IT MATTERS: Separates depth of exploration from cost to the main context — a subagent can burn 100k tokens and hand back 500.
- CONCRETE EXAMPLE: A research subagent maps the auth flow across 60 files and returns a 12-line summary plus 4 file paths.

---

# Anthropic: Building effective agents
SOURCE: https://www.anthropic.com/engineering/building-effective-agents (© 2026 Anthropic PBC)

## Workflows vs agents
- DEFINITION: Workflows orchestrate LLM calls and tools through predefined code paths; agents let the LLM direct its own process and tool use.
- WHY IT MATTERS: Predictability vs flexibility. Use the simplest thing that works — many "agent" problems are a workflow, and a workflow is cheaper, testable and debuggable.
- CONCRETE EXAMPLE: A fixed lint→test→PR-comment pipeline is a workflow; "fix this failing test in an unfamiliar repo" needs an agent.

## The augmented LLM
- DEFINITION: The base building block — a model equipped with retrieval, tools and memory, choosing its own queries, tools and what to retain.
- WHY IT MATTERS: Every pattern below composes this unit; harness work is largely improving this unit's environment.
- CONCRETE EXAMPLE: A model with repo search + a test runner + a scratch notes file.

## Named workflow patterns
- DEFINITION + EXAMPLES:
  - **Prompt chaining** — fixed sequential subtasks, each consuming the last output. Ex: generate an API spec → generate the client from it.
  - **Routing** — classify input, dispatch to a specialized prompt/model. Ex: route bug reports vs feature requests to different agents.
  - **Parallelization** — *sectioning* (independent subtasks in parallel) and *voting* (same task N times for diverse answers). Ex: sectioning = lint/security/perf reviews in parallel; voting = 3 independent judgments on "is this a real vulnerability".
  - **Orchestrator–workers** — a lead LLM decomposes an unpredictable task, delegates, then synthesizes. Ex: a multi-file refactor where the file list isn't known upfront.
  - **Evaluator–optimizer** — generator + critic in a loop until criteria are met. Ex: agent writes a migration, critic checks it against a checklist, agent revises.
- WHY IT MATTERS: Gives the study guide vocabulary for structuring multi-agent harnesses instead of ad-hoc prompting.

## The agent loop and guardrails
- DEFINITION: Receive instructions → plan → act with tools → read environmental feedback → iterate, with optional human checkpoints.
- WHY IT MATTERS: Autonomy compounds errors, so sandboxes, permission scoping and stopping conditions are mandatory, not optional.
- CONCRETE EXAMPLE: Run the loop in a container with `--allowedTools` scoping and a max-iteration cap; require human approval before push.

## ACI (agent–computer interface) design
- DEFINITION: Design the tool/interface layer for the model with the same care a UI gets for humans — clear parameter names, examples, formats that reduce model effort, room to think before acting, poka-yoke designs that make the wrong call impossible.
- WHY IT MATTERS: This is the mechanical craft underneath both Guides and Sensors; a badly formatted error message is a broken sensor.
- CONCRETE EXAMPLE: Have a tool take an absolute path only (no relative-path ambiguity to get wrong); return `FAILED <test> at <file:line>: <expected> vs <actual>` rather than a 400-line stack trace.

## Three core principles
- Simplicity of design; transparency (show the planning step explicitly); careful ACI documentation and testing.
- WHY IT MATTERS: A compact closing checklist for the guide's "how to build your own harness" section.
