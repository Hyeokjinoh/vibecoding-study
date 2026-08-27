# Verified facts: Claude Code harness features

NOTE: Official docs moved from `docs.claude.com/en/docs/claude-code/*` to `code.claude.com/docs/en/*` (301 redirects). URLs below are the current canonical ones. All wording below is paraphrased, not copied.

---

## 1. Memory / CLAUDE.md

- Two persistence mechanisms exist: CLAUDE.md files (written by you) and "auto memory" (notes Claude writes itself). Both load at conversation start.
- CLAUDE.md is delivered as a user message after the system prompt — it is context, not enforced config. For hard enforcement use a PreToolUse hook instead.
- Four scopes, loaded broadest → most specific (later text sits closer to Claude):
  1. Managed policy (org-wide, cannot be excluded)
  2. User: `~/.claude/CLAUDE.md`
  3. Project: `./CLAUDE.md` or `./.claude/CLAUDE.md`
  4. Local personal: `./CLAUDE.local.md` (gitignore it)
- Managed-policy paths: macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`; Linux/WSL `/etc/claude-code/CLAUDE.md`; Windows `C:\Program Files\ClaudeCode\CLAUDE.md`. Alternative: a `claudeMd` string key inside `managed-settings.json`.
- Files are concatenated, not overridden. Every CLAUDE.md / CLAUDE.local.md from the filesystem root down to the cwd loads at launch; per-directory files below cwd load lazily when Claude reads files there. Within a directory, `CLAUDE.local.md` is appended after `CLAUDE.md`.
- Imports: `@path/to/file` inside a CLAUDE.md pulls that file into context at launch. Relative paths resolve against the importing file. Recursive imports allowed, max depth 4 hops. Paths inside backticks or fenced code blocks are not treated as imports. Imports in a *project* file that resolve outside the working directory trigger a one-time approval dialog.
- Imports do NOT save context — the imported file still loads at launch. To actually reduce context, use path-scoped rules.
- `.claude/rules/*.md` (and `~/.claude/rules/`) split instructions into topic files; recursive discovery. A `paths:` YAML frontmatter list scopes a rule to glob-matching files so it loads only when Claude touches them. Rules with no `paths` load at launch at the same priority as `.claude/CLAUDE.md`. User rules load before project rules.
- Size guidance: aim under 200 lines per CLAUDE.md; a file over 4 MiB is skipped entirely.
- `/init` generates a starting CLAUDE.md by analyzing the codebase; if one exists it proposes improvements rather than overwriting. It also reads Cursor (`.cursor/rules/`, `.cursorrules`) and Copilot (`.github/copilot-instructions.md`) rules. `CLAUDE_CODE_NEW_INIT=1` enables an interactive multi-phase flow that can also set up skills and hooks.
- `/memory` lists CLAUDE.md / CLAUDE.local.md / other memory locations across user+project scope, opens any of them in your editor (creating it if absent), and toggles auto memory. `/context` shows which memory files actually loaded this session.
- Claude Code reads `CLAUDE.md`, not `AGENTS.md`. Bridge them with an `@AGENTS.md` import or a symlink.
- `claudeMdExcludes` (glob list, any settings layer) skips unwanted ancestor CLAUDE.md files in monorepos; managed-policy files cannot be excluded.
- Auto memory: on by default (`autoMemoryEnabled`), stored per repo at `~/.claude/projects/<project>/memory/` with a `MEMORY.md` index; only the first 200 lines or 25KB of MEMORY.md loads each session. Disable via `CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`. Relocate with `autoMemoryDirectory`.
- Project-root CLAUDE.md is re-read from disk and re-injected after `/compact`.

- CONFIG: `./CLAUDE.md`, `./.claude/CLAUDE.md`, `~/.claude/CLAUDE.md`, `./CLAUDE.local.md`, `.claude/rules/*.md`
- EXAMPLE:
  ```markdown
  # Project rules
  - Use 2-space indentation
  - Run `npm test` before committing
  See @README for overview and @docs/git-instructions.md for the git workflow.
  ```
  Path-scoped rule at `.claude/rules/api.md`:
  ```markdown
  ---
  paths:
    - "src/api/**/*.ts"
  ---
  All API endpoints must validate input.
  ```
- SOURCE: https://code.claude.com/docs/en/memory
- CONFIDENCE: high

---

## 2. settings.json

- Five sources, highest precedence first:
  1. Managed settings — `managed-settings.json`, MDM, or the claude.ai console (org)
  2. Command line — `claude --settings <file-or-json>` (this session)
  3. Project local — `.claude/settings.local.json` (you, this project; keep out of git)
  4. Shared project — `.claude/settings.json` (committed, whole team)
  5. User — `~/.claude/settings.json` (you, every project)
- A key set at a higher level overrides the same key set lower. List-valued keys (e.g. `claudeMdExcludes`, permission arrays) merge across layers rather than replacing.
- Common keys: `permissions` (`allow` / `deny` / `ask` / `defaultMode` / `additionalDirectories` / `disableBypassPermissionsMode` / `disableAutoMode`), `hooks`, `env`, `model`, `claudeMd`, `claudeMdExcludes`, `autoMemoryEnabled`, `autoMemoryDirectory`, `worktree.baseRef`, `cleanupPeriodDays`, `disableAllHooks`.
- Permission rules: `allow` runs without prompting, `ask` always prompts, `deny` blocks. Evaluation order is deny → ask → allow; first match wins and specificity does not reorder it. A broad deny beats a narrower allow.
- Rule syntax is `Tool` or `Tool(specifier)`. A bare tool name in `deny` removes the tool from Claude's context entirely; a scoped rule like `Bash(rm *)` leaves the tool available and blocks matching calls. `Bash(*)` == `Bash`.
- Specifier forms: exact command `Bash(npm run build)`; prefix wildcard `Bash(git diff *)` (note the space before `*`); path `Read(./.env)`; domain `WebFetch(domain:example.com)`; parameter matching for deny/ask only, `Agent(model:opus)`, `Bash(run_in_background:true)`.
- `/permissions` shows every active rule plus the settings file it came from.
- Verify with `/config`, `/doctor`, or `claude doctor` (resolved settings).

- CONFIG: `~/.claude/settings.json`, `.claude/settings.json`, `.claude/settings.local.json`, managed `managed-settings.json`
- EXAMPLE:
  ```json
  {
    "permissions": {
      "defaultMode": "plan",
      "allow": ["Bash(npm run test:*)", "Read"],
      "ask": ["Bash(git push *)"],
      "deny": ["Read(./.env)", "Bash(rm -rf *)"]
    },
    "env": { "NODE_ENV": "test" }
  }
  ```
- SOURCE: https://code.claude.com/docs/en/settings and https://code.claude.com/docs/en/permissions
- CONFIDENCE: high

---

## 3. Plan mode

- Plan mode makes Claude research and propose changes without writing them: it reads files and runs exploratory shell commands, produces a plan, and edits stay blocked until you approve.
- Enter: press `Shift+Tab` until the status bar reads `⏸ plan mode on`; or prefix one prompt with `/plan`; or start with `claude --permission-mode plan`.
- Exit without approving: press `Shift+Tab` again.
- Shift+Tab cycle in the CLI: from `auto` the first press goes to `default` (labeled "Manual"), then the cycle is `default` → `acceptEdits` → `plan` → back to `default`. Optional modes slot in after `plan` (`bypassPermissions` first, `auto` last) and only when enabled. `dontAsk` never appears in the cycle.
- Status bar strings: `⏸ manual mode on`, `⏵⏵ accept edits on`, `⏸ plan mode on`, `⏵⏵ auto mode on`, `⏵⏵ don't ask on`, `⏵⏵ bypass permissions on`.
- Approval prompt options: approve and use auto mode (or auto-accept edits), approve with manual edit review, or keep planning. Approving exits plan mode and switches the session's permission mode.
- `Ctrl+G` opens the proposed plan in your text editor before you accept it.
- Make it the default with `permissions.defaultMode: "plan"` in `.claude/settings.json`. (VS Code uses `claudeCode.initialPermissionMode` instead.)
- Full mode list: `default` (Manual, alias `manual`), `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`.

