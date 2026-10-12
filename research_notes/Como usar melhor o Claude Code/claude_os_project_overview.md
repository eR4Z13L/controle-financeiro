# Claude OS–style personal operating systems & managing many projects/agents with Claude / Claude Code (status: 2026-10-12)

Notes compiled on 2026-10-12. GitHub stars and "last push" dates come from the GitHub repository-search API, queried on 2026-10-12; they're cited with each repo's URL. "Official" means Anthropic: support.claude.com, code.claude.com/docs and anthropic.com. Everything else is community or vendor material and is marked that way. The Claude Code docs use version numbers such as v2.1.2xx, and the features below need those recent builds.

---

## 1. Claude's own "Projects", memory, chat search and connectors — and how they relate to Claude Code sessions and folders

### Takeaway
Claude now uses the word "project" for three different things, and they don't share memory:
- **(a) claude.ai/desktop chat Projects.** Each has its own knowledge base, instructions and separate memory space. They're available on every plan, and Free accounts can have at most 5.
- **(b) The new Claude Code "Projects" (public beta on Pro/Max, press-dated 17 Sep 2026).** One coordinator conversation starts parallel cloud "threads" and shows an **Overview** pane whose groups are Ready for review / Waiting on you / Working / Landing / Idle / Resolved.
- **(c) A local Claude Code "project", which is a folder.** Its transcripts and auto memory live under `~/.claude/projects/<encoded-path>/`.

This user is on Pro and runs local sessions on Windows, so (c) is the natural unit for a "guild". (b) is the only official overview that spans several projects, but it runs in the cloud, needs repos on github.com, and Anthropic warns it uses up a Pro quota faster.

