# Methods and frameworks for working with Claude Code: comparison catalog (status as of 2026-10-12)

How this was researched (read before using the numbers):
- Research date: 2026-10-12. Star and fork counts are what the public GitHub repo page showed that day (WebFetch of github.com/owner/repo, extracted by a small model, so small rounding errors are possible). Two counts look unusually high and are flagged: Superpowers ("298.0k") and Spec Kit ("140.9k"). Treat the relative order as more reliable than the exact numbers.
- GitHub repo pages fetched this way did NOT show last-commit or release dates (they load dynamically). "Last update" is therefore "not verified" unless a banner, release-note page or dated article gave a date.
- These hosts could not be reached from this environment (DNS failure or 5xx): ghuntley.com, kiro.dev, martinfowler.com, buildermethods.com, chaseai.io, everydev.ai, arxiv.org, github.com/garrytan/gstack (504) and the anthropics/claude-code plugins README (503). Facts about those come from search-engine result summaries and are labeled that way.
- Numbers a project publishes about itself are self-reported. Third-party and vendor write-ups are labeled.

## Q1. Catalog: what each method is, phases and roles, Claude Code features, token profile, maturity, strengths, weaknesses, best fit

### Takeaway
The field has settled into five families:
- (a) Spec-driven toolkits: GitHub Spec Kit, OpenSpec, Kiro-style specs, Agent OS.
- (b) Phase-loop "context engineering" systems: GSD (now GSD Core), HumanLayer's Research -> Plan -> Implement, Anthropic's long-running-agent harness, the Ralph loop.
- (c) Skills-based method libraries: Superpowers, Compound Engineering, gstack, CCPM (now a skill).
- (d) Role or persona "agile team" frameworks: BMAD, SuperClaude.
- (e) Heavy multi-agent swarms: Ruflo, formerly Claude-Flow.

Nearly all of them now ship as Agent Skills or Claude Code plugins, and most also support other agent tools, not only Claude Code.

### Cited Findings