- CONFIG: `claude --permission-mode plan` | `{"permissions": {"defaultMode": "plan"}}`
- EXAMPLE: `claude --permission-mode plan` then describe the change; press Shift+Tab to leave.
- SOURCE: https://code.claude.com/docs/en/permission-modes
- CONFIDENCE: high

---

## 4. Hooks

- Hooks are shell commands (or HTTP calls, MCP tool calls, prompts, or agents) that Claude Code executes at fixed lifecycle points, regardless of what the model decides.
- Event types include:
  - Session: `SessionStart`, `SessionEnd`, `Setup`
  - Per turn: `UserPromptSubmit`, `UserPromptExpansion`, `Stop`, `StopFailure`
  - Tool: `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PermissionRequest`, `PermissionDenied`, `PostToolBatch`
  - Other: `Notification`, `MessageDisplay`, `SubagentStart`, `SubagentStop`, `TaskCreated`, `TaskCompleted`, `InstructionsLoaded`, `ConfigChange`, `CwdChanged`, `DirectoryAdded`, `FileChanged`, `WorktreeCreate`, `WorktreeRemove`, `PreCompact`, `PostCompact`, `Elicitation`, `ElicitationResult`, `TeammateIdle`
- Config lives under a `hooks` key in any settings file, or in skill/subagent frontmatter, or a plugin's `hooks/hooks.json`. `"disableAllHooks": true` turns them all off.
- Matcher syntax: exact name (`Bash`), alternation (`Edit|Write`), unanchored JavaScript regex (`^Notebook`, `mcp__memory__.*`), `"*"` or omitted for all. For non-tool events the matcher filters event-specific values — e.g. `SessionStart` accepts `startup`, `resume`, `clear`, `compact`, `fork`.
- Exit-code semantics:
  - `0` = success; stdout parsed as JSON if valid, otherwise plain text (visible to Claude for `UserPromptSubmit` and `SessionStart`, otherwise debug log only).
  - `2` = **blocking error**. The action is blocked on events that support blocking (`PreToolUse`, `UserPromptSubmit`, `Stop`, `PostToolBatch`, …). JSON cannot override it; the reason comes from stderr or the JSON decision reason.
  - any other code = non-blocking error; the action still proceeds, though valid JSON decision fields are still honored.