### Cited Findings
**Chat Projects (claude.ai web / desktop app chat)**
- Anthropic defines them as "self-contained workspaces with their own chat histories and knowledge bases". They're available on every plan, including Free, but "Free users can create a maximum of five projects". The article gives no cap for Pro. — [What are projects?](https://support.claude.com/en/articles/9517075-what-are-projects)
- Each project has a knowledge base (documents, text, code) and its own instructions, such as tone or role. — [What are projects?](https://support.claude.com/en/articles/9517075-what-are-projects)
- "Enhanced project knowledge with RAG is only available to users with paid Claude plans (Pro, Max, Team, or Enterprise)." When the knowledge nears the context limit, RAG mode can expand capacity "by up to 10x". — [What are projects?](https://support.claude.com/en/articles/9517075-what-are-projects)
- Sharing (Can view / Can edit) is limited to Team and Enterprise. — [What are projects?](https://support.claude.com/en/articles/9517075-what-are-projects)
- The same article says a new version of Projects is in beta, "rolling out in stages starting with Claude Code". In it, "a project is one conversation" that splits work into parallel cloud threads. Existing chat and Cowork projects keep working, and Pro/Max projects will be upgraded once the rollout reaches chat and Cowork. "Projects draw from your plan's usage like any other use of Claude." The article showed "Updated over 2 weeks ago", with no exact date. — [What are projects?](https://support.claude.com/en/articles/9517075-what-are-projects)

**Memory and chat search (claude.ai / desktop / mobile)**
- Chat search is available on paid plans (Pro, Max, Team, Enterprise) on web, desktop and mobile. It uses RAG over past chats, and its searches appear as tool calls. It "searches all chats outside projects, and each project's conversations separately. It doesn't search across projects." You can turn it off under Settings > Memory > "Search and reference chats". — [Chat search & memory](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)
- Memory is on by default for Free, Pro and Max. "Claude saves memory as a set of individual topics as you chat". "Each project has its own separate memory space and dedicated project summary." You can view and edit it under Settings > Memory > Topics, and you can pause or reset it. To turn memory off for a single chat, use the "+" menu before the first message. Incognito chats are excluded. — [Chat search & memory](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)
- Memory is shared between Chat and Cowork only when Cowork runs in the cloud, not with locally run Cowork sessions. Memory can be imported from other assistants and exported (marked experimental). Legacy-memory export closed on 9 Sep 2026. — [Chat search & memory](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)

**Connectors**
- Custom connectors use remote MCP. You add one with "+" → "Add custom connector", enter the server URL (with optional OAuth client ID and secret), then click Connect. Claude reaches the server "from Anthropic's cloud infrastructure", so the server must be reachable on the public internet. Anthropic hasn't verified these connectors. Versions of the article disagree on plans: the newest lists Free through Enterprise, with Free limited to one custom connector; an older one lists Pro and up and says "beta". — [Custom connectors (support article, several versions found via search)](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
- In the Claude Code desktop app, "Connectors are MCP servers with a graphical setup flow" for services such as Google Calendar, Slack, GitHub, Linear and Notion. You add them with the "+" button in local and SSH sessions; the button isn't available in cloud or WSL sessions. — [Desktop docs](https://code.claude.com/docs/en/desktop)

**The new Claude Code Projects (beta)**
- "Projects are in public beta on Pro and Max plans and rolling out gradually, starting with accounts that have used cloud sessions and don't have existing projects in claude.ai chat or Cowork. They aren't available on Team or Enterprise plans yet." They appear in the sidebar at claude.ai/code and in the desktop app's Code tab; accounts without access can join a waitlist. — [Claude Code: Projects](https://code.claude.com/docs/en/claude-projects)
- Press coverage dates the beta to 17 September 2026. I didn't retrieve Anthropic's own announcement. — [The Register](https://www.theregister.com/a/5297532); [pasqualepillitteri.it](https://pasqualepillitteri.it/en/news/17035/claude-code-projects-thread-paralleli-cloud-en) (secondary)
- How it's organised: "A project is one ongoing conversation where Claude coordinates a stream of related work". Each thread is usually a cloud session that works on its own branch and opens a pull request. The conversation "sees what threads report back, not every step they take." — [Claude Code: Projects](https://code.claude.com/docs/en/claude-projects)
- The **Overview** pane's Threads tab groups threads as **Ready for review, Waiting on you, Working, Landing, Idle and Resolved**. Threads are auto-resolved after a week without activity. The other tabs are Library (files), Pull requests and Routines. In the desktop app you get a desktop notification "when Claude posts in the conversation, a thread hits an error, or a thread needs your input"; in a browser, a dot appears on the Overview button instead. — [Claude Code: Projects](https://code.claude.com/docs/en/claude-projects)
- Standing context has three parts:
  - **Project memory**: a `MEMORY.md` index plus files. It's separate from the local auto memory and from repo `CLAUDE.md` files.
  - **Project instructions**: up to **16,000 characters**.
  - **Repositories and files**: files are mounted under `/mnt/project-files`.
  — [Claude Code: Projects](https://code.claude.com/docs/en/claude-projects)
- A thread can run on your own computer through Remote Control. This needs Claude Code v2.1.280+ on that machine. In the desktop app, turn on Settings > Claude Code > "Use this computer from your phone and claude.ai" and add the folder; from a terminal, run `claude remote-control`, optionally with `--spawn worktree`. A local thread gets the project instructions but not the memory files, and runs only while the computer is awake. — [Claude Code: Projects](https://code.claude.com/docs/en/claude-projects). One launch-era guide said local execution wasn't available at launch, so it was probably added afterwards. — [aireiter guide (secondary)](https://aireiter.com/blog/claude-code-projects-beta-guide)
- Code projects need repos on github.com (not GitHub Enterprise Server, GitLab or Bitbucket) and the Claude GitHub App. A local session can't use "Continue as project". — [Claude Code: Projects](https://code.claude.com/docs/en/claude-projects)
- Models: a new project "runs Opus everywhere", with high effort for threads and low effort for the coordinator. — [Claude Code: Projects](https://code.claude.com/docs/en/claude-projects)
- Cost and limits:
  - A project draws on the same plan limits; "on a Pro plan in particular you should expect to reach your limit sooner on days you run one".
  - The enforced limit is "200 new threads per day across your projects".
  - An idle or archived project uses nothing.
  - Threads that watch a pull request wake up when CI fails or a review comment arrives.
  - Project settings > Usage shows tokens by thread and by model.
  — [Claude Code: Projects](https://code.claude.com/docs/en/claude-projects)
- Anthropic's comparison page lists five ways to run work in parallel: subagents, agent view (research preview), agent teams (experimental, off by default), Projects (public beta on Pro/Max) and dynamic workflows. — [Run agents in parallel](https://code.claude.com/docs/en/agents)

**What "project" means locally in Claude Code**
- "A session is a saved conversation tied to a project directory." Transcripts are stored at `~/.claude/projects/<project>/<session-id>.jsonl`, where `<project>` is the working-directory path "with non-alphanumeric characters replaced by `-`". — [Sessions](https://code.claude.com/docs/en/sessions)
- "The desktop app, claude.ai/code, and the VS Code extension each keep their own session list". — [Sessions](https://code.claude.com/docs/en/sessions)
- Desktop Code tab:
  - Each session has its own chat history and project folder.
  - The sidebar can filter sessions "by status, project, or environment" and "group sessions by project".
  - Ctrl+click (Windows) a session in the sidebar to view two at once.
  - The app sends "an OS notification when a Code session finishes a task and you aren't currently viewing that session".
  - Claude can list, read, message, rename or archive your other desktop sessions, and always asks before archiving.
  — [Desktop docs](https://code.claude.com/docs/en/desktop)

### Inferences
- In the Portuguese report, keep the three meanings apart: "Projeto (chat)", "Projeto (Claude Code beta)" and "pasta/projeto local". Chat-project memory, Claude Code auto memory and the beta's project memory are three separate stores.
- Best practices for chat Projects, as inferences from the facts above:
  - Create one chat Project per guild, named like the folder.
  - Put a short guild charter in the project instructions.
  - Upload a fresh STATE/HANDOFF snapshot from time to time.
  - Keep one "HQ / Quartel-General" project for decisions that span guilds, because chat search never crosses projects.
- Because the rollout starts with accounts that have no existing chat or Cowork projects, a user with existing chat projects may get the beta later.
- The Overview groups (Working / Waiting on you / Ready for review / Idle / Resolved) give ready-made, official state names for guild cards in the game.

### Gaps
- I found no official cap for Pro on the number of chat projects or on project-knowledge size. The only figures are Free = 5 projects and "up to 10x" with RAG.
- I didn't retrieve Anthropic's primary announcement of the Projects beta; the 17 Sep 2026 date comes from press.
- The versions of the connectors article disagree on plan eligibility and beta status; check the live page.
- It's unclear when chat Projects and Claude Code Projects will merge for an individual account.

---

## 2. How Claude Code users organise many projects (CLAUDE.md, ~/.claude, shared skills/agents, state files, task databases)

### Takeaway
The official layering works well across many projects:
- **user-level** `~/.claude/CLAUDE.md` and `~/.claude/rules/` apply to every project;
- each project has `CLAUDE.md`, `.claude/rules/` (rules can be limited to file paths) and `.claude/agents/`;
- auto memory is automatic and per repo (`~/.claude/projects/<project>/memory/MEMORY.md`).

The community adds a single status file per project, such as `CURRENT_STATE.md`, `HANDOFF.md/.yaml` or `WORKLOG.md`, and sometimes a markdown or kanban task store. Anthropic has no official STATE.md convention.

### Cited Findings
**Official instruction and memory layers**
- CLAUDE.md scopes:
  - managed policy (on Windows `C:\Program Files\ClaudeCode\CLAUDE.md`);
  - user `~/.claude/CLAUDE.md` ("Personal preferences for all projects");
  - project `./CLAUDE.md` or `./.claude/CLAUDE.md`;
  - local `./CLAUDE.local.md` (add it to .gitignore).
  — [Memory docs](https://code.claude.com/docs/en/memory)
- Files in the working directory and its ancestors are concatenated "from the filesystem root down to your working directory". Subdirectory files load on demand. — [Memory docs](https://code.claude.com/docs/en/memory)
- Keep each CLAUDE.md under 200 lines, because "Longer files consume more context and reduce adherence". If two instructions conflict, Claude may pick one arbitrarily. `/doctor prompt-audit` audits CLAUDE.md files, rules, skills, subagents and output styles in `.claude/` and `~/.claude/`. — [Memory docs](https://code.claude.com/docs/en/memory)
- `@path` imports can be relative or absolute and nest at most four hops. Imports from outside the project need a one-time approval per project; imports in user-scope files load without the dialog, except in Cowork. — [Memory docs](https://code.claude.com/docs/en/memory)
- `.claude/rules/*.md` files can carry a `paths` field so they load only for matching files. "Personal rules in `~/.claude/rules/` apply to every project on your machine." Rules can be shared across projects with symlinks: an external target needs approval, and links to network/UNC paths aren't followed. — [Memory docs](https://code.claude.com/docs/en/memory)
- `AGENTS.md` is read when no CLAUDE.md exists (v2.1.277+). `--add-dir` with `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD=1` also loads the CLAUDE.md and rules from extra directories. — [Memory docs](https://code.claude.com/docs/en/memory)
- Auto memory:
  - lives in `~/.claude/projects/<project>/memory/`, with a `MEMORY.md` index whose "first 200 lines ... or the first 25KB" load every session, plus topic files read on demand;
  - is one directory per git repo, shared by its worktrees;
  - is machine-local and excluded from transcript cleanup;
  - can be toggled in `/memory` (`autoMemoryEnabled`) and relocated with `autoMemoryDirectory`.
  — [Memory docs](https://code.claude.com/docs/en/memory)
- Subagent definition locations, in priority order: managed > `--agents` flag > `.claude/agents/` (project) > `~/.claude/agents/` ("All your projects") > a plugin's `agents/`. An agent's identity comes only from its `name` field. — [Subagents](https://code.claude.com/docs/en/sub-agents)
- Subagent persistent memory (`memory:` field):
  - `user` → `~/.claude/agent-memory/<name>/`
  - `project` → `.claude/agent-memory/<name>/`
  - `local` → `.claude/agent-memory-local/<name>/`
  The first 200 lines or 25KB of `MEMORY.md` go into the agent's prompt. — [Subagents](https://code.claude.com/docs/en/sub-agents)
- Plugins bundle skills, agents, hooks, MCP servers and LSP configs, and install at user, project or local scope from the desktop plugin manager. They aren't available in WSL sessions, and plugins installed in the desktop app don't reach cloud sessions. — [Desktop docs](https://code.claude.com/docs/en/desktop)
- Agent view (`claude agents`) can group sessions by state or by directory (Ctrl+S). `--cwd` limits it to one project; by default it shows all background sessions "across projects". — [Agent view](https://code.claude.com/docs/en/agent-view)
- The session picker's Ctrl+A shows sessions from every project on the machine. Name sessions with `-n` or `/rename`; unnamed sessions get a default display name such as `my-app-3f`. — [Sessions](https://code.claude.com/docs/en/sessions)

**Task databases**
- Agent teams have an official shared task list with "pending, in progress, and completed" states, dependencies and file-locked claiming, stored in `~/.claude/tasks/{team-name}/`. — [Agent teams](https://code.claude.com/docs/en/agent-teams)
- The desktop app offers GitHub, Linear and Notion connectors (MCP). — [Desktop docs](https://code.claude.com/docs/en/desktop). Cloud threads in the Projects beta get the connectors from your claude.ai account. — [Claude Code: Projects](https://code.claude.com/docs/en/claude-projects)
- Backlog.md, "A tool for managing project collaboration between humans and AI Agents in a git ecosystem", keeps tasks as markdown in the repo. 7.0k stars, last push 2026-10-12, MIT. — [MrLesk/Backlog.md](https://github.com/MrLesk/Backlog.md)
- Task Master, an "AI-powered task-management system", has 28.2k stars, but its last push was 2026-04-28 and its license is listed as "Other". — [eyaltoledano/claude-task-master](https://github.com/eyaltoledano/claude-task-master)
- Vibe Kanban, a kanban board plus agent workspaces, says "**Vibe Kanban is sunsetting.**" — [BloopAI/vibe-kanban](https://github.com/BloopAI/vibe-kanban)

**Community state and handoff conventions**
- brkakyldz/second-brain-os keeps a per-project `docs/CURRENT_STATE.md`, described as "the only file that states status", plus an append-only `docs/WORKLOG.md`. The vault holds one thin card per project (`notes/<project_id>.md`), and `project-doctor.mjs` checks each project's memory and state freshness. — [brkakyldz/second-brain-os](https://github.com/brkakyldz/second-brain-os)
- konark20/second-brain-for-claude has `/handoff`, which writes or updates `HANDOFF.yaml` for a project, `/resume` ("where you left off and the next move") and `/ticket-status` ("ticket counts and drift across projects"). — [konark20/second-brain-for-claude](https://github.com/konark20/second-brain-for-claude)
- mattbeswick/second-brain-starter puts "a `CLAUDE.md` in every folder, saying what the folder is for", has `/handoff` and `/memory-update`, and follows two rules: "One memory index that loads every session, kept short" and "Every fact lives in one place". — [mattbeswick/second-brain-starter](https://github.com/mattbeswick/second-brain-starter)
- A community handoff skill writes a structured `HANDOFF.md` at the project root before you end a long session, run /compact or switch tasks. Its template covers goal, progress, what worked, what didn't, and next steps. — [skills.sh ykdojo/handoff](https://skills.sh/ykdojo/claude-code-tips/handoff)
- An agency blog (vendor) recommends one CLAUDE.md per client project that states the current phase and active sprint, updated each sprint. — [lowcode.agency](https://www.lowcode.agency/blog/claude-code-freelance-developer-workflow)
- My search found no established "STATE.md" convention; HANDOFF.md and CURRENT_STATE.md are what the community uses. — search on 2026-10-12, no source found

### Inferences
- A suggested layout for the guild model:
  - **Global (whole realm):** `~/.claude/CLAUDE.md` for the player profile, pt-BR language and conventions; `~/.claude/rules/` for rules every guild follows; `~/.claude/agents/` for **freelancers**, the NPC agents any guild can hire.
  - **Per guild:** `CLAUDE.md` as the charter (under 200 lines); `.claude/agents/` for the fixed members; and one status file. This guild's equivalent of `CURRENT_STATE.md` should be the only thing the guild page reads, plus `WORKLOG.md` and `HANDOFF.md`.
- Displaying the state from one markdown or JSON file per guild costs no tokens. Using GitHub Issues or Linear through MCP costs tokens whenever Claude has to read them.
- Anthropic says not to edit runtime files by hand (team config, jobs state), so the game's own registry should live in its own file or in `$.store` (see sections 6 and 7).

### Gaps
- Anthropic publishes no guidance on STATE/HANDOFF conventions; this is community practice only.
- I didn't check whether GitHub Projects (v2) boards are fully reachable through the GitHub MCP connector.

---

## 3. "Claude OS" / second-brain systems for Claude Code — their best overview features

### Takeaway
Most of these repos are new (created March–September 2026) and small: five of the seven have 0–8 stars. The ones that matter are **coleam00 (804★)** and **Persistia, ex "claude-code-os" (161★)**. The overview features worth borrowing are:
- an **INDEX/catalog file** read first (Karpathy's `index.md`, second-brain-os `INDEX.md`, Persistia `_brain/index.md`);
- **one status file per project** (`CURRENT_STATE.md`, `HANDOFF.yaml`);
- **health and "doctor" commands** (`/cold-start`, `project-doctor`, `/brain`, `/arch`, Karpathy's "lint");
- **scheduled weekly reviews** (konark20 `/weekly`, Persistia's Monday 9am review);
- an auto-refreshing **HTML dashboard** (Persistia `dashboard.html`).

### Cited Findings
**konark20/second-brain-for-claude.** 0★, 3 commits, MIT. Created 2026-09-30, last push 2026-10-01.
- What it is: "A folder of Markdown files that turns Claude into a colleague who knows you." It works with Claude Code, the desktop app, claude.ai and Obsidian.
- Structure: PARA folders (`00-Inbox` … `05-Journal`) plus a `99-Meta` operating layer (`START_HERE.md`, `FOUNDATION.md`, `USER_PROFILE.md`, `BOUNDARIES.md`, `SKILL_MAP.md`, `agents/`, `skills/`, `templates/`).
- Overview commands: `/weekly` (wins, blockers, patterns, stale items), `/cold-start` (one-line health check), `/janitor` (hygiene audit), `/ticket-status` (ticket drift across projects), `/handoff` and `/resume`. `VAULT_MAP.md` and `SKILL_MAP.md` act as maps.
- Self-improvement: "Repeated work gets logged; three repeats and skill-creator drafts a skill for you to approve."
- Setup: "Use this template" → clone → `claude` → `/onboard`. On claude.ai, upload `CLAUDE.md` and `99-Meta/` to a Project.
- Tokens: not stated. The README's counts are inconsistent (17 agents; 60 or 61 skills; 18 or 20 commands).
— [konark20/second-brain-for-claude](https://github.com/konark20/second-brain-for-claude)

**brkakyldz/second-brain-os.** 0★, 41 commits, MIT. Created 2026-08-18, last push 2026-09-25.
- What it is: an Obsidian vault and a git repo at once, for Claude Code and Codex: "A memory for your coding agents that you can read, correct and undo."
- Structure: `core/` (always loaded), `notes/`, `raw/` (read-only sources), `logs/` (append-only plus a signals ledger), `archive/`, and `INDEX.md`, a page catalog read first.
- Per project: a card in the vault plus `CURRENT_STATE.md` and `WORKLOG.md` in the project's repo.
- Health: `brain-doctor.mjs`, `project-doctor.mjs` and `link-sweep.mjs` (broken links, orphans), and `/audit`, which reports without fixing.
- Setup: tell the agent to read SETUP.md, or run `node install.mjs`. It needs git 2.28+ and Node 18.13+.
- Platforms: "Windows, macOS and Linux".
- Tokens: no figures; `core/` loads every session and the rest on demand.
— [brkakyldz/second-brain-os](https://github.com/brkakyldz/second-brain-os)

**mattbeswick/second-brain-starter.** 0★, 1 commit, MIT. Created and pushed 2026-09-29.
- Setup is agent-led: say "set me up" and it takes about 15 minutes. The README recommends "the strongest model you have for setup".
- Hooks: danger-scan, memory-guard and session-check ("a quick health check at the start of each session").
- Skills: `/memory-update`, `/handoff`, `/debate-plan`, `/debate-branch`.
— [mattbeswick/second-brain-starter](https://github.com/mattbeswick/second-brain-starter)

**tonydzi/second-brain-starter-kit.** 8★, 79 commits, MIT. Created 2026-07-17, last push 2026-10-11.
- What it is: "Claude Code as a second brain + working assistant", "the method, not the data".
- Skills: 100, indexed in `skills/INDEX.md`. Overview and health ones include `/arch` ("the deterministic map of everything your system is made of, and what fell off it"), `/brain` ("one-glance health of a memory/RAG stack"), `/sync-check` (green/red), `/retro`, `/last30days`, `/handoff`, and `/search` ("full-text search across every conversation you ever had, locally, 0 tokens").
- Also: weekly and monthly review templates, `ONBOARDING-WINDOWS.md`, and plugin-marketplace installation.
— [tonydzi/second-brain-starter-kit](https://github.com/tonydzi/second-brain-starter-kit)

**coleam00/second-brain-starter.** 804★, 4 commits. Created 2026-03-29, last push 2026-06-09. No license shown.
- What it is: a skill that generates a PRD for building your own "second brain".
- Memory templates: `SOUL.md`, `USER.md`, `MEMORY.md`, `HEARTBEAT.md`, `HABITS.md`, `daily/`.
- Features: a 30-minute **heartbeat** that checks email, calendar and tasks; hybrid search ("70% vector + 30% keyword"); and SessionStart, PreCompact and SessionEnd hooks.
- Cost: the heartbeat runs at "~$0.05/run vs $0.38 with MCP tool calls".
— [coleam00/second-brain-starter](https://github.com/coleam00/second-brain-starter)

**justnau1020/claude-os.** 3★, 10 commits, Apache-2.0. Created 2026-03-30, last push 2026-04-09.
- What it is: "An operating system for Claude Code": hooks (MCR, which injects vault notes), skills and a framework.
- Principle: "your main chat agent is a team lead, not a worker". `rules/file-ownership.md` maps directories to teams.
- Overview-like commands: `/deploy-status`, `/audit`, `/hygiene-audit`.
- Tokens: a 500k context over 20 turns is about 5.5M input tokens, versus about 2M with a lean 100k context. Heavy skills (5–12 agents) use 100–300k tokens per run, so the README recommends Max.
— [justnau1020/claude-os](https://github.com/justnau1020/claude-os)

**bernardohcrocha/claude-code-os, now "Persistia" (persistia-for-claude-code).** 161★, 79 commits, MIT. Created 2026-05-30, last push 2026-06-13.
- What it is: per-project memory in `_brain/`: `index.md` ("the navigation map the agent reads first"), a **`dashboard.html` that auto-refreshes every 5 minutes**, `core/`, `operations/`, `skills/`, `tasks/queue.json`, and a separate `.git`.
- Schedule: a weekly review every Monday at 9am and a proactive scan every 3 days ("Always suggests, never acts unilaterally").
- Updates use git diff: "1,000 files, 3 changed, it reads 3."
- Setup: `curl ... setup.sh | bash`. The scheduler uses launchd or systemd, and **Windows isn't mentioned**. There's one brain per project.
— [bernardohcrocha/claude-code-os → Persistia](https://github.com/bernardohcrocha/claude-code-os); metadata from [persistia-for-claude-code](https://github.com/bernardohcrocha/persistia-for-claude-code)

**Karpathy's "LLM Wiki" pattern (gist, created 4 Apr 2026)**
- Three layers: immutable raw sources, an LLM-maintained wiki, and a schema file such as CLAUDE.md or AGENTS.md.
- Three operations: ingest, query and **lint** (contradictions, stale claims, orphan pages, missing cross-references).
- "index.md is content-oriented" (a catalog with a link and summary for every page, read first); "log.md is chronological" (append-only, with prefixes like `## [2026-04-02] ingest | Title`).
- "Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase", and "Obsidian's graph view is the best way to see the shape of your wiki."
- It works at "~100 sources, ~hundreds of pages" without embeddings; beyond that it suggests a local search tool (qmd).
— [karpathy/LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

### Inferences
- The features worth copying for a guild overview:
  1. A `GUILDS.md` or `INDEX.md` registry, one line per guild, read first.
  2. One status file per guild with a fixed schema (phase, current quest, blockers, next step, needs-user flag, last update).
  3. A "doctor" pass that marks a guild **stale** when its status file is older than N days, like project-doctor or Karpathy's lint.
  4. A weekly "Conselho" review that rolls all status files into one report.
  5. An append-only `log.md` per guild, for a chronicle or timeline view.
- None of these repos visualises live agents. They're memory and process systems, so live state has to come from hooks or mod events (sections 4 and 6).
- Maturity is low: most have 0–8 stars and a handful of commits. Borrow the patterns rather than installing whole kits. Persistia's scheduler doesn't work on Windows.

### Gaps
- Per-repo token costs mostly aren't published; only justnau1020's and coleam00's rough figures are available.
- I couldn't confirm whether the konark20, mattbeswick and justnau1020 repos run on native Windows; their READMEs are silent.
- WebFetch didn't show exact last-commit dates; the dates above are from the GitHub API's `pushed_at`.

---

## 4. Tools that visualise agents and sessions (official vs community) — what they show and which work on Windows

### Takeaway
**Official:**
- **Agent view** (`claude agents`, research preview) is one screen of background sessions with a state per row (Working / Needs input / Idle / Completed / Failed / Stopped).
- **Agent teams** (experimental) has an agent panel, a shared task list and mailboxes.
- The **desktop app** sidebar groups and filters sessions by project and status, and has tasks and subagent panes.
- **Projects** (beta) has its Overview pane.
- **Cross-session messaging** (`/list-agents`) shows which sessions can reach each other.

**Community:**
- The best "who is doing what, and who spawned whom" view is **disler's hooks observability dashboard**, an event timeline with swim lanes and SubagentStart/Stop.
- The closest analogue to the user's RPG is **Pixel Agents**: a pixel-art office with one character per session, sub-agents and teammates as their own characters, and speech bubbles for waiting or permission (Windows/macOS/Linux).
- For costs, use **ccusage**, **opcode** (usage analytics) or Claude-Code-Usage-Monitor.
- Windows caveats: Claude Squad needs tmux (WSL), Conductor is macOS-only, Crystal is deprecated in favour of Nimbalyst, and Vibe Kanban is sunsetting.

### Cited Findings
**Official (Anthropic)**
- **Agent view** (`claude agents`, research preview since v2.1.139):
  - "one screen for all your background sessions: what's running, what needs your input, and what's done".
  - Row states: Working (animated), Needs input (yellow), Idle (dim), Completed (green), Failed (red), Stopped (grey).
  - Groups: Ready for review, Needs input, Working, Completed, and Pinned at the top.
  - Each row shows a name, a one-line summary (updated at most every 15 seconds from the session's own output, and rewritten by the model when a turn ends), its age and a PR badge. Space opens a peek panel with the blocking question and "waiting 3m".
  - Ctrl+S groups by state or by directory. `claude agents --json` prints `state` as working, blocked, done, failed or stopped.
  - Notifications fire the `Notification` hook with `agent_needs_input` or `agent_completed`.
  - Cost: "running ten agents in parallel uses quota roughly ten times as fast as running one"; row summaries use a Haiku-class model.
  - Storage: `~/.claude/jobs/<id>/state.json` "is not a stable interface", so scripts should use `--json`.
  — [Agent view](https://code.claude.com/docs/en/agent-view)
- **Agent view on Windows:** the changelog lists Windows-specific fixes: decoding win32-input-mode (v2.1.248), replacing a stale `daemon.lock` on Windows (v2.1.257), and background work surviving restarts "including on Windows" (v2.1.196). — [Agent view](https://code.claude.com/docs/en/agent-view)
- **Agent teams** (experimental):
  - Enable with `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`.
  - "The lead's terminal lists teammates in the agent panel below the prompt input". Enter opens a teammate's transcript, and Ctrl+T toggles the task list. More than three idle teammates collapse into "N idle agents".
  - Display modes: in-process (any terminal), or split panes with tmux or iTerm2. Split panes are "not supported in VS Code's integrated terminal, Windows Terminal, or Ghostty".
  - Cost: "Token costs scale linearly"; "Start with 3-5 teammates"; "5-6 tasks per teammate".
  - Limits: one team per session, no nested teams, the lead is fixed, and `/resume` doesn't restore in-process teammates.
  — [Agent teams](https://code.claude.com/docs/en/agent-teams)
- **In-session views:** `/tasks` lists background items, including finished subagents. `/workflows` shows each dynamic workflow's phase and how many agents finished. Named background subagents appear in the @-mention typeahead with their status. — [Run agents in parallel](https://code.claude.com/docs/en/agents)
- **Desktop app:**
  - Sidebar filters by status, project and environment, and groups by project.
  - Panes: chat, diff, browser, terminal, file, plan, **tasks** and **subagent** (needs Desktop v1.2581.0+). Panes can be popped out into their own windows.
  - "Subagents, background shell commands, and dynamic workflows appear in the tasks pane".
  — [Desktop docs](https://code.claude.com/docs/en/desktop)
- **Cross-session messaging:**
  - `/list-agents` (alias `/peers`) lists subagents, teammates, other local sessions (including background ones), and cloud or Remote Control sessions.
  - Claude uses the `ListAgents` and `SendMessage` tools; you can @-mention a session.
  - `notify_when_idle` sends one notice when another session goes idle; it expires after 12 hours.
  - Received messages show as `› Message from @api-worker: …`.
  - Versions: v2.1.224+ on macOS/Linux and **v2.1.234+ on native Windows**, where it uses a named pipe and requires an auth line.
  - A WSL 2 session and a native Windows session can't reach each other.
  — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging)

**Community and vendor tools** (stars and last push from the GitHub API, 2026-10-12)
- **disler/claude-code-hooks-multi-agent-observability.** 1.5k★, last push 2026-02-08, no license in API metadata.
  - Pipeline: "Claude Agents → Hook Scripts → HTTP POST → Bun Server → SQLite → WebSocket → Vue Client".
  - Captures 12 hook events, including SubagentStart and SubagentStop (agent ID and type), PreToolUse/PostToolUse and Notification.
  - Shows filtering by app, session and event type, per-session colours, "agent swim lane", a transcript viewer, a live pulse chart, and summaries on Stop (needs `ANTHROPIC_API_KEY`). No costs.
  - Setup: copy `.claude/` into the project, set `source-app`, run `just start`, and open localhost:5173 (server on 4000). Windows isn't mentioned.
  — [disler repo](https://github.com/disler/claude-code-hooks-multi-agent-observability)
- **Pixel Agents** (pablodelucca). ~9.7k★, 1.6k forks, 220 commits, MIT.
  - "One agent, one character — every Claude Code terminal gets its own animated character". Sub-agents and agent-team members appear as separate characters.
  - Speech bubbles show waiting for input or permission; animations follow the activity (typing, reading).
  - State detection: a **hooks mode** (default: SessionStart, PreToolUse, PermissionRequest, Stop) and a **heuristic mode** that scans the JSONL transcripts under `~/.claude/projects/`.
  - Runs as a VS Code extension (VS Code 1.105+) or as `npx pixel-agents` (Node 20+). Requirements: "Windows, Linux, or macOS".
  - Roadmap stages: "Actually a game" and "orchestrator characters".
  — [pablodelucca/pixel-agents](https://github.com/pablodelucca/pixel-agents). Secondary listings add a layout editor (up to 64×64) and say the office tileset is a paid third-party asset (Donarg, $2). — [mdskills listing](https://www.mdskills.ai/skills/pixel-agents)
- **Claude Squad** (smtg-ai). 8.6k★, last push 2026-08-20, AGPL-3.0.
  - A TUI that runs several agents (Claude, Codex, Gemini, Aider…) in tmux sessions and git worktrees, with preview and diff tabs.
  - Prerequisites: tmux and gh. The README doesn't mention Windows.
  — [smtg-ai/claude-squad](https://github.com/smtg-ai/claude-squad)
- **Conductor** (conductor.build).
  - Runs parallel Claude Code or Codex agents, each in its own git-worktree workspace with diff, checks and PR.
  - Third-party guides call it macOS-only (Apple Silicon) and free (you bring your own Claude or OpenAI access). Its site advertises "Conductor Cloud".
  — [morphllm guide (vendor of another product)](https://www.morphllm.com/conductor-ai-coding); [codepick guide](https://codepick.dev/en/guides/conductor-build-intro/); [conductor.build workflow page](https://www.conductor.build/workflows/run-parallel-claude-codes)
- **Vibe Kanban** (BloopAI). 28.3k★, last push 2026-09-19, Apache-2.0.
  - Kanban issues plus workspaces, each with "a branch, a terminal, and a dev server", diff review, and `npx vibe-kanban`.
  - **"Vibe Kanban is sunsetting."**
  — [BloopAI/vibe-kanban](https://github.com/BloopAI/vibe-kanban)
- **Crystal → Nimbalyst.**
  - Crystal: 3.1k★, last push 2026-02-26. It was "deprecated and replaced by" Nimbalyst in February 2026. — [stravu/crystal](https://github.com/stravu/crystal)
  - Nimbalyst: 1.9k★, last push 2026-10-11, MIT. "The open-source visual workspace for Claude Code, Codex, and OpenCode. Run multiple coding agents in parallel... and track tasks"; a desktop app for macOS, Windows and Linux with iOS/Android companions; topics include kanban and worktree-manager. — [nimbalyst/nimbalyst](https://github.com/nimbalyst/nimbalyst) (vendor)
- **opcode** (winfunc). 22.4k★, last push 2026-09-18, AGPL-3.0.
  - A Tauri GUI with a projects browser ("all your Claude Code projects in `~/.claude/projects/`"), session history and resume, custom "CC Agents", **usage analytics by model, project and time period**, MCP management and checkpoints.
  - Platforms: "Windows 10/11, macOS 11+, or Linux".
  - No prebuilt releases ("Release Executables Will Be Published Soon"), so you build from source with Rust and Bun.
  — [winfunc/opcode](https://github.com/winfunc/opcode)
- **CloudCLI, also called Claude Code UI** (siteboon). 14.0k★, last push 2026-10-12, AGPL-3.0-or-later.
  - A web and mobile UI that auto-discovers sessions from `~/.claude`, with a file explorer, git and a shell.
  - Run with `npx @cloudcli-ai/cloudcli` (Node 22+), then open localhost:3001.
  - A hosted cloud plan "Starts at €7/month". Running the server on native Windows isn't confirmed.
  — [siteboon/claudecodeui](https://github.com/siteboon/claudecodeui)
- **ccusage.** 19.0k★, MIT; the repo now appears under the `ccusage` org.
  - Daily, weekly, monthly and session reports, plus **5-hour "blocks"** reports for Claude's billing windows.
  - Per-project breakdown with `--instances` and `--project`, and a statusline command (beta).
  - Run with `npx ccusage@latest`; it reads local data, so it costs no model tokens. Windows isn't mentioned.
  — [ryoppippi/ccusage → ccusage/ccusage](https://github.com/ryoppippi/ccusage)
- **Claude-Code-Usage-Monitor.** 8.7k★, last push 2026-07-05, MIT. A "Real-time Claude Code usage monitor with predictions and warnings". — [Maciek-roboblog/Claude-Code-Usage-Monitor](https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor)
- **claude-code-templates.** 32.6k★, last push 2026-10-12, MIT.
  - `--analytics` gives "live state detection and performance metrics"; `--chats` is a mobile monitor (with `--tunnel` for remote access); there's also `--health-check`. Run with `npx claude-code-templates@latest …`.
  — [davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)
- **ccmanager.** 1.3k★, last push 2026-10-12, MIT. A "Coding Agent Session Manager" for Claude Code, Gemini CLI, Codex CLI and others. — [kbwo/ccmanager](https://github.com/kbwo/ccmanager)

### Inferences
| Need | Best official | Best community |
|---|---|---|
| Who works on what (state per session) | Agent view states; desktop sidebar; Projects Overview | Pixel Agents (characters); disler (timeline) |
| Which agent spawned which | SubagentStart/Stop hooks, `agent.spawn` mod event, team config `members` (section 6) | disler (SubagentStart/Stop with agent IDs); Pixel Agents (separate characters) |
| Messages between agents | Team mailboxes; cross-session messaging previews; mod `session.send`/`session.receive` | none found that visualises inter-agent messages |
| Costs | Projects Usage tab; `$.session.usage()` in mods; a custom status line ("shows context usage, costs, and git status", per the [statusline docs index](https://code.claude.com/docs/llms.txt)) | ccusage, opcode analytics, Usage-Monitor |
- On **Windows with the desktop app**, these work natively: the desktop sidebar, mods in the Code tab, cross-session messaging (v2.1.234+), Pixel Agents, opcode (built from source) and probably the Node-based CLIs (ccusage, claude-code-templates). These don't: Claude Squad (tmux, so WSL only), Conductor (macOS) and agent-team split panes (not supported in Windows Terminal).
- Agent view is a terminal feature, and the desktop app keeps its own session list. I couldn't confirm that desktop Code-tab sessions appear in `claude agents`.

### Gaps
- No tool I found shows a full cross-project org chart or inter-agent message graph; this looks like an open niche.
- disler's dashboard and ccusage don't state Windows support, and I didn't test them.
- I couldn't load Conductor's own site (DNS failure), so its platform details come from third-party guides.
- opcode's former name "Claudia" isn't stated on its current page; its clone URL points to getAsterisk/opcode.

---

## 5. Knowledge-graph overviews — Graphify, Obsidian Graph View, and combining them across projects

### Takeaway
**Graphify** (Graphify-Labs, ~125.8k★, very active) turns a folder into `graph.html`, `GRAPH_REPORT.md` and `graph.json`. Code parsing is local and free (tree-sitter); docs and media cost model tokens. Projects can be combined with `graphify merge-graphs`; cross-repo graphs are otherwise a paid Cloud feature. **Obsidian Graph View** colour-groups nodes by query (`path:`, `tag:`) and has a local graph with depth. Karpathy's LLM-wiki pattern uses Obsidian's graph to see "the shape" of the knowledge. Combined: one graph per guild, merged into a "galaxy".

### Cited Findings
- **Graphify repo:** Graphify-Labs/graphify. ~125.8k★, 12.1k forks, created 2026-04-03, last push 2026-10-12, default branch `v8`, Apache-2.0 per GitHub metadata (the README mentions Apache-2.0 and MIT). Its description: "Turn any codebase, with its docs, SQL schemas, configs, and PDFs, into a queryable knowledge graph. A /graphify skill for Claude Code, Cursor, Codex, and Gemini CLI: local deterministic AST parsing, every edge explained, no vector store." — [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify)
- **Graphify outputs:** `graph.html` (interactive), `GRAPH_REPORT.md` ("key concepts, surprising connections, suggested questions"), `graph.json`, and an optional markdown wiki with `--wiki`. — [Graphify repo](https://github.com/Graphify-Labs/graphify)
- **Graphify setup:**
  - Install with `uv tool install graphifyy`; the PyPI package is `graphifyy` and the command is `graphify`.
  - Register with `graphify install` (or `--project` for one repo), then run `/graphify .`.
  - Flags: `--update` (changed files only), `--cluster-only`, `--no-viz`, `--wiki`, `--code-only`. There's also a `graphify watch` command, and an MCP server comes with the `graphifyy[mcp]` extra.
  - On Windows, `graphify install` detects the platform automatically, or you can pass `--platform windows`.
  — [Graphify repo](https://github.com/Graphify-Labs/graphify)
- **Graphify cost:** "Code is parsed with tree-sitter AST: deterministic, no LLM, nothing leaves your machine." Docs and media go through your assistant's model. `--update` and an AST cache limit how much gets reprocessed. The "80% fewer tokens" claim is about Graphify Cloud. — [Graphify repo](https://github.com/Graphify-Labs/graphify)
- **Graphify across projects:** `graphify merge-graphs a.json b.json`; cross-repo and monorepo graphs are a Graphify Cloud feature. — [Graphify repo](https://github.com/Graphify-Labs/graphify)
- **Graphify, secondary claims:** third-party write-ups say `graphify install` also adds a CLAUDE.md section and **PreToolUse hooks that steer Claude toward the graph before grep**; that the MCP server has eight tools; and that edges are tagged EXTRACTED, INFERRED or AMBIGUOUS. — [Augment Code write-up (vendor)](https://www.augmentcode.com/learn/graphify-knowledge-graph-codebase-skill); [graphify.com Claude Code page (vendor)](https://graphify.com/integrations/claude-code)
- **Obsidian Graph View:**
  - Groups colour-code notes: create a group, enter a search query (`path:`, `tag:`, `file:`), pick a colour.
  - Filters: a search term, plus toggles for tags, attachments, orphans and existing files only.
  - The local graph ("Open local graph") shows notes linked to the active one, with a depth slider.
  — [Obsidian help: Graph view](https://obsidian.md/help/plugins/graph) (summary from search; the help domain didn't resolve for a direct fetch). Users report that colour groups are saved per workspace and ask for switchable presets. — [Obsidian forum](https://forum.obsidian.md/t/multiple-graph-view-filters-and-color-grouping-for-each/39076)
- **Karpathy LLM Wiki:** "Obsidian's graph view is the best way to see the shape of your wiki", showing hubs and orphans. The `index.md` catalog plus `log.md` chronicle are the overview files. — [Karpathy gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- **tonydzi's kit:** "Every decision, agreement and idea → a note in the vault, linked into the graph." — [tonydzi/second-brain-starter-kit](https://github.com/tonydzi/second-brain-starter-kit)

### Inferences
- For the "Mega Brain" galaxy:
  - Run `/graphify . --update --code-only` in each guild folder; code-only is free.
  - Merge the per-guild `graph.json` files with `graphify merge-graphs` into one galaxy file.
  - Draw each guild as a star system. Graphify's communities become planets, and edges that cross guilds (shared libraries, shared concepts) become hyperlanes.
- If the user also keeps an Obsidian vault with one note per guild and per agent, Obsidian groups like `path:guilds/<name>` give each guild a colour. That's a cheap, zero-code way to see links between projects alongside the in-game view.
- Avoid regenerating doc-heavy graphs often: the semantic pass for docs and media costs model tokens on a Pro plan.

### Gaps
- I couldn't confirm the names and count of Graphify's MCP tools or the PreToolUse hook behaviour from the README; they come from vendor or third-party pages.
- I didn't verify Graphify's latest release version or date; secondary sources disagree (0.8.17 in May 2026 vs 0.9.x in July 2026).
- No official Anthropic integration with Obsidian exists; this is a community pattern.

---

## 6. Modelling and displaying an org chart of agents (who reports to whom, who is linked) from Claude Code data

### Takeaway
Combine **static definitions** with **live events**:
- **Static:** fixed members come from `.claude/agents/*.md` in each project; freelancers come from `~/.claude/agents/*.md`, which every project can use.
- **Live:** SubagentStart/SubagentStop hooks; the mod events `agent.spawn`, `session.send` and `session.receive`; `$.agent.list()`; and `claude agents --json`.

Agent-team runtime files (`~/.claude/teams/{team}/config.json`, inboxes, `~/.claude/tasks/{team}/`) and JSONL transcripts are readable, but Anthropic says they're internal or overwritten and "not a stable interface". Treat them as fallbacks.

### Cited Findings
- **Subagent definitions:** project `.claude/agents/`, user `~/.claude/agents/` ("All your projects") and plugin `agents/`, in a documented priority order. Frontmatter fields include `name`, `description`, `tools`, `model`, **`color`** (red, blue, green, yellow, purple, orange, pink, cyan), `memory` (user/project/local), `background`, `isolation: worktree`, `effort`, `maxTurns`, `skills`, `mcpServers` and `hooks`. — [Subagents](https://code.claude.com/docs/en/sub-agents)
- **Subagent transcripts:** `~/.claude/projects/{project}/{sessionId}/subagents/agent-{agentId}.jsonl`, deleted after `cleanupPeriodDays` (30 days by default). Named subagents can be resumed and addressed with `SendMessage` (`to` = name or ID; the roster includes `main`). — [Subagents](https://code.claude.com/docs/en/sub-agents)
- **Main transcripts:** `~/.claude/projects/<project>/<session-id>.jsonl`. "The entry format is internal to Claude Code and changes between versions, so scripts that parse these files directly can break on any release." — [Sessions](https://code.claude.com/docs/en/sessions)
- **Team config:**
  - Lives at `~/.claude/teams/{team-name}/config.json`. The team name is `session-` plus the first eight characters of the session ID.
  - It "contains a `members` array with each member's name and agent ID"; the lead's entry has agent type `team-lead`.
  - It's runtime state: "don't edit it by hand… your changes are overwritten", and the directory is removed when the session ends.
  - Mailboxes: `~/.claude/teams/{team-name}/inboxes/{agent-name}.json`.
  - Task list: `~/.claude/tasks/{team-name}/`. It persists and isn't uploaded.
  - "There is no project-level equivalent of the team config."
  — [Agent teams](https://code.claude.com/docs/en/agent-teams)
- **Hook inputs for the org chart:**
  - `SubagentStart`: `agent_id`, `agent_type`. It can add `additionalContext` but can't block.
  - `SubagentStop`: `agent_id`, `agent_type`, `agent_transcript_path`, `last_assistant_message`, `background_tasks`, `session_crons`.
  - `TeammateIdle`: `teammate_name`, `agent_id` (v2.1.290+).
  - `TaskCreated` and `TaskCompleted`: `task_id`, `task_subject`, `task_description`, `teammate_name`, `agent_id`.
  - Every event also carries `session_id`, `transcript_path` and `cwd`.
  — [Hooks reference](https://code.claude.com/docs/en/hooks)
- **Hook inputs for notifications ("letters"):**
  - `Notification` carries `message`, `title` and `notification_type`. Types include `permission_prompt`, `idle_prompt`, `agent_needs_input`, `agent_completed`, `elicitation_dialog` and the quota auto-resume types.
  - "`permission_prompt` fires only after about six seconds without typing, so use PermissionRequest if you need an immediate signal."
  — [Hooks reference](https://code.claude.com/docs/en/hooks)
- **Hook types:** command, http (POST JSON to a URL), mcp_tool, prompt and agent. `async: true` runs a hook in the background. Hooks can be set in `~/.claude/settings.json` (all projects), `.claude/settings.json`, a plugin's `hooks/hooks.json`, and skill or subagent frontmatter. — [Hooks reference](https://code.claude.com/docs/en/hooks)
- **Mod events and API:**
  - `agent.spawn` fires "when a subagent or an agent team teammate is about to start" (`e.isTeammate`).
  - `$.agent.list()` "returns this session's subagents and teammates, each with a `status` of `pending`, `running`, `waiting`, `idle`, `completed`, `failed`, or `killed`".
  - `session.receive` and `session.send` expose `e.text`, `e.to` and `e.origin.kind` (`peer`, `peer-send-message`, `task-notification`, `scheduled-trigger`).
  - In `tool.check`, `e.agentId` tells a subagent's call from the main session's.
  - Settings-hook events can also be handled inside a mod as `classic.<Event>`, for example `classic.Notification`.
  — [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference)
- **Background sessions:** `claude agents --json [--all]` is the "machine-readable session list". `~/.claude/jobs/<id>/state.json` "is not a stable interface", and `~/.claude/daemon/roster.json` holds the running sessions. — [Agent view](https://code.claude.com/docs/en/agent-view)
- **Cross-session reach:** `/list-agents` shows subagents, teammates, local sessions and cloud/Remote Control sessions. Hooks and Bash can post into their own session through `CLAUDE_CODE_MESSAGING_SOCKET`; on native Windows, the first line must be an auth line with `CLAUDE_CODE_MESSAGING_TOKEN`. — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging)
- **Community precedent:** disler's dashboard builds its event and agent view entirely from hook events posted over HTTP. — [disler repo](https://github.com/disler/claude-code-hooks-multi-agent-observability). Pixel Agents prefers hooks and falls back to scanning JSONL. — [pixel-agents](https://github.com/pablodelucca/pixel-agents)

### Inferences
- **Graph model for the game:**
  - Node types: **Guild** (project folder, keyed by absolute `cwd`), **Leader** (main session, `session_id`), **Member** (subagent definition in the project's `.claude/agents`), **Freelancer** (definition in `~/.claude/agents`), **Instance** (`agent_id` from SubagentStart or `agent.spawn`) and **Teammate** (agent-team member).
  - Edges: `member_of` (definition → guild); `reports_to` (instance → leader session; teammate → lead); `hired_by` (freelancer instance → guild, when a SubagentStart's `agent_type` matches a user-level definition); `messaged` (`session.send` / `session.receive`, and team mailboxes); `assigned` (TaskCreated/TaskCompleted with `teammate_name`).
- **Reliability ranking:** (1) mod events and the mod API inside each session; (2) settings hooks, which are documented schemas; (3) `claude agents --json`; (4) runtime files (team config, inboxes, tasks), which are readable but may change or vanish; (5) JSONL transcripts, explicitly unstable.
- Folder names under `~/.claude/projects/` replace non-alphanumeric characters with `-`, so you can't reliably decode them back to paths. Keep an explicit guild registry keyed by `cwd`.
- Freelancer colour and model come from frontmatter (`color`, `model`), so they can be shown without any model call.

### Gaps
- None of the documented fields gives the parent of nested agents beyond "this session". Parentage is implied by the `session_id` and the subagents folder; I didn't verify how deep nesting is reported.
- `$.agent.list()` only covers the current session. There's no documented mod API that lists other sessions; options are running `claude agents --json` through `$.process.run`, or having each session publish a heartbeat to the shared `$.store` (an inference, see section 7).
- I didn't verify whether desktop Code-tab sessions appear in `claude agents --json`.

---

## 7. Concrete ideas for showing the overview inside the user's RPG mod (guild page, org chart, long tasks, letters, adding guilds)

### Takeaway
Everything needed exists in the official mods API, which works in the desktop app's Code tab on Windows (v2.1.286+, but not in WSL sessions):
- **panes** and a **band above the prompt**;
- a **Desktop-only `Svg` element** for an org chart;
- a **`Client` element** for animation and pointer input;
- a **`$.store` shared by every session on the machine**, which can act as a guild registry and heartbeat bus;
- **`$.clock.every`** timers;
- **`$.agent.list()`** for agent status;
- **`session.send`/`session.receive`** to see letters between guilds;
- **`$.ui.toast`/`$.audio`** for notifications.

Drawing costs no tokens. Only `$.model.*` calls and delivered cross-session messages spend plan usage.

### Cited Findings
- **Where mods run:** "Mods work in the Claude Code CLI and in the Code tab of the Claude Desktop app". The desktop app supports them from v2.1.286 and the terminal from v2.1.287. In a WSL session in the desktop app, hooks don't run and nothing is drawn. — [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview)
- **What mods can do:** draw "a pane beside the transcript or a band above the prompt, with tabs, buttons, and text fields"; redraw Claude Code's own UI (except the permission prompt); add `/commands` that run instantly; register tools for Claude; and "send a message to another of your sessions". — [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview)
- **Elements by surface:** `Svg` ("An SVG document, up to 131,072 characters") is **Desktop only**. `Client` ("A region drawn by a second file of yours, for animation and pointer input"; it posts data to the mod as `ui.message`) works in both. `Raster` and `Image` are terminal-only. — [Mods interface](https://code.claude.com/docs/en/plugins/mods/interface); [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference)
- **Shared state:**
  - "Every session on your machine that runs your mod shares one `$.store`." It's saved under `~/.claude/plugins/store/` and holds 4 MiB of JSON at most.
  - "A `get` followed by a `set` isn't atomic". Anthropic advises giving "each item its own key".
  - `$.state` is reactive and session-scoped; it resets on `/clear`, `/resume` and `/branch`. Reload it in `classic.SessionStart`.
  — [Mods interface](https://code.claude.com/docs/en/plugins/mods/interface); [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference)
- **Background work and attention:**
  - `$.clock.every(ms, fn)` runs a timer that keeps going between turns.
  - `$.ui.status` puts a persistent line under the prompt; `$.ui.toast` shows a toast (4 s by default); `$.ui.log` adds a transcript line that Claude doesn't read; `$.prompt.submit` can start a turn.
  - `$.audio.play` and `$.audio.speak` exist.
  — [Mods API](https://code.claude.com/docs/en/plugins/mods/api); [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference)
- **Session data:** `$.session.usage()` returns `{ startedAt, context, rateLimits, cost }` (context has tokens, window and percent; rate limits have percentUsed and resetsAt). `$.session.id`, `cwd` and `repo` are also available. — [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference)
- **Messaging:** `$.session.send({ to: { sessionId } | { agentId }, text })` makes "the same delivery the SendMessage tool makes", and `session.receive` and `session.send` events let a mod observe traffic. A delivered message "counts toward usage like a prompt you type". — [Mods API](https://code.claude.com/docs/en/plugins/mods/api); [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging)
- **Limits:** a hook may run for 10 s of its own time; `$.process.run` times out after 30 s by default; `$.fs.read` handles 4 MiB per file; redraws are throttled to 10 per second (30 in the terminal for the visible pane). A pane a mod opens on its own appears only at 144+ terminal columns. — [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference); [Mods interface](https://code.claude.com/docs/en/plugins/mods/interface)
- **Cost of model calls from mods:** `$.model.complete` and `$.model.fork` "bill to the user's plan". A fork reuses the conversation's prompt cache. — [Mods API](https://code.claude.com/docs/en/plugins/mods/api)
- **Built-in OS notifications:** the desktop app already notifies when a Code session finishes and you aren't viewing it. The Projects beta notifies when a thread needs input or errors. — [Desktop docs](https://code.claude.com/docs/en/desktop); [Claude Code: Projects](https://code.claude.com/docs/en/claude-projects)
- **"Raven" notices:** cross-session `notify_when_idle` gives one notice when a watched local session goes idle. "Claude Code subscribes without starting a turn or spending tokens in the watched session". — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging)
- **Precedent for an RPG view:** Pixel Agents' speech bubbles for "waiting for input or awaiting permission" and its roadmap stage "Actually a game" — [pixel-agents](https://github.com/pablodelucca/pixel-agents)
- **Precedent for guild states:** the Projects Overview groups (Ready for review / Waiting on you / Working / Landing / Idle / Resolved) — [Claude Code: Projects](https://code.claude.com/docs/en/claude-projects)

### Inferences
These are design ideas built on the facts above; none of them come from a source.
1. **Guild Hall page (`/guildas`):**
   - Every guild session's mod writes a heartbeat to `$.store`, one key per guild (`guild:<cwd-hash>`), every 15–30 s via `$.clock.every`, plus on `turn.start` and `turn.complete`. Each guild writing only its own key avoids races.
   - Heartbeat fields: guild name, `cwd`, leader state (working / needs-input / idle / failed, reusing agent view's vocabulary), current quest (first line of the status file or the last turn summary), party (`$.agent.list()` with statuses), `context.percent`, `rateLimits.percentUsed`, `lastActivity`, and an unread-letters count.
   - The Guild Hall pane, in any session, reads `$.store.keys()` and draws one card per guild.
   - A guild whose heartbeat is older than about 2 minutes shows as "dormant"; one whose status file is older than N days shows as "abandoned", like a lint or doctor check.
2. **Command tree (org chart):**
   - In the desktop app, draw an `Svg` tree: Leader → fixed members (`.claude/agents`, using their frontmatter `color`) → live instances (`agent_id` from `agent.spawn` or SubagentStart). Freelancers (`~/.claude/agents`) sit in a "tavern" column, with a dotted line to every guild currently using them.
   - Fall back to `Box`/`Text` trees in the terminal.
   - Add agent-team teammates under the lead when `e.isTeammate` is true.
3. **Who is talking to whom:**
   - Log `session.send` and `session.receive` events (sender, recipient, first line, timestamp) to `$.store` as `msg:<ts>` keys.
   - Draw animated "letter" lines between guild nodes, and fade lines older than about 10 minutes.
   - Inside a guild, mark teammate messages from the mailbox files only as an optional fallback, since they're runtime state.
4. **Long tasks ("expeditions"):**
   - Mark an agent "on expedition" when it has been `running` for more than X minutes, measured from the `agent.spawn` time.
   - Add a session-level badge when `turn.start` has had no matching `turn.complete` for more than X minutes.
   - Show the subagent's `last_assistant_message` from SubagentStop as its "expedition report".
5. **Letters (the leader needs the user):**
   - Triggers: a `classic.Notification` with `permission_prompt`, `idle_prompt` or `agent_needs_input`; a `tool.check` decision of `ask`; or a `PermissionRequest` settings hook for an immediate signal.
   - Each trigger writes a `letter:<guild>:<ts>` record and raises `$.ui.toast` plus `$.audio.play`; the desktop OS notification is already built in. The Guild Hall shows a sealed-letter icon until the user opens that session.
   - For "tell me when guild X finishes", ask Claude to use `notify_when_idle`, which spends no tokens in the watched session.
6. **Founding a new guild easily (`/fundar-guilda <nome> <pasta>`):**
   - A mod command that creates the folder, a `CLAUDE.md` charter template, `.claude/agents/` with the standard members, a `docs/CURRENT_STATE.md`, `WORKLOG.md` and `HANDOFF.md` skeleton, and a registry entry in `$.store` (or a `GUILDS.md` index).
   - `$.process.run(['git','init'])` is optional.
   - Optionally run Graphify in the new folder to add a star to the galaxy.
7. **Weekly "Conselho":** a `/conselho` command that collects every guild's status file into one markdown report. It can be pure file I/O, with no tokens, or optionally one `$.model.complete` with Haiku to summarise.
8. **Token hygiene for Pro:**
   - Keep all rendering deterministic.
   - Never call `$.model.*` on a timer.
   - Avoid agent teams unless they're needed, since cost scales linearly with teammates.
   - Keep guild charters under 200 lines.
   - Use `graphify --update --code-only`.
9. **Windows specifics:**
   - Use native Windows sessions rather than WSL, because WSL desktop sessions run no mods and can't message native sessions.
   - Cross-session messaging needs v2.1.234+.
   - A script posting to a session's socket must send the auth line with `CLAUDE_CODE_MESSAGING_TOKEN`.

### Gaps
- I didn't test `$.store` behaviour when many sessions write often (performance, file locking), or whether its 4 MiB limit suits a heartbeat bus. The docs only say get-then-set isn't atomic.
- It isn't documented whether a `Client` element can render rich HTML or canvas in the desktop app beyond "animation and pointer input". Check the [mods types file](https://github.com/anthropics/claude-code/blob/main/mods/types/claude-code.d.ts) or `$.ui.resolve(e)` for the current build.
- I didn't verify whether a mod can list other sessions directly; this needs a hands-on test.