#### 1. BMAD Method (bmad-code-org/BMAD-METHOD)
- **Repo stats (2026-10-12):** "54.1k" stars, "6.1k" forks, 2,310 commits. The page shows no release or commit date. — [GitHub BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
- **What it is:** an "agile framework for AI-driven software development". It covers what to build, how the parts fit and how the plan changes. It keeps decisions explicit and carries context forward "instead of re-explaining them in every chat".
  - It sizes the process to the work: "Go directly to implementation for clear changes or add deeper planning for larger initiatives", with a "Choose a Planning Path" guide.
  - README loop: Clarify -> Plan -> Build and verify -> Learn and adjust.
  - It draws on "product, architecture, UX, development, and testing expertise". Artifacts: briefs, specifications, architecture.
  - — [GitHub BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
- **Versions:**
  - Stable v6.12: `npx bmad-method install` (Node.js 20.12+, Python 3.10+). It is "frozen aside from bug fixes".
  - V7: "preview alpha", breaking changes expected, release targeted "October 16, 2026". V7 installs through the Agent Skills CLI (`npx skills add bmad-code-org/BMAD-METHOD`) or the Claude Code plugin marketplace (`/plugin marketplace add bmad-code-org/bmad-plugins`, plugins `bmad-method` and `bmad-core-tools`). It adds `bmad setup` and `bmad status`.
  - The README makes no token-cost claims and shows no benchmarks.
  - — [GitHub BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
- **Roles** (from v4/v6 references and guides; the current README no longer names them):
  - Analyst "Mary", Product Manager "John", Architect "Winston", Developer "Amelia", Scrum Master "Bob" (sprint planning, story preparation), plus QA and UX roles.
  - The Scrum Master turns the PRD and architecture into "hyper-detailed", self-contained story files that hold everything the Dev agent needs. Dev implements one story at a time, then QA reviews.
  - v6 creates epics and stories AFTER the architecture.
  - Planning tracks: Quick Flow (a tech spec, skips architecture), BMad Method, Enterprise.
  - — [Mintlify BMAD agents reference](https://www.mintlify.com/bmad-code-org/BMAD-METHOD/reference/agents/overview); [codemyspec.com (third-party)](https://codemyspec.com/blog/bmad-method-explained); [augmentcode.com guide (vendor, third-party)](https://www.augmentcode.com/guides/bmad-method-ai-development)

#### 2. GSD, "Get Shit Done" (by TACHES), now GSD Core
- **Original repo:** github.com/glittercowboy/get-shit-done now resolves to gsd-build/get-shit-done.
  - Stats: "64.3k" stars, "5.4k" forks, 2,928 commits.
  - "archived by the owner on Jun 26, 2026" (read-only), with a "GSD Has Moved" banner pointing to github.com/open-gsd/gsd-core.
  - About text: "A light-weight and powerful meta-prompting, context engineering and spec-driven development system for Claude Code by TÂCHES".
  - The repo tree has `agents`, `commands/gsd`, `hooks` and `sdk`, and READMEs in several languages, including Portuguese.
  - — [GitHub gsd-build/get-shit-done](https://github.com/glittercowboy/get-shit-done)
- **GSD Core (open-gsd/gsd-core):**
  - Stats: "10.4k" stars, 747 forks, 6,153 commits, 202 open issues.
  - Self-description: "a context-engineering and spec-driven development framework".
  - Loop per milestone, one phase at a time: Discuss -> Plan -> Execute -> Verify -> Ship.
  - Entry commands: `/gsd-new-project` (new project) and `/gsd-onboard` (existing codebase).
  - Heavy "research, planning, and execution work" runs in fresh-context subagents "while keeping your main session lean". "Each executor starts with a clean 200k-token context." `STATE.md` and `CONTEXT.md` "survive session boundaries".
  - The repo has `hooks` and `skills` folders. Install: `npx @opengsd/gsd-core@latest`.
  - No benchmarks.
  - — [GitHub open-gsd/gsd-core](https://github.com/open-gsd/gsd-core)
- **Releases and lineage:** GSD Core releases are published under open-gsd. v1.14.0 was the latest seen in a release tracker. Guides describe it as "formerly Get Shit Done", aimed at solo builders. A Japanese article credits TACHES and says the system targets context degradation in long sessions. — [newreleases.io GSD Core v1.14.0](https://newreleases.io/project/github/open-gsd/gsd-core/release/v1.14.0); [developertoolkit.ai (third-party)](https://developertoolkit.ai/en/ecosystem/frameworks/gsd/); [pasqualepillitteri.it (third-party, JA)](https://pasqualepillitteri.it/ja/news/1643/gsd-framework-claude-code-ai-kaihatsu)

#### 3. GitHub Spec Kit (github/spec-kit)
- **Repo stats (2026-10-12):** "140.9k" stars (as displayed), "12.6k" forks, 720 watchers, 2,178 commits. — [GitHub spec-kit](https://github.com/github/spec-kit)
- **What it is:** an open-source toolkit that gives AI coding agents "structured processes, reusable templates, and documented outcomes".
- **Core SDD commands** (invoked as agent skills, "not terminal commands"): `/speckit-constitution`, `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement`, `/speckit-converge`. Clarification, checklists and consistency analysis are optional. Implementation repeats until convergence reports "Converged."
- **Opt-in extensions:**
  - Bug fixing: `/speckit-bug-assess`, `/speckit-bug-fix`, `/speckit-bug-test`. Ends with a "verified / partial / failed" verdict, and "Missing verification is not a successful fix".
  - Idea assessment: intake -> research -> define -> shape -> decide, ending in "go / needs-clarification / kill".
- **Install:** `uv tool install specify-cli`, then `specify init <project> --integration <agent>` (Python 3.11+, uv). Other agents are supported through "integration key" values.
- The README fetched did not name Claude Code.
- — [GitHub spec-kit](https://github.com/github/spec-kit)
- **Thoughtworks Technology Radar:** Spec Kit adds "richer orchestration, configurable prompts and a 'constitution'" of immutable principles. The Radar warns that some SDD tools generate lengthy spec files that are hard to review. — [Thoughtworks Radar: spec-driven development](https://www.thoughtworks.com/radar/techniques/spec-driven-development)

#### 4. Kiro-style specs (AWS Kiro): requirements / design / tasks
- **Three files per feature:**
  - `requirements.md`: user stories and acceptance criteria in EARS notation, e.g. "WHEN ... THE [system] SHALL ...".
  - `design.md`: architecture, sequence diagrams, implementation considerations.
  - `tasks.md`: discrete, trackable implementation tasks.
- **Flow:** requirements -> design -> tasks -> execution, with decision points between phases. If requirements change later, "Refine" updates the design and tasks. There is also a requirements-first feature-spec path.
- Sources: [Kiro docs: concepts](https://kiro.dev/docs/specs/concepts); [Kiro docs: requirements-first](https://kiro.dev/docs/specs/feature-specs/requirements-first/). Both were seen through search summaries; kiro.dev itself could not be reached.
- The format is plain Markdown that other tools can use. Third parties package it as skills for other agents. — [smithery.ai kiro-specs skill (third-party)](https://smithery.ai/skills/peterfile/kiro-specs)

#### 5. OpenSpec (Fission-AI/OpenSpec): added as a notable lighter SDD option
- **Repo stats (2026-10-12):** "71.7k" stars, 4.9k forks, 969 commits, 128 open issues. Self-description: "Spec-driven development (SDD) for AI coding assistants". — [GitHub OpenSpec](https://github.com/Fission-AI/OpenSpec)
- **Flow:**
  1. `/opsx:explore`
  2. `/opsx:propose <name>` creates `openspec/changes/<name>/` with `proposal.md`, `specs/` deltas, `design.md` and `tasks.md`.
  3. `/opsx:apply`
  4. `/opsx:archive` moves the change to `changes/archive/<date>-<name>/` and merges the spec deltas into the living specs.
  - An expanded profile adds `/opsx:verify`, `/opsx:ff`, `/opsx:continue` and `/opsx:onboard`. Spec deltas use "## ADDED Requirements" with WHEN/THEN scenarios.
- **Philosophy:** "fluid not rigid", "iterative not waterfall", "built for brownfield not just greenfield".
- **How it positions itself against Spec Kit** (competitor bias): calls Spec Kit "Thorough but heavyweight", with "Rigid phase gates, lots of Markdown, Python setup".
- **Practical details:** supports "30+ tools". Install: `npm install -g @fission-ai/openspec@latest`, then `openspec init` (Node 20.19+). Advises clearing context before implementation ("benefits from a clean context window"). No benchmarks; the project is "built with OpenSpec".
- — [GitHub OpenSpec](https://github.com/Fission-AI/OpenSpec)

#### 6. Agent OS (buildermethods/agent-os), now v3
- **Repo stats (2026-10-12):** "5.5k" stars, 829 forks, 132 commits. MIT license; by Brian Casel @ Builder Methods.
- **Current positioning:** "a system for injecting codebase standards and writing better specs for spec-driven development" that "works alongside Claude Code, Cursor, Antigravity, and other AI tools". Four capabilities: Discover Standards, Deploy Standards, Shape Spec, Index Standards. No token or results claims.
- — [GitHub agent-os](https://github.com/buildermethods/agent-os)
- **v3 (January 2026, "Leaner and more aligned for 2026"):** narrows Agent OS to standards and hands spec writing to the agent's native plan mode.
  - `/discover-standards` pulls standards out of a codebase, `/inject-standards` adds them to any context, and an `index.yml` auto-detects which standards are relevant.
  - `/shape-spec` improves plan mode with targeted questions informed by your standards and product mission, then saves the plan into the spec folder.
  - The product files (mission, roadmap, tech-stack) remain.
  - Rationale: Claude Code's plan mode, extended thinking and better models now do much of the scaffolding earlier versions provided.
  - — [Agent OS v3 discussion #310](https://github.com/buildermethods/agent-os/discussions/310); [Agent OS migration guide](https://buildermethods.com/agent-os/migration) (seen through a search summary); [codemyspec.com review (third-party)](https://codemyspec.com/blog/agent-os-review)

#### 7. SuperClaude Framework (SuperClaude-Org/SuperClaude_Framework)
- **Repo stats (2026-10-12):** "23.9k" stars, "2.0k" forks, 349 commits.
- **Versions:** current stable v4.3.0. A v5.0 TypeScript plugin system is "in development" with "No ETA". The README states it is "not affiliated with or endorsed by Anthropic".
- **Contents:**
  - 30 slash commands, such as `/sc:research`, `/sc:brainstorm`, `/sc:implement`, `/sc:test`, `/sc:pm`.
  - "20" specialized agents.
  - 7 modes: Brainstorming, Business Panel, Deep Research, Orchestration, Token-Efficiency, Task Management, Introspection.
  - 8 MCP servers: Tavily, Context7, Sequential-Thinking, Serena, Playwright, Magic, Morphllm-Fast-Apply, Chrome DevTools.
  - A `confidence-check` skill.
- **Install:** `pipx install superclaude`, then `superclaude install`.
- **Self-reported, no method given:** Token-Efficiency mode gives "30-50% context savings". With MCPs it is "2-3x faster" with "30-50% fewer tokens".
- — [GitHub SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework)

#### 8. CCPM, Claude Code PM (automazeio/ccpm)
- **Repo stats (2026-10-12):** "8.4k" stars, 842 forks, 87 commits.
- **Packaging:** now an Agent Skill (`SKILL.md`, `references/`, and 14 bash scripts for deterministic jobs like status and standup, which run with "no LLM token cost"). The original `/pm:*` slash commands are kept on the `v1` branch.
- **Flow:** PRD -> epic -> task breakdown -> sync to GitHub Issues (Issues are the source of truth) -> parallel agents in git worktrees. Natural-language triggers, e.g. "break down the X epic", "start working on issue N".
- **Install:** symlink `skill/ccpm` into `.claude/skills/ccpm`. Needs git and an authenticated `gh`.
- **Self-reported claims** ("Teams using this system report"):
  - "89% less time lost to context switching"
  - "75% reduction in bug rates"
  - "Up to 3× faster feature delivery"
  - "5–8 parallel tasks vs 1 previously"
  - A self-run eval scoring "Overall" 100% vs 27.7%, with no method or sample size.
- The README contradicts itself on worktrees: one worktree per epic vs all agents "in the same worktree".
- — [GitHub ccpm](https://github.com/automazeio/ccpm)

#### 9. Ruflo, formerly Claude-Flow (ruvnet/claude-flow -> ruvnet/ruflo)
- **Repo stats (2026-10-12):** "74.4k" stars, "8.8k" forks, 9,290 commits. The README says "Claude Flow is now Ruflo". — [GitHub ruflo](https://github.com/ruvnet/claude-flow)
- **What it is:** "An agent meta-harness for Claude Code and Codex". It claims:
  - "100+ Agents" (the CLI install mentions "98 agents, 60+ commands, 30 skills, MCP server, hooks, daemon").
  - Swarms with a "Queen-led hierarchy (Raft, Byzantine, Gossip)", a "hive mind", and hierarchical, mesh and adaptive topologies.
  - AgentDB vector memory and ReasoningBank learning.
  - "314 MCP tools", "27 Hooks", "12 auto-triggered workers".
- **Claude Code integration:** an MCP server (`claude mcp add claude-flow -- npx ruflo@latest mcp start`), and a plugin marketplace (`/plugin marketplace add ruvnet/ruflo`, requires Claude Code 2.1.287+).
- **Self-reported numbers:**
  - "ruflo wins cold start, single turn, RSS by 1.3×–1953×" against LangGraph, AutoGen and CrewAI (measured on the project's own gist).
  - "Intelligent routing (89% accuracy)", with no source given.
  - "12.52M" npm downloads over the 12 months to Oct 4, 2026.
- **The README's own caveats:** "Native host and AI provider execution are not demonstrated" for the console demo. Learning results "depend on ... quality of feedback".
- — [GitHub ruflo](https://github.com/ruvnet/claude-flow)

#### 10. Superpowers (obra/superpowers; Jesse Vincent / Prime Radiant)
- **Repo stats (2026-10-12):** "298.0k stars" (as displayed; unusually high, not independently checked), "26.6k forks", 684 commits.
- **What it is:** "a complete software development methodology for your coding agents", built from composable skills that "trigger automatically".
- **Flow:**
  1. brainstorming: design before building.
  2. using-git-worktrees: an isolated branch after the design is approved.
  3. writing-plans: "small tasks with file paths and verification steps".
  4. subagent-driven-development (a fresh subagent per task) OR executing-plans (run inline, with one final review).
  5. test-driven-development: red-green-refactor.
  6. requesting-code-review and receiving-code-review.
  7. finishing-a-development-branch.
  - Also included: systematic-debugging and verification-before-completion.
- **Install:** it is in Anthropic's official marketplace (`/plugin install superpowers@claude-plugins-official`). It also supports 15+ other agent tools (Codex, Cursor, Gemini CLI, Copilot CLI, OpenCode...).
- **Evidence and cost remarks:** anecdotal only, "not uncommon for your agent to work autonomously for a couple hours at a time without deviating from the plan". The troubleshooting section says a session may "burn more tokens than you'd expect".
- — [GitHub superpowers](https://github.com/obra/superpowers)

#### 11. Ralph Wiggum loop (Geoffrey Huntley) and Anthropic's ralph plugin
- **Original technique:** about a 5-line bash loop. It pipes a prompt file into the agent, checks the result (tests) and loops until it passes.
- **Anthropic's plugin:** by late 2025 Boris Cherny, head of Claude Code, formalized it as the official `ralph-wiggum` plugin.
  - A Stop hook blocks Claude from exiting and resends the prompt until a user-defined "completion promise" phrase appears.
  - `--max-iterations` caps the loop, e.g. `--completion-promise "COMPLETE" --max-iterations 50`. Without either setting it can run forever.
- **Criticism and context:** commentators call the plugin's mechanics "opaque" (its state sits in a markdown file and is sensitive to permissions). Huntley and Dex Horthy compared the two versions in January 2026.
- — [VentureBeat](https://venturebeat.com/ai/how-ralph-wiggum-went-from-the-simpsons-to-the-biggest-name-in-ai-right-now); [DreamHost blog (third-party)](https://www.dreamhost.com/blog/ralph-wiggum/)

#### 12. RIPER-5 and other mode-based protocols
- **What it is:** five modes, Research, Innovate, Plan, Execute, Review. It began as a pasted "mode" rule for Claude 3.7 in Cursor.
  - Research mode allows reading files and asking questions, and forbids suggestions, implementation and planning.
  - Review checks the implementation against the plan and flags any deviation.
  - The user must explicitly signal each mode switch, and every response must declare its current mode.
  - — [Cursor forum: "I created an amazing mode called RIPER-5"](https://forum.cursor.com/t/i-created-an-amazing-mode-called-riper-5-mode-fixes-claude-3-7-drastically/65516)
- **Claude Code ports:** community ports exist as skills and commands (`/riper:research`, `/riper:innovate`, `/riper:plan`, `/riper:execute`, `/riper:review`, `/riper:workflow`). There is no official spec. — [Substack "Claude Code's Agentic Toolkit" (third-party)](https://0xmakereth.substack.com/p/claude-codes-agentic-toolkit)

#### 13. Task Master AI (eyaltoledano/claude-task-master)
- **Repo stats (2026-10-12):** "28.2k" stars, "2.6k" forks, 1,216 commits. License "MIT with Commons Clause". The company behind it is Hamster (tryhamster.com).
- **Flow:** `parse-prd` (PRD -> tasks with dependencies) -> complexity analysis -> `expand_task` (subtasks) -> `next` -> `research`, plus tags and workstreams.
- **Claude Code integration:** an MCP server (`claude mcp add taskmaster-ai -- npx -y task-master-ai`) or a CLI. A `claude-code/opus|sonnet` provider "uses your local Claude instance" with no API key. Model roles: main, research, fallback.
- **Documented token cost of its tools:**
  - `all`: 36 tools, "~21,000 tokens"
  - `standard`: 15 tools, "~10,000 tokens"
  - `core`/`lean`: 7 tools, "~5,000 tokens" ("~70% token reduction")
- — [GitHub claude-task-master](https://github.com/eyaltoledano/claude-task-master)

#### 14. Compound Engineering plugin (EveryInc/compound-engineering-plugin; Every)
- **Repo stats (2026-10-12):** "25.5k" stars, "2.1k" forks, 1,448 commits. Maintained by Kieran Klaassen and Trevin Chow.
- **What it is:** "a plugin of 36 skills". Loop: brainstorm -> plan -> build -> review -> capture learnings.
  - "Each unit of engineering work should make subsequent units easier -- not harder."
  - "80% is in planning and review, 20% is in execution."
- **Commands:** `/ce-brainstorm`, `/ce-plan`, `/ce-work`, `/ce-simplify-code`, `/ce-code-review`, `/ce-compound` (writes learnings to `docs/solutions/`), and `/lfg` (runs the full loop). Tagline: "Run one teaches it. Run two remembers."
- **Install:** `/plugin marketplace add EveryInc/compound-engineering-plugin`, then `/plugin install compound-engineering`. It "runs on 14 agent hosts". No token or benchmark claims.
- — [GitHub compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin)

#### 15. HumanLayer: Research -> Plan -> Implement (RPI) / "ACE-FCA"
- **Repo:** "2.7k" stars, 210 forks. It contains `ace-fca.md` and newer 2026 files such as `benchmarking-opus-5-on-slop-code-bench.md`. — [GitHub ACE-FCA repo](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents)
- **Method:** "frequent intentional compaction", i.e. "designing your ENTIRE WORKFLOW around context management", "keeping utilization in the 40%-60% range".
  - Research maps the relevant code and information flow.
  - Plan lists exact steps, the files to edit and the verification steps.
  - Implement goes phase by phase, compacting status back into the plan file.
  - "Subagents are about context control."
  - Human review focuses on research and plans: "a bad line of a plan could lead to hundreds of bad lines of code".
  - Commands: `.claude/commands/research_codebase.md`, `create_plan.md`, `implement_plan.md` in humanlayer/humanlayer.
  - — [ace-fca.md (raw)](https://raw.githubusercontent.com/humanlayer/advanced-context-engineering-for-coding-agents/main/ace-fca.md)
- **Cost and limits:**
  - "our team of three is averaging about $12k on opus per month".
  - Admitted failures: a parquet-java attempt "did not go well", and a two-week race-condition rabbit hole.
  - It needs "at least one person who is an expert in the codebase", and the author says the approach "probably isn't" right for most teams.
  - — [ace-fca.md (raw)](https://raw.githubusercontent.com/humanlayer/advanced-context-engineering-for-coding-agents/main/ace-fca.md)

#### 16. Anthropic's own: official marketplace, feature-dev plugin, long-running-agent harness
- **Official marketplace (anthropics/claude-plugins-official):**
  - Stats: "37.7k" stars, 4,383 commits.
  - "Official, Anthropic-managed directory". `/plugins` holds Anthropic's own plugins and `/external_plugins` holds third-party ones that "must meet quality and security standards for approval".
  - Install: `/plugin install {name}@claude-plugins-official`.
  - Warning: "Anthropic does not control what MCP servers, files, or other software are included in plugins".
  - — [GitHub claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
- **`feature-dev` plugin** (Anthropic, v1.0.0): `/feature-dev` runs 7 phases.
  1. Discovery.
  2. Codebase Exploration: 2-3 parallel `code-explorer` agents, which return file:line references.
  3. Clarifying Questions: waits for your answers.
  4. Architecture Design: 2-3 `code-architect` agents (minimal / clean / pragmatic); you choose one.
  5. Implementation: only after explicit approval.
  6. Quality Review: 3 parallel `code-reviewer` agents that report only high-confidence issues (threshold 80).
  7. Summary.
  - "Don't use for" single-line or trivial fixes or urgent hotfixes. Agents "can be slow on large codebases".
  - — [GitHub anthropics/claude-code plugins/feature-dev](https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev)
- **"Effective harnesses for long-running agents"** (Anthropic Engineering, November 26, 2025):
  - An initializer session creates `init.sh`, a `claude-progress.txt` log, a JSON feature list with a `passes` field (initially false; agents may only change that field) and an initial git commit.
  - JSON was chosen because the model is less likely to inappropriately overwrite it than Markdown.
  - Each later coding session runs `pwd`, reads the git log and progress file, picks the highest-priority unfinished feature, starts the app and runs a basic end-to-end test, then works on "one feature at a time", commits and updates the progress file.
  - Failure modes it targets: one-shotting the app and running out of context; "declaring victory" early; marking features done without end-to-end testing.
  - Browser testing (Puppeteer MCP) "dramatically improved performance". The claude.ai-clone example produced over 200 features. No quantitative benchmark.
  - — [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

#### 17. gstack (garrytan/gstack): added as a notable role-based skills pack
- **What it is:** an open-source Claude Code skills pack by YC CEO Garry Tan.
  - Skills map to roles: CEO, designer, eng manager, release manager, doc engineer, QA.
  - Examples: `/plan-ceo-review` (founder-style plan review), `/qa` (tests a web app with Playwright-backed Chromium and fixes bugs), `/qa-only` (report only), `/ship` (sync, test, push, PR, docs).
  - — [augmentcode.com (vendor, third-party)](https://www.augmentcode.com/learn/garry-tan-open-sources-gstack-claude-code); [horadecodar.com.br (PT-BR, third-party): roles CEO, Designer, Eng Manager, QA](https://horadecodar.com.br/papeis-gstack-claude-code/)
- **Stars not verified** (the repo page timed out). Third-party snapshots conflict: an article titled "gstack hits 89.7K stars" (spring 2026), while later listings report roughly 112k-132k. — [augmentcode.com](https://www.augmentcode.com/learn/garry-tan-gstack-hits-89.7K-stars)

### Inferences

**Comparison table** (synthesized from the findings above. The token profile is my classification, based on the number of parallel agents, the size of the always-loaded prompt and tool definitions, and loop behavior.)

| Framework | Phases / roles (short) | Claude Code features | Token profile | Maturity / status on 2026-10-12 | Best fit |
|---|---|---|---|---|---|
| BMAD | Analyst -> PM -> Architect -> Scrum Master (story files) -> Dev -> QA; Quick Flow / BMad / Enterprise tracks | Skills + plugin marketplace (V7), npm installer (v6.12) | Medium-heavy (many planning docs, several personas); Quick Flow lighter | 54.1k stars; v6.12 bug-fix only; V7 alpha, release targeted 2026-10-16 | Larger new products where a PRD and architecture pay off; team-like role play |
| GSD -> GSD Core | Discuss -> Plan -> Execute -> Verify -> Ship; researchers, planner, executors in fresh 200k contexts | Commands, subagents, hooks, skills; npx | Heavy in full mode (see Q3) | Original 64.3k stars, archived 2026-06-26; GSD Core 10.4k stars, releases to v1.14.0 | Solo builders running multi-phase projects with enough budget |
| Spec Kit | constitution -> specify -> plan -> tasks -> implement -> converge (+ bug and assess) | Commands as skills; Python/uv CLI | Medium (many Markdown artifacts) | 140.9k stars (as displayed); actively extended | New features needing explicit specs; teams; mixed-agent shops |
| Kiro-style specs | requirements (EARS) -> design -> tasks -> execute, with gates | Format only (portable via skills / CLAUDE.md) | Light | Kiro product feature; format portable | Any feature where acceptance criteria matter |
| OpenSpec | explore -> propose -> apply -> archive into living specs | `/opsx:*` commands; npm CLI | Light | 71.7k stars; active | Existing (brownfield) codebases, iterative changes, solo devs |
| Agent OS v3 | discover/inject/index standards; `/shape-spec` on top of native plan mode | Commands; relies on plan mode | Light | 5.5k stars; slimmed in v3 (Jan 2026) | Keeping agents aligned to house conventions |
| SuperClaude | 30 `/sc:` commands, 20 agents, 7 modes | Commands, agents, 8 MCP servers | Medium-heavy with the MCP stack (has a token-efficiency mode) | 23.9k stars; v4.3.0; v5 "No ETA" | Power users who want a big command palette |
| CCPM | PRD -> epic -> tasks -> GitHub Issues -> parallel worktree agents | Skill + 14 bash scripts; gh; worktrees | Medium per task; heavy with many parallel agents | 8.4k stars; repackaged as a skill | Teams already living in GitHub Issues |
| Ruflo (Claude-Flow) | Queen-led swarms, hive mind, 100+ agents, memory | MCP (314 tools), hooks, plugin, daemon | Very heavy | 74.4k stars; renamed; active | Multi-agent orchestration experiments, not tight budgets |
| Superpowers | brainstorm -> worktree -> plan -> subagent per task -> TDD -> review -> finish | Auto-triggered skills, subagents, official marketplace | Medium (cheaper inline variant exists) | Very high star count (unverified); in the official marketplace | Solo devs who want discipline: TDD, review, small tasks |
| Ralph loop | Repeat one prompt until a completion promise is output / tests pass | Stop-hook plugin or bash loop | Light per iteration, heavy in total if uncapped | Technique; official plugin since late 2025 | Mechanical, well-specified tasks with objective tests |
| RIPER-5 | Research -> Innovate -> Plan -> Execute -> Review, explicit mode switches | Rules / CLAUDE.md or community skills | Light | Community prompt from 2025; no official home | Cheap "no code before an approved plan" discipline |
| Task Master | PRD -> dependency-ordered tasks -> expand -> next | MCP (36 tools) or CLI | Medium (tool definitions 5k-21k tokens) | 28.2k stars; company-backed | Turning a PRD into a backlog |
| Compound Engineering | brainstorm -> plan -> work -> review -> compound (learnings) | 36 skills; plugin; 14 hosts | Medium (planning- and review-heavy) | 25.5k stars; active | Long-lived codebases where lessons should accumulate |
| HumanLayer RPI | Research -> Plan -> Implement at 40-60% context | Commands + research subagents | Heavy as practiced ($12k/month for 3 devs); the principle itself is cheap | Essay from 2025; repo updated with 2026 benchmark docs | Complex existing codebases with an expert reviewer |
| Anthropic feature-dev | 7 phases; explorers, architects, reviewers; 5 approval points | Plugin: one command + 3 agent types | Medium-heavy per run (up to ~8 subagents) | Official (Anthropic) | Multi-file features with unclear requirements |
| Anthropic long-running harness | Initializer -> coding sessions, one feature each, progress file + feature JSON + git | Any harness / Agent SDK | Light per session | Official article (Nov 2025) + quickstart code | Multi-session projects; designing handoffs |
| gstack | CEO, eng-manager and designer plan reviews; `/qa`; `/ship` | Skills as slash commands | Medium (not measured) | Stars unverified; frequent releases | Solo founders who want a "virtual team" of reviewers |

**Strengths and weaknesses** (my synthesis):
- **BMAD.** Strength: story files carry full context to the developer agent. Weakness: lots of ceremony and documents; the V7 transition means unstable docs right now.
- **GSD / GSD Core.** Strength: strong context isolation and state files. Weaknesses: token-hungry, and the project changed orgs (users must migrate).
- **Spec Kit.** Strengths: the most widely adopted and multi-agent. Weaknesses: verbose Markdown; heavy for small changes (Thoughtworks warning; OpenSpec's critique, which is biased).
- **OpenSpec and Kiro-style specs.** Strength: cheap and readable acceptance criteria. Weakness: little built-in verification beyond `/opsx:verify` and the approval gates.
- **Agent OS v3.** Strength: small and complementary to native plan mode. Weakness: no longer a full workflow.
- **SuperClaude.** Strength: broad command set. Weaknesses: many MCP dependencies, a slowing roadmap, and unverified performance claims.
- **CCPM.** Strength: GitHub Issues make progress visible to humans. Weaknesses: needs `gh` and bash; claims are self-reported; small project.
- **Ruflo.** Strength: the most features. Weaknesses: the most complexity and token use; many self-reported numbers.
- **Superpowers.** Strengths: proven discipline (design gate, small tasks, TDD, verification), easy plugin install. Weakness: can "burn more tokens than you'd expect".
- **Ralph.** Strength: simple and autonomous. Weaknesses: needs objective completion checks and a cap, otherwise it wastes tokens.
- **RIPER-5.** Strength: zero setup. Weakness: largely superseded by native plan mode; community-only.
- **Task Master.** Strength: good dependency-aware breakdown. Weaknesses: MCP tool definitions eat context; the license restricts resale.
- **Compound Engineering.** Strength: the only one with an explicit learning-capture step. Weakness: review-heavy.
- **HumanLayer RPI.** Strength: the best-documented reasoning about context budgets, with an honest failure list. Weakness: costly at their scale and needs expert review.
- **feature-dev.** Strengths: official, with clear approval checkpoints. Weakness: several parallel agents per run.
- **Anthropic harness.** Strength: the clearest handoff design (progress file + JSON pass/fail list + git). Weakness: it is a pattern, not a packaged tool.

### Gaps
- Last-commit and release dates for most repos were not visible on the fetched pages, so "last update" is not verified except for: the GSD archive date (2026-06-26), BMAD V7's target (2026-10-16), Agent OS v3 (Jan 2026) and Ruflo's downloads-to date (Oct 4, 2026).
- The Superpowers ("298.0k") and Spec Kit ("140.9k") star counts look anomalous and could be extraction errors. gstack's stars are unverified.
- The original GSD's file set (PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md, PLAN.md, SUMMARY.md) and its quality/balanced/budget model profiles are known only from background knowledge. They were not visible on the archived page or the GSD Core README.
- The GSD Core README does not say why the project moved orgs or who maintains it now.
- Huntley's own Ralph write-up (ghuntley.com) could not be reached. Its well-known claims (e.g., building the "CURSED" language, a contract delivered for a few hundred dollars of tokens) are therefore NOT verified here.
- Kiro's newer spec features (e.g., property-based testing, bugfix specs) could not be checked (kiro.dev unreachable).
- humanlayer/12-factor-agents was not fetched. From background knowledge (unverified this session) it is a set of principles for building LLM apps (e.g., own your prompts and context window, small focused agents) rather than a Claude Code workflow.
- No primary source was found for any 2026 successor to HumanLayer's RPI.
- Details of Anthropic's `code-review` / `pr-review-toolkit` plugins were not retrieved (HTTP 503).
- An official current list of BMAD V7 roles was not retrieved; the role names above come from v4/v6-era references.
- Other popular config collections (e.g., "everything-claude-code", "oh-my-claudecode", wshobson/agents) were not researched (budget).

## Q2. Which ones are still actively maintained in late 2026 vs abandoned?

### Takeaway
None of the major frameworks is simply dead. But GSD changed homes: the original repo was archived on 2026-06-26 and work continues as GSD Core. Several others are shrinking or repackaging as Claude Code absorbs their features natively (plan mode, subagents, skills, plugins). Agent OS v3 explicitly handed spec writing to native plan mode. CCPM became a single skill. SuperClaude's next major version has no ETA. RIPER-5 survives only as community prompts.

### Cited Findings
- **GSD:** original repo "archived by the owner on Jun 26, 2026"; it continues as GSD Core at open-gsd/gsd-core (6,153 commits, 202 open issues; releases up to v1.14.0). — [GitHub gsd-build/get-shit-done](https://github.com/glittercowboy/get-shit-done); [GitHub open-gsd/gsd-core](https://github.com/open-gsd/gsd-core); [newreleases.io](https://newreleases.io/project/github/open-gsd/gsd-core/release/v1.14.0)
- **BMAD:** v6.12 "frozen aside from bug fixes"; V7 "preview alpha" targeted for "October 16, 2026". — [GitHub BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
- **Agent OS:** v3 (Jan 2026) narrowed to standards because "AI coding tools have evolved significantly since Agent OS's original release in mid-2025", with plan mode now doing much of the scaffolding. — [Agent OS v3 discussion #310](https://github.com/buildermethods/agent-os/discussions/310)
- **SuperClaude:** stable v4.3.0; the v5.0 plugin system has "No ETA". — [GitHub SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework)
- **CCPM:** converted to an Agent Skill, with the old `/pm:*` system "preserved on the v1 branch"; 87 commits in total. — [GitHub ccpm](https://github.com/automazeio/ccpm)
- **Claude-Flow:** renamed Ruflo. Its marketplace install requires Claude Code 2.1.287+, and it reports 12.52M npm downloads over 12 months through Oct 4, 2026, both of which point to recent activity. — [GitHub ruflo](https://github.com/ruvnet/claude-flow)
- **Spec Kit:** added opt-in bug and assess extensions and a `/speckit-converge` step. — [GitHub spec-kit](https://github.com/github/spec-kit)
- **OpenSpec:** moved to a new `/opsx:*` command set. — [GitHub OpenSpec](https://github.com/Fission-AI/OpenSpec)
- **Superpowers:** now installable from Anthropic's official marketplace; supports 15+ other agent tools. — [GitHub superpowers](https://github.com/obra/superpowers)
- **Compound Engineering:** now 36 skills under `/ce-*` commands, running on "14 agent hosts". — [GitHub compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin)
- **Task Master:** 1,216 commits, backed by the company Hamster. — [GitHub claude-task-master](https://github.com/eyaltoledano/claude-task-master)
- **HumanLayer:** the ACE-FCA repo gained 2026 model-benchmark documents (e.g., Opus 5 on "slop-code-bench"). — [GitHub ACE-FCA repo](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents)
- **RIPER-5:** originated for Claude 3.7 in Cursor; only community variants exist, with no official spec. — [Cursor forum](https://forum.cursor.com/t/i-created-an-amazing-mode-called-riper-5-mode-fixes-claude-3-7-drastically/65516); [Substack (third-party)](https://0xmakereth.substack.com/p/claude-codes-agentic-toolkit)
- **Anthropic's official marketplace:** 4,383 commits, 1.1k issues. — [GitHub claude-plugins-official](https://github.com/anthropics/claude-plugins-official)

### Inferences
- **Clearly active in late 2026:** Spec Kit, OpenSpec, Superpowers, Compound Engineering, Ruflo, GSD Core, BMAD (V7 imminent), Task Master, Anthropic's marketplace and plugins, gstack (frequent releases per third parties).
- **Moved:** GSD. Anyone following old guides should switch to `npx @opengsd/gsd-core@latest`.
- **Slowing or repackaged:** SuperClaude (v5 no ETA), CCPM (small, now a skill).
- **Legacy as a standalone method:** RIPER-5, Agent OS v1/v2 (v3 replaces them) and the "Claude-Flow" name. Their ideas live on inside native plan mode and newer frameworks.
- **Clear trend:** slash-command bundles are migrating to Agent Skills and plugins, and frameworks are becoming multi-agent-tool. Frameworks that duplicated what Claude Code now does natively (planning, task lists, subagents) are slimming down.

### Gaps
- Without commit dates, "actively maintained" is inferred from version activity, banners and release trackers, not from commit timestamps.
- No official deprecation notice was found for SuperClaude or CCPM; "slowing" is an inference.

## Q3. Which are token-heavy (many agents, long prompts) vs token-light?

### Takeaway
Token cost comes from four things: parallel subagents, large always-loaded prompts and MCP tool definitions, many generated documents, and uncapped loops.
- **Heaviest:** Ruflo; GSD in full mode (one informal test used 1.2M tokens vs 200K for plain Claude Code on the same project); HumanLayer RPI as practiced; SuperClaude with its MCP stack; uncapped Ralph loops; feature-dev or multi-reviewer runs.
- **Lightest:** OpenSpec, Kiro-style specs, Agent OS v3, RIPER-5 and the Anthropic progress-file pattern.
- **In the middle:** Superpowers (250K in the same informal test), Spec Kit, BMAD, Task Master and Compound Engineering.

### Cited Findings
- **Informal head-to-head by Chase AI**, one landing-page-style project. The page itself could not be reached; the numbers come from the search summary.
  - Plain Claude Code: "20 minutes and 200K tokens". Superpowers: "60 minutes and 250K tokens". GSD: "105 minutes and 1.2 million tokens".
  - Outputs were "honestly indistinguishable".
  - GSD spawned four parallel research subagents (stack, features, architecture, pitfalls) at 33K-75K tokens each.
  - — [Chase AI blog (third-party, single anecdote)](https://www.chaseai.io/blog/gsd-vs-superpowers-vs-claude-code)
- **GSD Core:** "each executor starts with a clean 200k-token context" (by design, each task gets a full fresh window). — [GitHub open-gsd/gsd-core](https://github.com/open-gsd/gsd-core)
- **Task Master:** MCP tool definitions cost "~21,000 tokens" (all 36 tools), "~10,000" (15 tools) or "~5,000" (7 core tools). — [GitHub claude-task-master](https://github.com/eyaltoledano/claude-task-master)
- **Ruflo:** exposes "314 MCP tools", "100+ Agents", "27 Hooks" and "12 auto-triggered workers". — [GitHub ruflo](https://github.com/ruvnet/claude-flow)
- **SuperClaude:** relies on 8 MCP servers. It claims (unverified) a Token-Efficiency mode with "30-50% context savings". — [GitHub SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework)
- **HumanLayer:** "our team of three is averaging about $12k on opus per month". The method targets 40-60% context utilization. — [ace-fca.md (raw)](https://raw.githubusercontent.com/humanlayer/advanced-context-engineering-for-coding-agents/main/ace-fca.md)
- **Anthropic feature-dev:** launches 2-3 explorer agents, 2-3 architect agents and 3 reviewer agents in one run; "Don't use for" trivial changes. — [GitHub feature-dev](https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev)
- **Superpowers:** offers subagent-per-task OR inline execution "with one final review". A session may "burn more tokens than you'd expect". — [GitHub superpowers](https://github.com/obra/superpowers)
- **CCPM:** deterministic operations run as bash scripts with "no LLM token cost". — [GitHub ccpm](https://github.com/automazeio/ccpm)
- **Ralph plugin:** without a completion promise or `--max-iterations` it "runs infinitely". — [DreamHost blog (third-party)](https://www.dreamhost.com/blog/ralph-wiggum/); [VentureBeat](https://venturebeat.com/ai/how-ralph-wiggum-went-from-the-simpsons-to-the-biggest-name-in-ai-right-now)
- **OpenSpec:** a "lightweight spec layer"; recommends a clean context before implementation. — [GitHub OpenSpec](https://github.com/Fission-AI/OpenSpec)
- **Compound Engineering:** "80% is in planning and review, 20% is in execution". — [GitHub compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin)

### Inferences
- **Light** (good for a capped plan): OpenSpec, Kiro-style specs, Agent OS v3, RIPER-5, the Anthropic progress-file/feature-list pattern, and Ralph only with a strict `--max-iterations`.
- **Medium:** Superpowers (choose inline `executing-plans` to save tokens), Spec Kit, BMAD Quick Flow, Task Master in `core` mode, Compound Engineering, gstack.
- **Heavy:** GSD full mode, BMAD full/Enterprise tracks, feature-dev on every feature, CCPM with 5-8 parallel agents, SuperClaude with all MCPs, HumanLayer RPI with Opus everywhere, and Ruflo (heaviest).
- **The trade-off:** frameworks that give each task a fresh full context (GSD, Superpowers subagent mode) buy quality and robustness against "context rot" with more total tokens. The one informal test found no visible quality gain on a small project, which suggests heavy frameworks pay off only on larger, multi-session work.

### Gaps
- There is no independent, multi-project token benchmark. The only comparative token data is one informal test whose page could not be opened directly.
- A search summary mentioned a GSD "--minimal" install profile that cuts its system prompt from roughly 12,000 to 700 tokens. The original page was not identified, so this is unverified.

## Q4. What common principles do the successful ones share?

### Takeaway
The widely adopted frameworks converge on eight principles:
1. Write the intent down before coding (spec, plan or design), with a human approval gate.
2. Split the work into small tasks with explicit verification steps.
3. Give each task a fresh or lean context, using subagents for research.
4. Require evidence before calling something "done" (tests, end-to-end checks, reviewers).
5. Persist state in handoff files and git so the next session or agent can continue.
6. Size the process to the task (skip the ceremony for trivial changes).
7. Use deterministic scripts for non-thinking chores.
8. Capture lessons so the next task is easier.

### Cited Findings
- **Spec or plan first, with gates:**
  - Spec Kit: constitution -> specify -> plan -> tasks -> implement. — [GitHub spec-kit](https://github.com/github/spec-kit)
  - Kiro: decision points between requirements, design and tasks. — [Kiro docs](https://kiro.dev/docs/specs/concepts)
  - OpenSpec: so that "humans and AI agree on what to build before code is written". — [GitHub OpenSpec](https://github.com/Fission-AI/OpenSpec)
  - Superpowers: design before building, worktree after design approval. — [GitHub superpowers](https://github.com/obra/superpowers)
  - feature-dev: "explicit approval" before implementation. — [GitHub feature-dev](https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev)
  - HumanLayer: human review concentrated on research and plans. — [ace-fca.md](https://raw.githubusercontent.com/humanlayer/advanced-context-engineering-for-coding-agents/main/ace-fca.md)
  - RIPER-5: explicit mode switches. Research mode forbids suggestions and implementation. — [Cursor forum](https://forum.cursor.com/t/i-created-an-amazing-mode-called-riper-5-mode-fixes-claude-3-7-drastically/65516)
- **Small tasks, one at a time:**
  - Superpowers plans: "small tasks with file paths and verification steps". — [GitHub superpowers](https://github.com/obra/superpowers)
  - Anthropic harness: "one feature at a time". — [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
  - BMAD: the Dev agent implements one story at a time. — [codemyspec.com (third-party)](https://codemyspec.com/blog/bmad-method-explained)
- **Fresh or lean context:**
  - GSD Core: each executor gets a clean 200k context, and the main session stays lean. — [GitHub open-gsd/gsd-core](https://github.com/open-gsd/gsd-core)
  - Superpowers: a fresh subagent per task. — [GitHub superpowers](https://github.com/obra/superpowers)
  - HumanLayer: 40-60% utilization, and "Subagents are about context control". — [ace-fca.md](https://raw.githubusercontent.com/humanlayer/advanced-context-engineering-for-coding-agents/main/ace-fca.md)
  - OpenSpec: "benefits from a clean context window". — [GitHub OpenSpec](https://github.com/Fission-AI/OpenSpec)
- **Verification before "done":**
  - Superpowers: TDD plus verification-before-completion. — [GitHub superpowers](https://github.com/obra/superpowers)
  - Spec Kit: "Missing verification is not a successful fix". — [GitHub spec-kit](https://github.com/github/spec-kit)
  - Anthropic harness: features stay `passes: false` until tested; browser testing "dramatically improved performance"; "declaring victory" early is a named failure mode. — [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
  - feature-dev: reviewers report only high-confidence issues (threshold 80). — [GitHub feature-dev](https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev)
- **Handoff files and state:**
  - GSD Core: `STATE.md` and `CONTEXT.md` "survive session boundaries". — [GitHub open-gsd/gsd-core](https://github.com/open-gsd/gsd-core)
  - Anthropic: `claude-progress.txt`, a JSON feature list (chosen because the model is less likely to overwrite it than Markdown) and git commits. — [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
  - BMAD: story files contain everything the Dev agent needs. — [codemyspec.com (third-party)](https://codemyspec.com/blog/bmad-method-explained)
  - CCPM: GitHub Issues as the source of truth. — [GitHub ccpm](https://github.com/automazeio/ccpm)
  - HumanLayer: status compacted back into the plan file. — [ace-fca.md](https://raw.githubusercontent.com/humanlayer/advanced-context-engineering-for-coding-agents/main/ace-fca.md)
- **Right-sizing:**
  - BMAD: "Go directly to implementation for clear changes". — [GitHub BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD)
  - feature-dev: "Don't use for" trivial changes. — [GitHub feature-dev](https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev)
  - OpenSpec: "fluid not rigid". — [GitHub OpenSpec](https://github.com/Fission-AI/OpenSpec)
  - Thoughtworks: warns about lengthy, hard-to-review specs. — [Thoughtworks Radar](https://www.thoughtworks.com/radar/techniques/spec-driven-development)
- **Deterministic scripts:**
  - CCPM: 14 bash scripts with "no LLM token cost". — [GitHub ccpm](https://github.com/automazeio/ccpm)
  - Anthropic: `init.sh` to start the app. — [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- **Learning capture and standing rules:**
  - Compound Engineering: `/ce-compound` writes to `docs/solutions/`. — [GitHub compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin)
  - Agent OS: discover and inject standards. — [Agent OS v3 discussion #310](https://github.com/buildermethods/agent-os/discussions/310)
  - Spec Kit: a "constitution" of immutable principles. — [Thoughtworks Radar](https://www.thoughtworks.com/radar/techniques/spec-driven-development)

### Inferences
- For "avoid the AI inventing things", the most effective ingredients are:
  - a research step that must cite real files and lines (feature-dev's explorers return file:line references);
  - acceptance criteria written in a testable form (EARS / WHEN-THEN);
  - a rule that a task is not done without evidence (a test or end-to-end check);
  - a state file that the model can only update in narrow ways (Anthropic's JSON `passes` flag).
- These principles are cheap. A solo user can adopt them with CLAUDE.md rules, a few skills and files, without installing a heavy framework.

### Gaps
- No source measured which principle contributes the most. The ranking above is qualitative.

## Q5. Is there evidence (benchmarks, case studies) that these frameworks improve results?

### Takeaway
The evidence is weak. There are no independent controlled studies comparing these frameworks. What exists:
- one informal head-to-head that found similar output at much higher token cost for the heavier frameworks;
- self-reported case studies (HumanLayer's BAML work, honest about failures);
- marketing numbers without methodology (CCPM, SuperClaude, Ruflo);
- Anthropic's qualitative engineering report;
- expert critiques warning about spec verbosity and review burden.

### Cited Findings
- **Informal head-to-head:** Superpowers and GSD vs plain Claude Code on one project. Outputs "honestly indistinguishable", while GSD used ~6x the tokens (1.2M vs 200K) and ~5x the time. — [Chase AI (third-party; page unreachable, via search summary)](https://www.chaseai.io/blog/gsd-vs-superpowers-vs-claude-code)
- **HumanLayer case study (self-reported):**
  - A ~300k LOC Rust codebase (BAML).
  - A bug-fix PR made in about an hour and approved the next morning.
  - ~35k LOC in 7 hours for two features, against an estimated 3-5 senior-engineer days each. One PR was merged and the other "still open".
  - Explicit failures on parquet-java and a race condition.
  - — [ace-fca.md](https://raw.githubusercontent.com/humanlayer/advanced-context-engineering-for-coding-agents/main/ace-fca.md)
- **Anthropic (qualitative):** without the harness, the model falls short of a production-quality web app from a high-level prompt. With progress files, a feature list and browser testing it does better ("dramatically improved performance" from testing tools). No quantitative benchmark. Open question named: whether a single general agent beats multi-agent setups. — [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- **Self-reported marketing numbers without methodology:**
  - CCPM: "89%", "75%", "3×", and 100% vs 27.7%. — [GitHub ccpm](https://github.com/automazeio/ccpm)
  - SuperClaude: "30-50%", "2-3x". — [GitHub SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework)
  - Ruflo: "1.3×–1953×", "89% accuracy". — [GitHub ruflo](https://github.com/ruvnet/claude-flow)
- **Anecdotes:**
  - Superpowers: the agent can work "a couple hours at a time without deviating from the plan". — [GitHub superpowers](https://github.com/obra/superpowers)
  - Compound Engineering: a demo "Replayed from a real pair of sessions 18 days apart". — [GitHub compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin)
- **Expert critique:**
  - Böckeler (Thoughtworks, martinfowler.com, 15 Oct 2025) separates spec-first, spec-anchored and spec-as-source approaches. — [martinfowler.com](https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) (page unreachable; summary via search)
  - The Thoughtworks Radar warns that SDD tools can produce lengthy, hard-to-review specs. — [Thoughtworks Radar](https://www.thoughtworks.com/radar/techniques/spec-driven-development)
- **Practitioner comparisons in 2026 (opinion pieces, not studies):** e.g., "Superpowers, GSD, and gstack: What Each Claude Code Framework Actually Constrains", "Are Superpowers or GSD Better Than OpenSpec?" (April 2026), "Five Claude Code Frameworks Compared: When to Use Each, When to Use None". — [Medium (tentenco)](https://medium.com/@tentenco/superpowers-gsd-and-gstack-what-each-claude-code-framework-actually-constrains-12a1560960ad); [improveandrepeat.com](https://improveandrepeat.com/2026/04/are-superpowers-or-gsd-better-than-openspec/); [everydev.ai](https://www.everydev.ai/p/blog-five-claude-code-frameworks-compared-when-to-use-each-when-to-use-none) (titles only; contents not read)

### Inferences
- The defensible claim is narrow. Structure (spec, small tasks, verification, handoff state) reduces specific failure modes: premature "done", context rot over long sessions, and invented or unchecked work. There is no evidence that any particular heavy framework beats a lean, well-prompted setup on small projects.
- For a weekly-capped plan, this argues for borrowing principles over installing heavy frameworks.

### Gaps
- Two academic leads could not be read (arxiv.org unreachable):
  - "Grounding AI Agents in Contracts: An Empirical Evaluation of Spec-Driven Test Generation" (arXiv 2608.17177): compares a spec-driven agent with a prompt-to-code agent on the same harness and model.
  - "SpecBench: Measuring Reward Hacking in Long-Horizon Coding Agents" (arXiv 2605.21384): likely relevant to why independent verification matters.
  - Their results are unknown. — [arXiv 2608.17177](https://arxiv.org/pdf/2608.17177); [arXiv 2605.21384](https://arxiv.org/pdf/2605.21384)
- Böckeler's detailed observations could not be read directly.
- A search summary also said Superpowers' mandatory TDD "cut regression bugs noticeably" and that BMAD agents "can drift just as badly as unguided Claude if the session runs long". These could not be traced to a specific page, so they are unverified.

## Q6. Recommendation: which 2-3 ideas fit a solo user on the Claude Pro plan, and how to represent them in the guild RPG mod

### Takeaway
Do not install a heavy framework (Ruflo, GSD full mode, SuperClaude with all MCPs, BMAD Enterprise) on a weekly-capped Pro plan. Borrow three cheap, well-supported ideas:
- (1) **Quest = mini-spec with testable acceptance criteria** (OpenSpec / Kiro / Spec Kit).
- (2) **Research -> Plan -> Implement with fresh context and "handoff scrolls"** (HumanLayer RPI + Anthropic long-running harness + GSD state files). This maps directly to the leader / subagents / aging-apprentice mechanic.
- (3) **"Proof before turn-in" plus guild memory** (Superpowers verification/TDD + Compound Engineering's learning capture).

If the user wants something installable, Superpowers (official marketplace, with inline execution to save tokens) or OpenSpec (light, npm) are the safest fits. Use Anthropic's `feature-dev` only for big, multi-file "boss quests".

### Cited Findings
- **Size the process to the task:**
  - BMAD: "Go directly to implementation for clear changes or add deeper planning for larger initiatives"; Quick Flow skips architecture. — [GitHub BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD); [Mintlify BMAD reference](https://www.mintlify.com/bmad-code-org/BMAD-METHOD/reference/agents/overview)
  - feature-dev: "Don't use for" trivial changes. — [GitHub feature-dev](https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev)
- **Cheaper execution and tool loading:**
  - Superpowers offers inline `executing-plans` (one final review) instead of a subagent per task. — [GitHub superpowers](https://github.com/obra/superpowers)
  - Task Master `core` mode loads ~5,000 tokens of tools instead of ~21,000. — [GitHub claude-task-master](https://github.com/eyaltoledano/claude-task-master)
- **Context budget:** keep it at 40-60% and compact intentionally into files. — [ace-fca.md](https://raw.githubusercontent.com/humanlayer/advanced-context-engineering-for-coding-agents/main/ace-fca.md)
- **Handoff design:**
  - Anthropic: progress log + JSON feature list with `passes` + git; each session reads them first. — [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
  - GSD Core: `STATE.md` and `CONTEXT.md` persist across sessions. — [GitHub open-gsd/gsd-core](https://github.com/open-gsd/gsd-core)
- **Acceptance criteria formats:**
  - EARS ("WHEN ... THE [system] SHALL ...") in `requirements.md`. — [Kiro docs (via search)](https://kiro.dev/docs/specs/concepts)
  - OpenSpec deltas with WHEN/THEN scenarios, archived into living specs. — [GitHub OpenSpec](https://github.com/Fission-AI/OpenSpec)
- **Learning capture:** `/ce-compound` writes to `docs/solutions/` ("Run one teaches it. Run two remembers."). — [GitHub compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin)
- **Role-play precedent:**
  - gstack maps skills to company roles (CEO, designer, eng manager, QA, release manager); there is a Portuguese-language explainer. — [horadecodar.com.br (PT-BR)](https://horadecodar.com.br/papeis-gstack-claude-code/)
  - BMAD uses named personas (Mary, John, Winston, Bob, Amelia). — [codemyspec.com (third-party)](https://codemyspec.com/blog/bmad-method-explained)
- **Bounded loops:** Ralph needs a completion promise and/or `--max-iterations`. — [DreamHost blog (third-party)](https://www.dreamhost.com/blog/ralph-wiggum/)
- **Install routes:**
  - Plugin-marketplace installs exist for Superpowers, Compound Engineering, BMAD V7 and Ruflo. — [GitHub superpowers](https://github.com/obra/superpowers); [GitHub compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin); [GitHub BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD); [GitHub ruflo](https://github.com/ruvnet/claude-flow)
  - Others need Python/uv (Spec Kit), pipx (SuperClaude) or bash scripts plus `gh` (CCPM). — [GitHub spec-kit](https://github.com/github/spec-kit); [GitHub SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework); [GitHub ccpm](https://github.com/automazeio/ccpm)

### Inferences

**Idea 1: "Mural de Missões" (Quest Board) = mini-specs** (OpenSpec / Kiro / Spec Kit)
- Each quest card is a small spec file: objective, scope, acceptance criteria in WHEN/THEN form, files involved (filled in by the research step), how it will be verified, and status. A JSON `passes`-style flag records verification (Anthropic pattern).
- The guild leader writes or refines the quest. The user (guild master) approves it before work starts. This is the approval gate shared by Kiro, feature-dev and Spec Kit.
- **Quest ranks implement right-sizing** (BMAD Quick Flow vs full, and feature-dev's "don't use for trivial"):
  - Rank E-D (trivial): no spec; just do it and check.
  - Rank C-B: mini-spec + plan.
  - Rank A-S "boss quests": full research party, architecture options and multi-reviewer review, e.g. `feature-dev`.
- Completed quests are archived into the "living specs" library (OpenSpec's archive step).
- **Anti-invention effect:** the agent works against explicit criteria. Anything outside them is a new quest, not an improvisation.

**Idea 2: Research -> Plan -> Implement with fresh context and "Pergaminhos de Passagem" (handoff scrolls)** (HumanLayer + Anthropic harness + GSD)
- **The leader** is the main session. It stays lean and delegates (GSD: "keeping your main session lean").
- **Fixed subagents become guild staff:**
  - "Batedor/Explorador" (Scout, read-only research): must return file:line evidence, like feature-dev's code-explorer. Like RIPER-5's Research mode, it may not propose solutions.
  - "Estrategista" (Planner): a plan of small tasks, each with a verification step (Superpowers writing-plans).
  - "Construtor/Artesão" (Builder): implements one task per session.
  - "Inspetor" (Reviewer): see Idea 3.
- **The aging mechanic maps to context use.** An agent "ages" as its context fills up.
  - When it nears ~50-60% (HumanLayer's 40-60% target), the elder writes a handoff scroll and commits: a progress log plus `STATE.md`-style "where we are, what's next, open questions".
  - An apprentice, i.e. a fresh session or subagent with a clean context, starts by reading the scroll and the git log, exactly as in Anthropic's per-session routine.
  - BMAD's story file is the same idea: the card carries all the context the apprentice needs, so nothing depends on the elder's "memory".
- **Freelancers (one-off NPCs)** are ad-hoc subagents or marketplace skills hired for a single quest (e.g., a security reviewer, a frontend-design specialist). They leave a short report and disappear, which keeps the fixed roster small and cheap.

**Idea 3: "Prova antes da entrega" (proof before turn-in) + guild memory** (Superpowers + Compound Engineering + Anthropic harness)
- A quest can be turned in only with evidence: test output, build success, or a screenshot or end-to-end check. Superpowers' verification-before-completion, Spec Kit's "Missing verification is not a successful fix", and Anthropic's untested-means-not-done all say the same.
- The "Inspetor da Guilda" (freelancer or fixed reviewer) reports only high-confidence problems (feature-dev threshold 80), which avoids noisy, invented review findings.
- **Guild memory:** after each quest, a short "lição aprendida" (lesson learned) entry goes into a `docs/solutions/`-style archive (Compound's `/ce-compound`). Standing rules go into a "Carta da Guilda" (charter) = constitution/standards (Spec Kit constitution, Agent OS standards).

**Mapping to the guild buildings** (suggestions):
- **Construction company (Construtora):** the implementation crew. Builders work in isolated "canteiros" (git worktrees, as in Superpowers/CCPM) from a "planta" (blueprint = plan/tasks file). Building inspection = verification before turn-in.
- **Art gallery (Galeria de arte):** the design and showcase hall. Alternative designs are "exhibited" side by side for the guild master to choose (feature-dev's 2-3 architect proposals; Superpowers brainstorming). UI/UX and "designer review" roles live here (gstack, BMAD UX). Finished, verified work is exhibited for acceptance.
- **Recording studio (Estúdio de gravação):** the chronicle. It "records" sessions as handoff scrolls, decision logs and lessons learned (progress file, STATE.md, docs/solutions). The "takes" metaphor fits brainstorming several alternatives before choosing one.

**Pro-plan economics as a game mechanic:** show each quest's expected "mana/energia" cost based on party size (number of subagents) and rank.
- Default to small parties: one scout + inline build + one inspection.
- Reserve parallel parties (feature-dev's ~8 agents, GSD-style 4 parallel researchers) for boss quests.
- Give grind tasks (a Ralph-style "mercenário") a hard iteration cap and an objective completion check.

**Avoid on Pro:** Ruflo swarms, SuperClaude with all 8 MCPs, GSD full mode (1.2M-token anecdote), BMAD Enterprise track, and CCPM with 5-8 parallel agents. On Windows, also avoid bash-loop Ralph and CCPM's bash scripts unless Git Bash/WSL is set up. Prefer plugin-marketplace installs or simple Markdown conventions.

### Gaps
- Not verified here: whether the Claude desktop app on Windows (as opposed to the Claude Code CLI) supports every plugin and marketplace install route listed. The Claude Code configuration notes may cover this.
- No measurement exists of how many Pro-plan messages or tokens a typical Superpowers, OpenSpec or feature-dev run consumes. The cost tiers above are inferred from agent counts and the single informal benchmark.