- Structured output goes under `hookSpecificOutput`, with fields such as `hookEventName`, `permissionDecision` (`allow` / `deny` / `escalate`), `permissionDecisionReason`, `additionalContext`, `updatedInput`, `systemMessage`.
- Hook input arrives on stdin as JSON: `session_id`, `transcript_path`, `cwd`, `permission_mode`, `hook_event_name`, plus `tool_name` / `tool_input` / `tool_use_id` on tool events.
- Path placeholders: `${CLAUDE_PROJECT_DIR}`, `${CLAUDE_PLUGIN_ROOT}`, `${CLAUDE_PLUGIN_DATA}`. Default timeout 600s for command/http/mcp_tool.

- CONFIG: `hooks` key in `~/.claude/settings.json` / `.claude/settings.json` / `.claude/settings.local.json`
- EXAMPLE:
  ```json
  {
    "hooks": {
      "PostToolUse": [
        {
          "matcher": "Edit|Write",
          "hooks": [
            { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/format.sh" }
          ]
        }
      ]
    }
  }
  ```
  Blocking form: the script writes the reason to stderr and `exit 2`.
- SOURCE: https://code.claude.com/docs/en/hooks
- CONFIDENCE: high

---

## 5. Subagents

- A subagent is a specialized assistant that runs in its own isolated context window, so its file reads, logs, and tool output never enter the main conversation — only its final report comes back.
- Definition file: markdown with YAML frontmatter.
- Locations and priority (highest first): managed settings (org) → `--agents` CLI flag (session) → `.claude/agents/` (project) → `~/.claude/agents/` (user).
- Frontmatter fields:
  - `name` (required) — unique identifier, lowercase with hyphens
  - `description` (required) — when Claude should delegate to it
  - `tools` (optional) — allowed tool list; inherits all if omitted
  - `model` (optional) — `sonnet` / `opus` / `haiku` / `inherit`
  - `permissionMode`, `skills` (preload), `memory` (`user`/`project`/`local`), `maxTurns`, `isolation: worktree`, `disallowedTools`
