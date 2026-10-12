# Methods and frameworks for working with Claude Code (status as of 2026-10-12)

Research date: 2026-10-12. Star counts are what the public GitHub repo page showed when fetched that day (WebFetch of github.com/owner/repo). GitHub repo pages fetched this way usually do NOT show the last-commit date or release date (rendered dynamically), so "last update" is often "not verified" unless a banner, changelog or search result gave a date. All performance claims from a project's own README are self-reported unless stated otherwise.

## Q1. Catalog: what each method/framework is, phases/roles, Claude Code features, token profile, maturity, strengths, weaknesses, best fit

### Takeaway
(in progress)

### Cited Findings

#### 1. BMAD Method (bmad-code-org/BMAD-METHOD)
- Repo stats on 2026-10-12: "54.1k" stars, "6.1k" forks, 2,310 commits; no release/commit date visible on the page. — [GitHub BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
- Self-description: "agile framework for AI-driven software development" covering what to build, how the parts fit and how the plan changes; it keeps decisions explicit, carries context forward "instead of re-explaining them in every chat", and scales the process to the size of the work ("Go directly to implementation for clear changes or add deeper planning for larger initiatives"; links a "Choose a Planning Path" guide). — [GitHub BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
- Delivery loop shown in README: Clarify -> Plan -> Build and verify -> Learn and adjust; draws on "product, architecture, UX, development, and testing expertise"; artifacts: briefs, specifications, architecture. — [GitHub BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
- Versions: stable v6.12 (install `npx bmad-method install`, Node.js 20.12+ and Python 3.10+, "frozen aside from bug fixes"); V7 in "preview alpha" with breaking changes expected, release targeted "October 16, 2026"; V7 installs via Agent Skills CLI (`npx skills add bmad-code-org/BMAD-METHOD`) or the Claude Code plugin marketplace (`/plugin marketplace add bmad-code-org/bmad-plugins`, plugins `bmad-method` and `bmad-core-tools`), with `bmad setup` / `bmad status`. — [GitHub BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
- No token-cost statements and no benchmarks on the README. — [GitHub BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)

#### 2. GSD - "Get Shit Done" (TACHES; gsd-build/get-shit-done -> open-gsd/gsd-core)
- github.com/glittercowboy/get-shit-done now resolves to gsd-build/get-shit-done: "64.3k" stars, "5.4k" forks, 2,928 commits; repo "archived by the owner on Jun 26, 2026" (read-only) with a "GSD Has Moved" banner: the project continues as "GSD Core" at github.com/open-gsd/gsd-core. — [GitHub gsd-build/get-shit-done](https://github.com/glittercowboy/get-shit-done)
- About text: "A light-weight and powerful meta-prompting, context engineering and spec-driven development system for Claude Code by TÂCHES." Repo tree has `agents`, `commands/gsd`, `hooks`, `sdk` folders. — [GitHub gsd-build/get-shit-done](https://github.com/glittercowboy/get-shit-done)
- Successor GSD Core (open-gsd/gsd-core) on 2026-10-12: "10.4k" stars, 747 forks, 6,153 commits, 202 open issues, 44 PRs; no release date visible. Describes itself as "a context-engineering and spec-driven development framework" with a five-step loop per milestone, one phase at a time: Discuss -> Plan -> Execute -> Verify -> Ship. Entry commands `/gsd-new-project` (greenfield) and `/gsd-onboard` (existing codebase). Heavy "research, planning, and execution work" runs in fresh-context subagents "while keeping your main session lean"; "each executor starts with a clean 200k-token context"; `STATE.md` and `CONTEXT.md` "survive session boundaries". Repo has `hooks` and `skills` folders. Install: `npx @opengsd/gsd-core@latest` (installer asks runtime and global/local). No benchmarks; claims it "solves" context rot without measurements. The README does not explain why the project moved or who maintains it now. — [GitHub open-gsd/gsd-core](https://github.com/open-gsd/gsd-core)

#### 3. GitHub Spec Kit (github/spec-kit) - spec-driven development
- Repo stats on 2026-10-12: "140.9k" stars, "12.6k" forks, 720 watchers, 2,178 commits; no release date visible. — [GitHub spec-kit](https://github.com/github/spec-kit)
- What it is: open-source toolkit that gives AI coding agents structured processes, reusable templates and documented outcomes; three entry points: Spec-Driven Development (core), Bug fixing and Idea assessment (opt-in extensions). — [GitHub spec-kit](https://github.com/github/spec-kit)
- Core commands (now invoked as agent skills, "not terminal commands"): `/speckit-constitution`, `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`, `/speckit-converge`, plus optional clarification, checklists and consistency analysis. Bug extension: `/speckit-bug-assess`, `/speckit-bug-fix`, `/speckit-bug-test` (reports in `.specify/bugs/<slug>/`; "Missing verification is not a successful fix"). Assess extension: intake -> research -> define -> shape -> decide (go / needs-clarification / kill). SDD implementation repeats until convergence reports "Converged." — [GitHub spec-kit](https://github.com/github/spec-kit)
- Install: `uv tool install specify-cli`, then `specify init <project> --integration <agent>` (Python 3.11+, uv); multi-agent (examples use GitHub Copilot; other agents via "integration key"). The README fetched did not mention Claude Code by name, though Claude Code has historically been a supported integration (see Q2/Q1 later notes). — [GitHub spec-kit](https://github.com/github/spec-kit)

#### 4. Agent OS (buildermethods/agent-os)
- Repo stats on 2026-10-12: "5.5k" stars, 829 forks, 105 watchers, 132 commits; MIT; by Brian Casel @ Builder Methods; docs at buildermethods.com/agent-os. — [GitHub agent-os](https://github.com/buildermethods/agent-os)
- Current README positions it as "a system for injecting codebase standards and writing better specs for spec-driven development" that "works alongside Claude Code, Cursor, Antigravity, and other AI tools"; four capabilities: Discover Standards, Deploy Standards, Shape Spec, Index Standards; repo has `commands/agent-os`. No token or results claims. — [GitHub agent-os](https://github.com/buildermethods/agent-os)

#### 5. SuperClaude Framework (SuperClaude-Org/SuperClaude_Framework)
- Repo stats on 2026-10-12: "23.9k" stars, "2.0k" forks, 349 commits; current stable v4.3.0; v5.0 TypeScript plugin system "in development", "No ETA has been set"; disclaimer "not affiliated with or endorsed by Anthropic". — [GitHub SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework)
- Contents: 30 slash commands (`/sc:research`, `/sc:brainstorm`, `/sc:implement`, `/sc:test`, `/sc:pm`...), "20" specialized agents, 7 behavioral modes (Brainstorming, Business Panel, Deep Research, Orchestration, Token-Efficiency, Task Management, Introspection), 8 MCP servers (Tavily, Context7, Sequential-Thinking, Serena, Playwright, Magic, Morphllm-Fast-Apply, Chrome DevTools); a `skills/confidence-check` skill. Install: `pipx install superclaude` then `superclaude install`. — [GitHub SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework)
- Self-reported, no methodology: Token-Efficiency mode "30-50% context savings"; with MCPs "2-3x faster" and "30-50% fewer tokens". — [GitHub SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework)

#### 6. CCPM - Claude Code PM (automazeio/ccpm)
- Repo stats on 2026-10-12: "8.4k" stars, 842 forks, 87 commits. — [GitHub ccpm](https://github.com/automazeio/ccpm)
- Now packaged as an Agent Skill (SKILL.md + `references/` + 14 bash scripts for deterministic ops like status/standup, which run with "no LLM token cost"); the original `/pm:*` slash-command system is preserved on the `v1` branch. Flow: PRD -> epic -> task decomposition -> GitHub Issues sync (Issues are the source of truth) -> parallel agents in git worktrees. Natural-language triggers ("break down the X epic", "sync the X epic to GitHub", "start working on issue N"). Install: clone and symlink `skill/ccpm` into `.claude/skills/ccpm`; needs git + authenticated `gh` (optional `gh-sub-issue`). — [GitHub ccpm](https://github.com/automazeio/ccpm)
- Self-reported claims ("Teams using this system report"): "89% less time lost to context switching", "75% reduction in bug rates", "Up to 3× faster feature delivery", "5–8 parallel tasks vs 1 previously"; a self-run eval "Overall" 100% with CCPM vs 27.7% without, no methodology/sample size. README is internally inconsistent about worktrees (per-epic worktree vs all agents "in the same worktree"). — [GitHub ccpm](https://github.com/automazeio/ccpm)

#### 7. Claude-Flow, now "Ruflo" (ruvnet/claude-flow -> ruvnet/ruflo)
- github.com/ruvnet/claude-flow shows `ruvnet/ruflo`: "74.4k" stars, "8.8k" forks, 458 watchers, 9,290 commits; README: "Claude Flow is now Ruflo"; old `claude-flow` naming persists in npm/MCP examples. — [GitHub ruflo](https://github.com/ruvnet/claude-flow)
- What it is: "An agent meta-harness for Claude Code and Codex" adding specialized agents, swarms, memory and cross-machine federation. Claims "100+ Agents" (CLI install: "98 agents, 60+ commands, 30 skills, MCP server, hooks, daemon"), swarms with a "Queen-led hierarchy (Raft, Byzantine, Gossip)", hierarchical/mesh/adaptive topologies, "hive mind", AgentDB vector memory, ReasoningBank learning, "314 MCP tools", "26 CLI commands", "27 Hooks", "12 auto-triggered workers". — [GitHub ruflo](https://github.com/ruvnet/claude-flow)
- Claude Code integration: MCP server (`claude mcp add claude-flow -- npx ruflo@latest mcp start`), hooks that "automatically route tasks", `/ruflo` command, plugin marketplace (`/plugin marketplace add ruvnet/ruflo`, needs Claude Code 2.1.287+), `npx ruflo init`. — [GitHub ruflo](https://github.com/ruvnet/claude-flow)
- Self-reported numbers only: "ruflo wins cold start, single turn, RSS by 1.3×–1953×" vs LangGraph/AutoGen/CrewAI (own gist); "Intelligent routing (89% accuracy)" (no source); "12.52M" ecosystem npm downloads over 12 months to Oct 4, 2026. No token-saving or SWE-bench figures on the page; README itself cautions that "Native host and AI provider execution are not demonstrated" for the console demo and learning results "depend on the configured memory, learning components and quality of feedback". — [GitHub ruflo](https://github.com/ruvnet/claude-flow)

#### 8. Superpowers (obra/superpowers; Jesse Vincent / Prime Radiant)
- Repo page on 2026-10-12 showed "298.0k stars", "26.6k forks", 1.1k watching, 684 commits, 189 open issues (number as extracted by the fetch tool; unusually high, treat as "as displayed, not independently verified"). — [GitHub superpowers](https://github.com/obra/superpowers)
- What it is: "a complete software development methodology for your coding agents" built on composable skills plus initial instructions that make the agent use them; skills "trigger automatically". — [GitHub superpowers](https://github.com/obra/superpowers)
- Workflow: brainstorming (design before building) -> using-git-worktrees (isolated branch after design approval) -> writing-plans (small tasks with file paths and verification steps) -> subagent-driven-development (fresh subagent per task, with review) or executing-plans (inline, one final review) -> test-driven-development (red-green-refactor) -> requesting-code-review / receiving-code-review -> finishing-a-development-branch (verify tests; merge, PR, keep or discard). Also systematic-debugging and verification-before-completion. — [GitHub superpowers](https://github.com/obra/superpowers)
- Install: in Anthropic's official marketplace (`/plugin install superpowers@claude-plugins-official`) or `/plugin marketplace add obra/superpowers-marketplace`. Supports many harnesses (Codex CLI/App, Cursor, Gemini CLI, Copilot CLI, OpenCode, Factory Droid, Antigravity, Kimi, Qwen, etc.). — [GitHub superpowers](https://github.com/obra/superpowers)
- Evidence: anecdotal only ("not uncommon for your agent to work autonomously for a couple hours at a time without deviating from the plan"); the troubleshooting section admits a session may "burn more tokens than you'd expect". — [GitHub superpowers](https://github.com/obra/superpowers)

#### 9. Task Master AI (eyaltoledano/claude-task-master)
- Repo stats on 2026-10-12: "28.2k" stars, "2.6k" forks, 1,216 commits, 163 issues; license "MIT with Commons Clause"; company behind it: Hamster (tryhamster.com). — [GitHub claude-task-master](https://github.com/eyaltoledano/claude-task-master)
- What it is: "An AI-powered task-management system you can drop into Cursor, Lovable, Windsurf, Roo, and others"; workflow: `task-master parse-prd` (PRD -> tasks with dependencies), `analyze_project_complexity`/complexity report, `expand_task` (subtasks), `task-master next`, `task-master research`, tags/workstreams (e.g., backlog -> in-progress). — [GitHub claude-task-master](https://github.com/eyaltoledano/claude-task-master)
- Claude Code integration: MCP server (`claude mcp add taskmaster-ai -- npx -y task-master-ai`) or CLI (`npm install -g task-master-ai`); a `claude-code/opus` / `claude-code/sonnet` provider that "uses your local Claude instance" with no API key; model roles main / research / fallback. — [GitHub claude-task-master](https://github.com/eyaltoledano/claude-task-master)
- Token cost is documented: MCP tool-loading modes `all` 36 tools "~21,000 tokens", `standard` 15 tools "~10,000 tokens", `core`/`lean` 7 tools "~5,000 tokens" ("~70% token reduction" for core). No results claims. — [GitHub claude-task-master](https://github.com/eyaltoledano/claude-task-master)

#### 10. Compound Engineering plugin (EveryInc/compound-engineering-plugin; Every)
- Repo stats on 2026-10-12: "25.5k" stars, "2.1k" forks, 1,448 commits; maintained by Kieran Klaassen and Trevin Chow. — [GitHub compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin)
- What it is: "a plugin of 36 skills for AI coding agents" around a loop brainstorm -> plan -> build -> review -> capture learnings; philosophy: "Each unit of engineering work should make subsequent units easier -- not harder"; "80% is in planning and review, 20% is in execution". Commands: `/ce-brainstorm`, `/ce-plan`, `/ce-work`, `/ce-simplify-code`, `/ce-code-review`, `/ce-compound` (writes learnings to `docs/solutions/`), `/lfg` (run the whole loop). Tagline: "Run one teaches it. Run two remembers." — [GitHub compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin)
- Install: `/plugin marketplace add EveryInc/compound-engineering-plugin` then `/plugin install compound-engineering`; "runs on 14 agent hosts" (Claude Code, Cursor, Codex, OpenCode, Copilot, etc.). No token or benchmark claims. — [GitHub compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin)

#### 11. HumanLayer: Research -> Plan -> Implement (RPI) / ACE-FCA, and 12-factor agents
- Repo humanlayer/advanced-context-engineering-for-coding-agents on 2026-10-12: "2.7k" stars, 210 forks, 46 commits; contains `ace-fca.md` (the essay) plus newer files `benchmarking-new-models-on-slop-code-bench.md`, `benchmarking-opus-5-on-slop-code-bench.md`, `wsff.md`, `side-quests/`. — [GitHub ACE-FCA repo](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents)
- (essay details pending)

(remaining frameworks pending)

### Inferences
(pending)

### Gaps
(pending)