- Invocation: name it in a prompt ("use the code-reviewer agent…"), @-mention it to guarantee it runs, or run the whole session as one with `claude --agent code-reviewer`.
- Subagents can nest (about 3 layers deep by default) and can run in the background. The main conversation's auto memory is not loaded into a subagent (except a `fork`, which inherits the parent context).

- CONFIG: `.claude/agents/<name>.md` or `~/.claude/agents/<name>.md`
- EXAMPLE:
  ```markdown
  ---
  name: code-reviewer
  description: Reviews code for quality and best practices
  tools: Read, Glob, Grep
  model: sonnet
  ---
  You are a code reviewer. Give specific, actionable feedback on quality,
  security, and best practices.
  ```
- SOURCE: https://code.claude.com/docs/en/sub-agents
- CONFIDENCE: high

---

## 6. Agent Skills

- A skill is a `SKILL.md` file of instructions that loads only when used, so long reference material costs almost no context until needed. Claude can load one automatically when relevant, or you invoke it as `/skill-name`.
- Locations (conflict resolution: enterprise > personal > project; any of these overrides a bundled skill of the same name):
  - Enterprise: via managed settings
  - Personal: `~/.claude/skills/<skill-name>/SKILL.md`
  - Project: `.claude/skills/<skill-name>/SKILL.md`
  - Plugin: `<plugin>/skills/<skill-name>/SKILL.md`
- Frontmatter — all fields optional, `description` strongly recommended:
  `name` (display name; defaults to directory name), `description` (what it does + when to use it; drives automatic loading), `when_to_use`, `argument-hint`, `arguments`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `disallowed-tools`, `model`, `effort`, `context: fork`, `agent`, `background`, `hooks`, `paths`, `shell`, `metadata`, `license`.
- Progressive disclosure: only skill *descriptions* sit in context so Claude knows what exists; the full body loads only on invocation. Combined `description` + `when_to_use` is truncated at 1,536 characters in the listing, so put the key use case first.
- Who invokes: default = both. `disable-model-invocation: true` → only you (description is not even kept in context). `user-invocable: false` → only Claude (hidden from the `/` menu).
- Lifecycle: once invoked, the rendered SKILL.md stays in the conversation for the rest of the session; Claude Code does not re-read the file on later turns. `allowed-tools` grants clear at your next message.
- Dynamic context: a `` !`command` `` line in the body is executed and replaced with its output before Claude sees the skill.
- Skills may carry supporting files in their directory.

- CONFIG: `.claude/skills/<name>/SKILL.md` or `~/.claude/skills/<name>/SKILL.md`
- EXAMPLE:
  ```markdown
  ---
  name: summarize-changes
  description: Summarizes uncommitted changes and flags risks. Use when the user asks what changed or wants a commit message.
  allowed-tools: Read Grep
  ---
  ## Current changes
  !`git diff HEAD`

  ## Instructions
  Summarize in 2-3 bullets, then list risks.
  ```
- SOURCE: https://code.claude.com/docs/en/skills
- CONFIDENCE: high

---

## 7. Slash commands

- Custom commands have been folded into skills: `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both produce `/deploy` and behave the same. Existing `.claude/commands/` files keep working; the skills form adds a directory for supporting files and richer frontmatter.
- Personal commands live under `~/.claude/`, project commands under the repo's `.claude/`.
- Arguments: `$ARGUMENTS` is replaced with everything typed after the command name. Positional access is `$ARGUMENTS[0]`, `$ARGUMENTS[1]`, … or the shorthand `$0`, `$1`, `$2`. Named positional arguments can be declared with the `arguments` frontmatter field. If a skill has no `$ARGUMENTS`, Claude Code appends `ARGUMENTS: <your input>` to the content.
- You can stack commands at the start of one message: `/write-tests /fix-issue 123` loads both and passes `123` to each (first skill plus up to five more).
- Useful frontmatter for commands: `description`, `argument-hint` (autocomplete hint, e.g. `[issue-number]`), `allowed-tools`, `model`, `disable-model-invocation: true` (so Claude never fires a `/deploy`-style command on its own).
- Inline shell output via `` !`command` `` and file references via `@path` work inside the body.

- CONFIG: `.claude/commands/<name>.md` (project) or `~/.claude/commands/<name>.md` (personal)
- EXAMPLE:
  ```markdown
  ---
  description: Fix a GitHub issue
  argument-hint: [issue-number]
  disable-model-invocation: true
  ---
  Fix GitHub issue $ARGUMENTS following our coding standards:
  1. Read the issue  2. Implement  3. Write tests  4. Commit
  ```
  Run it as `/fix-issue 123`.
- SOURCE: https://code.claude.com/docs/en/skills
- CONFIDENCE: high (the `.claude/commands/` path and `$ARGUMENTS` are stated directly; command-specific frontmatter is documented under the merged skills frontmatter table)

---

## 8. MCP

- Add a server with `claude mcp add`. Related commands: `claude mcp add-json`, `claude mcp list`, `claude mcp get <name>`, `claude mcp remove <name>`, `claude mcp login/logout <name>`, `claude mcp reset-project-choices`. In-session status: `/mcp`.
- Scopes:
  - `local` (default) — stored in `~/.claude.json`, current project only
  - `--scope project` — stored in `.mcp.json` at the project root, shared through git
  - `--scope user` — stored in `~/.claude.json`, all your projects
  Precedence: local → project → user → plugin servers → claude.ai connectors.
- Transports: `--transport http` (recommended for remote), `--transport sse` (deprecated), `--transport stdio` (local process; put `--` before the server's own command and args), and `ws` via `add-json`.
- `.mcp.json` holds an `mcpServers` object keyed by server name; each entry has `type` + `url` (+ `headers`) for remote servers, or `command` + `args` + `env` for stdio. `${VAR}` and `${VAR:-default}` expand in `url`, `command`, `args`, `env`, `headers`.
- Project-scoped servers require workspace-trust approval before first use.
- Relevant env vars: `MCP_TIMEOUT` (startup, default 30s), `MAX_MCP_OUTPUT_TOKENS`.

- CONFIG: `.mcp.json` at project root; `~/.claude.json` for local/user scope
- EXAMPLE:
  ```bash
  claude mcp add --scope project --transport http notion https://mcp.notion.com/mcp
  claude mcp add --transport stdio airtable --env AIRTABLE_API_KEY=KEY -- npx -y airtable-mcp-server
  ```
  ```json
  { "mcpServers": { "notion": { "type": "http", "url": "https://mcp.notion.com/mcp" } } }
  ```
- SOURCE: https://code.claude.com/docs/en/mcp
- CONFIDENCE: high

---

## 9. Headless / programmatic mode

- `claude -p "<prompt>"` (alias `--print`) runs non-interactively. Exit code 0 on success, non-zero on failure; SIGTERM exits 143.
- `--output-format`: `text` (default), `json` (result + session_id + usage/cost metadata, text in the `result` field), `stream-json` (newline-delimited JSON events; pair with `--verbose` and `--include-partial-messages` for token streaming; the last line is a `result` message).
- `--json-schema '<JSON Schema>'` with `--output-format json` returns schema-conforming data in a `structured_output` field.
- `--allowedTools "Bash,Read,Edit"` pre-approves tools; it uses the same permission rule syntax as settings, so `Bash(git diff *)` works (the space before `*` matters). `--permission-mode` also works with `-p`; `dontAsk` is the locked-down choice for CI, `acceptEdits` for auto-applied edits.
- `--bare` skips auto-discovery of hooks, skills, commands, subagents, plugins, MCP servers, auto memory, and CLAUDE.md — recommended for CI reproducibility. In bare mode set `ANTHROPIC_API_KEY` (no OAuth/keychain). Without `--bare`, a `-p` run in an untrusted folder still executes that project's hooks and MCP servers with no trust dialog.
- Session continuation: `--continue` for the most recent conversation, `--resume <session_id>` for a specific one (capture the id from `--output-format json`).
- Other useful flags: `--max-turns`, `--append-system-prompt` / `--system-prompt`, `--settings`, `--mcp-config`, `--agents`, `--add-dir`, `--verbose`. Stdin is read (10MB cap), so piping works.
- The `system/init` stream event reports model, tools, plugins (`plugins` / `plugin_errors`) and MCP servers (`mcp_servers` / `mcp_server_errors`) — use these arrays to fail a CI job when something didn't load.
- GitHub Actions: set up with `/install-github-app` from a repo (installs the Claude GitHub App, stores `ANTHROPIC_API_KEY` or `CLAUDE_CODE_OAUTH_TOKEN` as a repo secret, opens a PR with the workflow). Manual path: install github.com/apps/claude, add the secret, copy `examples/claude.yml` into `.github/workflows/`.
  - Interactive mode = no `prompt` input; Claude responds to `@claude` mentions in issues/PR comments. Automation mode = a `prompt` input is given; the run fires on any event including `schedule`.
  - `claude_args` passes CLI flags through, e.g. `--max-turns 5 --model … --allowedTools "…"`.
  - Triggering actor must have write access and must not be a bot (unless listed in `allowed_bots`).

- CONFIG: `claude -p` flags; `.github/workflows/claude.yml` using `anthropics/claude-code-action@v1`
- EXAMPLE:
  ```bash
  claude -p "Run the test suite and fix any failures" --allowedTools "Bash,Read,Edit"
  claude --bare -p "Summarize README.md" --allowedTools "Read" --output-format json | jq -r '.result'
  ```
  ```yaml
  - uses: anthropics/claude-code-action@v1
    with:
      anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
      prompt: "Generate a summary of yesterday's commits"
      claude_args: '--model claude-opus-4-8 --allowedTools "mcp__github__list_commits"'
  ```
- SOURCE: https://code.claude.com/docs/en/headless and https://code.claude.com/docs/en/github-actions
- CONFIDENCE: high

---

## 10. Git worktrees for parallel agents

- A git worktree is a separate working directory on its own branch sharing one repository history, so two Claude sessions can edit without colliding.
- Built-in flag: `claude --worktree <name>` (short `-w`). It creates `.claude/worktrees/<name>/` at the repo root on a new branch `worktree-<name>` and starts the session there. Omit the name and Claude generates one. Run it again with another name in a second terminal for a parallel session. The repo needs at least one commit.
- Add `.claude/worktrees/` to `.gitignore`.
- Branch from a PR/MR: `claude --worktree "#1234"` (or a GitHub/GitLab URL) creates `.claude/worktrees/pr-<number>`.
- Base branch is controlled by the `worktree.baseRef` setting: `"fresh"` (default, branches from the remote default branch) or `"head"` (branches from your local HEAD).
- `.worktreeinclude` at the project root (gitignore syntax) copies matching gitignored files such as `.env` into each newly created worktree.
- Subagent isolation: ask Claude to "use worktrees for your agents", or set `isolation: worktree` in a subagent's frontmatter so it always runs in its own worktree. Claude Code removes an unchanged subagent worktree automatically; ones with changes survive until the periodic sweep (governed by `cleanupPeriodDays`) can remove them safely.
- While isolated, Claude Code blocks edits targeting the main checkout, commands whose cwd resolves into it, git redirects (`git -C`, `--git-dir`, `GIT_DIR`, `GIT_WORK_TREE`, a `cd` back), and shell shapes it cannot statically verify (brace expansion, unquoted heredocs).
- In-session tools: `EnterWorktree` / `ExitWorktree`. Resuming a worktree session returns it to that worktree.
- Cleanup on exit: a clean unnamed worktree is removed automatically; anything with work prompts to keep or remove. `-p` runs never prompt, so remove those with `git worktree remove` (`git worktree unlock` first if locked).
- Manual alternative: `git worktree add ../project-feature-a -b feature-a`, `cd` in and run `claude`; list with `git worktree list`; remove with `git worktree remove <path>`.

- CONFIG: `claude --worktree <name>`; `{"worktree": {"baseRef": "head"}}`; `.worktreeinclude`
- EXAMPLE:
  ```bash
  # terminal 1
  claude --worktree feature-auth
  # terminal 2
  claude --worktree bugfix-456
  ```
  ```markdown
  ---
  name: refactorer
  description: Applies mechanical refactors across many files
  isolation: worktree
  ---
  Apply the refactor, run the tests, report results.
  ```
- SOURCE: https://code.claude.com/docs/en/worktrees and https://code.claude.com/docs/en/common-workflows#run-parallel-sessions-with-worktrees
- CONFIDENCE: high

---

## 설치와 인증 (보강 수집분, 2026-08-28)

- FACT: 권장 설치 방법은 npm 이 아니라 **네이티브 인스톨러**다. 네이티브 설치본은 백그라운드에서 자동 업데이트된다.
- CONFIG (macOS / Linux / WSL): `curl -fsSL https://claude.ai/install.sh | bash`
- CONFIG (Windows PowerShell): `irm https://claude.ai/install.ps1 | iex`
- CONFIG (Homebrew): `brew install --cask claude-code` — 안정 채널. `claude-code@latest` 는 최신 채널. **Homebrew 설치본은 자동 업데이트되지 않는다** (`brew upgrade claude-code`).
- CONFIG (WinGet): `winget install Anthropic.ClaudeCode` — 자동 업데이트 없음
- FACT: Debian/Fedora/RHEL/Alpine 은 apt, dnf, apk 로도 설치 가능하다.
- FACT: 설치 확인은 `claude --version`. 버전 번호 뒤에 `(Claude Code)` 가 출력된다.
- SOURCE: https://code.claude.com/docs/en/quickstart
- CONFIDENCE: high

### 인증
- FACT: `claude` 를 처음 실행하면 로그인 프롬프트가 뜬다. 세션 안에서 `/login` 을 치면 계정 전환·재인증이 된다.
- FACT: `ANTHROPIC_API_KEY` 환경변수가 설정되어 있으면 로그인 프롬프트를 건너뛰고 키 승인만 묻는다.
- FACT: 지원 계정 — Claude Pro/Max/Team/Enterprise 구독(권장), Claude Console(선불 크레딧, 최초 로그인 시 "Claude Code" 워크스페이스 자동 생성), Amazon Bedrock / Google Cloud Agent Platform / Microsoft Foundry, 자체 호스팅 Claude apps gateway(기업 SSO).
- FACT: 한 번 로그인하면 자격 증명이 저장되어 재로그인이 필요 없다.
- SOURCE: https://code.claude.com/docs/en/quickstart , https://code.claude.com/docs/en/authentication
- CONFIDENCE: high

### 권한 모드 (중요 정정)
- FACT: 첫 세션에서는 모든 변경 전에 승인을 묻는다.
- FACT: 첫 세션 이후, **Pro/Max/Team 플랜의 대화형 터미널 세션은 `auto` 모드로 시작한다.** auto 모드에서는 사람 대신 분류기가 행동을 검토하며, 대부분의 파일 편집과 명령 실행이 승인 없이 진행된다.
- FACT: 그 외 플랜은 **`Manual` 모드**로 시작한다.
- FACT: 설정이나 조직 정책이 시작 모드를 바꿀 수 있다. `Shift+Tab` 으로 세션 중 언제든 모드를 전환한다.
- SOURCE: https://code.claude.com/docs/en/quickstart , https://code.claude.com/docs/en/permission-modes
- CONFIDENCE: high

### 기본 명령
- CONFIG: `claude` (대화형) / `claude "task"` (초기 프롬프트와 함께) / `claude -p "query"` (일회성 후 종료) / `claude -c` (최근 대화 이어가기) / `claude -r` (이전 대화 선택 재개)
- CONFIG: 세션 내 `/clear`, `/help`, `/exit` (또는 Ctrl+D 두 번), `/resume`
- SOURCE: https://code.claude.com/docs/en/quickstart
- CONFIDENCE: high

---

## 컨텍스트·비용 관리 (보강 수집분, 2026-08-28)

### /context 와 /usage
- FACT: `/context` 는 **무엇이 컨텍스트 공간을 차지하고 있는지** 보여준다. MCP 서버 오버헤드 점검 용도로 문서가 직접 권한다.
- FACT: `/usage` 는 현재 세션의 토큰 사용량 통계를 보여준다. Pro/Max/Team/Enterprise 는 스킬·서브에이전트·플러그인·MCP 서버별 사용량 귀속(attribution) 내역과, 최근 사용량의 10% 이상을 차지하는 동작(긴 컨텍스트, 캐시 미스 등) 플래그도 표시한다.
- FACT: 상태 표시줄에 컨텍스트 사용량을 상시 표시하도록 설정할 수 있다.
- SOURCE: https://code.claude.com/docs/en/costs
- CONFIDENCE: high

### CLAUDE.md 비대화 (3장 핵심)
- FACT: CLAUDE.md 는 **세션 시작 시 컨텍스트에 로드된다.** 특정 워크플로용 상세 지시가 들어 있으면 무관한 작업을 할 때도 그 토큰을 계속 지불한다.
- FACT: 스킬은 **호출될 때만** 로드되므로, 전문적인 지시는 스킬로 옮기면 기본 컨텍스트가 작아진다.
- FACT: 공식 권장치 — **CLAUDE.md 는 200줄 이하로 유지하고 필수적인 것만 넣는다.**
- SOURCE: https://code.claude.com/docs/en/costs
- CONFIDENCE: high

### 훅으로 센서 출력을 다듬기 (4장 핵심 예제)
- FACT: 훅은 Claude 가 보기 전에 데이터를 전처리할 수 있다. 1만 줄 로그를 통째로 읽는 대신, 훅이 `ERROR` 만 grep 해서 넘기면 수만 토큰이 수백 토큰이 된다.
- EXAMPLE (settings.json, PreToolUse 로 Bash 명령 자체를 바꿔치기):
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "~/.claude/hooks/filter-test-output.sh" }
        ]
      }
    ]
  }
}
```
- FACT: 훅 스크립트는 stdin 으로 JSON 을 받고, `hookSpecificOutput.updatedInput` 으로 도구 입력을 수정해 돌려줄 수 있다. `permissionDecision: "allow"` 를 함께 낸다.
- FACT: 설정 확인은 `/hooks` 로 PreToolUse 아래에 나타나는지 본다. `claude --debug` 로 실행하면 훅이 명령을 바꿨을 때 `modified tool input keys: [command]` 가 디버그 로그에 찍힌다.
- SOURCE: https://code.claude.com/docs/en/costs , https://code.claude.com/docs/en/hooks
- CONFIDENCE: high

### 서브에이전트로 장황한 출력 격리 (5장)
- FACT: 테스트 실행·문서 조회·로그 처리처럼 출력이 많은 작업을 서브에이전트에 위임하면, 장황한 출력은 서브에이전트의 컨텍스트에 남고 **요약만** 본 대화로 돌아온다.
- FACT: 단순한 서브에이전트 작업은 `model: haiku` 를 지정할 수 있다.
- SOURCE: https://code.claude.com/docs/en/costs , https://code.claude.com/docs/en/sub-agents
- CONFIDENCE: high

### 되돌리기와 조기 개입 (1장)
- FACT: Escape 로 즉시 중단한다. `/rewind` 또는 Escape 두 번으로 대화와 코드를 이전 체크포인트로 되돌린다.
- FACT: 검증 대상을 프롬프트에 주면(테스트 케이스, 기대 출력) Claude 가 스스로 검증해 수정 요청 전에 문제를 잡는다.
- SOURCE: https://code.claude.com/docs/en/costs
- CONFIDENCE: high
