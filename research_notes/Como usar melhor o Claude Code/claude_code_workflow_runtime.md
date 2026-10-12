# Claude Code workflow & runtime features — catalog as of 12 Oct 2026 (for a Windows + Claude Pro + Desktop-app user building a "guild RPG" mod)

Method/scope: official docs at code.claude.com (llms.txt index + ~97 pages downloaded 2026-10-12), the changelog up to **v2.1.296 (October 9, 2026)**, the "What's new" weekly digests **Week 13 (Mar 23–27, 2026) → Week 37 (Sep 7–11, 2026)** (no digest exists for Week 31, and none after Week 37 at retrieval time — Sep 12 → Oct 9 is covered only by the changelog), support.claude.com and anthropic.com. Doc pages carry no "last updated" date; versions/dates come from version requirements stated in pages, the changelog and the digests. Every page has a Brazilian-Portuguese mirror: replace `/docs/en/` with `/docs/pt/` (e.g. https://code.claude.com/docs/pt/agent-teams). All findings are official Anthropic sources unless marked otherwise; "Game idea" bullets in each Inferences block are my proposals, keyed to the feature name, for the report writer to carry into the Portuguese report.

---

## Q1. Models, aliases and reasoning controls (/model, fable, opusplan, effort, ultrathink, ultracode, thinking, /fast, /advisor, output styles): what exists in Oct 2026 and what does each cost on Pro?

### Takeaway
Since v2.1.280 (Sep 22, 2026) the `default` model on **Pro is Opus 5.5 at `medium` effort** (before that Pro defaulted to Sonnet 5); `opus`/`sonnet`/`haiku` resolve to Opus 5.5 / Sonnet 5.5 / Haiku 5.5 (all 1M context), `fable` → Fable 5.1 (may bill usage credits), `opusplan` still exists, only the keyword `ultrathink` is recognized ("think hard" is plain text), and fast mode is billed **only from usage credits** on Pro. Model switches cost a full uncached re-read of the conversation; effort changes on the 5.5 models do not.

### Cited Findings

#### /model and model aliases
- **What:** aliases are `default` (clears override), `best` (Fable where available, else Opus), `fable`, `sonnet`, `opus`, `haiku`, `sonnet[1m]`, `opus[1m]`, `opusplan`; on the Anthropic API (what a Pro login uses) `opus`→Opus 5.5, `sonnet`→Sonnet 5.5, `haiku`→Haiku 5.5, `fable`→Fable 5.1 — [Model configuration](https://code.claude.com/docs/en/model-config)
- **Default on Pro:** `default` resolves to Opus 5.5 on Pro, Max, Team, Enterprise and the API; "Before v2.1.280, `default` resolved to Sonnet 5 on Pro and Team Standard" — [Model configuration](https://code.claude.com/docs/en/model-config#default-model-setting). Sonnet 5 had become the Pro default in Week 27 (Jun 29–Jul 3, 2026) — [What's new](https://code.claude.com/docs/en/whats-new/index)
- **How:** priority order: `/model <alias|name>` (no argument = picker; press `s` on a row = this session only; ←/→ adjusts effort) → `claude --model` → `ANTHROPIC_MODEL` → `model` in settings → `ANTHROPIC_DEFAULT_MODEL` (default for new sessions, Week 34) — [Model configuration](https://code.claude.com/docs/en/model-config), [Commands](https://code.claude.com/docs/en/commands), [What's new](https://code.claude.com/docs/en/whats-new/index). `Alt+P` (Windows/Linux) switches model without clearing the prompt — [Interactive mode](https://code.claude.com/docs/en/interactive-mode). The `modelPicker` setting controls which models the picker lists (Week 35) — [What's new](https://code.claude.com/docs/en/whats-new/index)
- **List prices (relative weight vs plan limits):** Opus 5.5 `claude-opus-5-5` $4/$20 per Mtok, $0.20 cache reads (v2.1.280, Sep 22); Sonnet 5.5 `claude-sonnet-5-5` $2/$10, cache reads $0.20 (v2.1.284, Sep 28) repriced to $0.10 (v2.1.296, Oct 9); Haiku 5.5 `claude-haiku-5-5` $0.10/$0.50 ($0.50/$2.50 for prompts over 100K) (v2.1.293, Oct 7); all with 1M context — [Changelog](https://code.claude.com/docs/en/changelog)
- **Cache cost of switching:** "Each model has its own cache. Switching with `/model` means the next request reads the entire conversation history with no cache hits"; Claude Code asks to confirm only while the cache is warm; a skill/command whose frontmatter names another model is also a model switch for that turn — [Prompt caching](https://code.claude.com/docs/en/prompt-caching#switching-models)
- **Version gotchas:** Opus 5.5 needs v2.1.280+, Sonnet 5.5 v2.1.284+, Haiku 5.5 v2.1.293+, Fable 5.1 v2.1.257+ (`claude update`) — [Model configuration](https://code.claude.com/docs/en/model-config)
- **Safety-classifier fallback:** Fable/Opus 5.5 biology-flagged requests re-run on Opus 5, cyber-flagged on Opus 4.8; Sonnet 5.5 cyber → Sonnet 5 (bio = refusal); "After a fallback, the session continues on the fallback model" (use `/model` to return); `switchModelsOnFlag: false` = ask each time — [Model configuration](https://code.claude.com/docs/en/model-config#automatic-model-fallback)
- **Availability fallback chains:** `claude --fallback-model sonnet,haiku` or `"fallbackModel": [...]`; max 3; switch lasts the current turn only; also applies to subagents — [Model configuration](https://code.claude.com/docs/en/model-config#fallback-model-chains)
- **Limit gotcha:** "You've hit your session limit"/"weekly limit" is shared across all models, so `/model` doesn't restore access; after a model-specific "Opus limit"/"Sonnet limit" message, switching family does — [Costs](https://code.claude.com/docs/en/costs#when-a-developer-asks-about-a-limit)

#### Fable 5.1 / Fable 5 (`fable`, `best`)
- **What:** "the most capable models in Claude Code, suited to tasks larger than a single sitting"; not the default on any plan; Fable 5.1 arrived Week 36 (Aug 31–Sep 4, 2026) with a 1M window — [Model configuration](https://code.claude.com/docs/en/model-config#work-with-fable), [Week 36](https://code.claude.com/docs/en/whats-new/2026-w36)
- **How:** `/model fable` or `claude --model fable`; Fable 5 via `/model claude-fable-5`; advice: describe the outcome not the steps, set a `/goal`, skip verification reminders — [Model configuration](https://code.claude.com/docs/en/model-config#work-with-fable)
- **Cost:** "Depending on your plan and seat tier, Fable usage can bill to usage credits instead of drawing on your plan's included limits" (picker shows "Requires usage credits"; one-time consent prompt; in `-p`/SDK it bills without asking; in background sessions/teammates the consent prompt waits `dialogExpiry` = 5 min then ends the turn) — [Model configuration](https://code.claude.com/docs/en/model-config#fable-and-usage-credits)
- Support article mentions a separate weekly Fable limit only for Max — [Use Claude Code with your Pro or Max plan](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)

#### `opusplan` (hybrid)
- **What/How:** `/model opusplan` uses `opus` in plan mode and `sonnet` in execution; `/model opusplan[1m]` needs v2.1.265+ — [Model configuration](https://code.claude.com/docs/en/model-config#opusplan-model-setting)
- **Cost/gotcha:** "each plan-mode toggle is a model switch and starts a fresh cache" — [Prompt caching](https://code.claude.com/docs/en/prompt-caching#switching-models); under `opusplan` the usage-limit auto-wait waits for the reset instead of continuing early — [Interactive mode](https://code.claude.com/docs/en/interactive-mode#wait-for-a-usage-limit-to-reset)

#### Effort levels (`/effort`)
- **What:** effort controls adaptive reasoning; Opus 5.5, Sonnet 5.5, Haiku 5.5, Opus 5, Sonnet 5, Opus 4.8/4.7 and Fable support `low`, `medium`, `high`, `xhigh`, `max` (4.6 models lack `xhigh`) — [Model configuration](https://code.claude.com/docs/en/model-config#adjust-effort-level)
- **Defaults:** `medium` on Opus 5.5, Sonnet 5.5, Haiku 5.5; `xhigh` on Opus 4.7; `high` elsewhere. "In Anthropic's testing, Opus 5.5 at `medium` matches or exceeds Opus 5 at `high`"; `max` "may show diminishing returns and is prone to overthinking" — [Model configuration](https://code.claude.com/docs/en/model-config#choose-an-effort-level)
- **How:** `/effort` (slider), `/effort <level>`, `/effort auto`, `/effort status`; ←/→ in `/model`; `--effort`; `CLAUDE_CODE_EFFORT_LEVEL`; per-model `modelSettings`; `effort` frontmatter in skills/subagents; Enter saves as default, `s` = session only (v2.1.257+); `max` is session-only unless set by env var; `maxEffortLevel` caps it (Week 37) — [Model configuration](https://code.claude.com/docs/en/model-config#set-the-effort-level), [What's new](https://code.claude.com/docs/en/whats-new/index). The Agent tool gained an `effort` parameter so Claude runs a subagent at a requested level (v2.1.292, Oct 6) — [Changelog](https://code.claude.com/docs/en/changelog)
- **Cost:** "Each level trades token spend against capability"; on Opus 5.5, Sonnet 5.5, Haiku 5.5 and Fable 5.1 (API key or subscription) changing effort keeps the prompt cache; on most other models it invalidates it — [Model configuration](https://code.claude.com/docs/en/model-config#choose-an-effort-level), [Prompt caching](https://code.claude.com/docs/en/prompt-caching#changing-effort-level)
- **Desktop:** effort menu `Ctrl+Shift+E` on Windows — [Desktop](https://code.claude.com/docs/en/desktop#keyboard-shortcuts)

#### `ultrathink` and "think" phrases
- Including `ultrathink` anywhere in a prompt requests deeper reasoning for that turn via an in-context instruction; the API effort level is unchanged; "think", "think hard", "think more" are passed as ordinary text and are **not** keywords — [Model configuration](https://code.claude.com/docs/en/model-config#use-ultrathink-for-one-off-deep-reasoning)

#### Extended thinking toggle
- `Alt+T` (Windows/Linux) toggles thinking; `/config` sets `alwaysThinkingEnabled`; `MAX_THINKING_TOKENS=0` disables on older models; **thinking can't be turned off on Opus 5.5, Sonnet 5.5, Haiku 5.5 or Fable**; `Ctrl+O` shows thinking; "You are charged for all thinking tokens generated, even when collapsed or redacted" — [Model configuration](https://code.claude.com/docs/en/model-config#extended-thinking), [Interactive mode](https://code.claude.com/docs/en/interactive-mode). Thinking tokens bill as output tokens — [Costs](https://code.claude.com/docs/en/costs#adjust-extended-thinking)

#### Ultracode
- **What:** "a Claude Code setting rather than a model effort level: with it on, Claude orchestrates dynamic workflows for substantive tasks"; unavailable when workflows are off or the model lacks `xhigh` — [Model configuration](https://code.claude.com/docs/en/model-config#adjust-effort-level)
- **How:** `/effort ultracode [on|off]`, `Tab` in the `/effort` slider, `claude --effort ultracode` (also sets `xhigh`), `"ultracode": true`; typing the keyword `ultracode` in a prompt triggers a workflow (dismiss with `Alt+W` on Windows; disable via "Ultracode keyword trigger" in `/config`) — [Model configuration](https://code.claude.com/docs/en/model-config), [Workflows](https://code.claude.com/docs/en/workflows)
- **Cost/gotcha:** sessions with ultracode are exempt from the 20-concurrent-subagent limit and don't show the "Large workflow" warning — [Subagents](https://code.claude.com/docs/en/sub-agents#concurrent-subagent-limit), [Workflows](https://code.claude.com/docs/en/workflows#cost). On Pro, dynamic workflows must first be turned on in `/config` — [Workflows](https://code.claude.com/docs/en/workflows)

#### Fast mode (`/fast`)
- **What:** research preview; same Opus model "up to 2.5x faster at a higher cost per token"; supported on Opus 5.5, Opus 5, Opus 4.8 only — [Fast mode](https://code.claude.com/docs/en/fast-mode)
- **How:** `/fast` (Space, Enter) or `/fast on|off`, `"fastMode": true`, `Alt+O` on Windows; `↯` icon; persists across sessions unless `fastModePerSessionOptIn` — [Fast mode](https://code.claude.com/docs/en/fast-mode#toggle-fast-mode), [Interactive mode](https://code.claude.com/docs/en/interactive-mode)
- **Cost:** $8/$40 per MTok on Opus 5.5, $10/$50 on Opus 5/4.8; on Pro/Max "available via usage credits only and not included in the subscription rate limits"; "Fast mode usage draws directly from usage credits, even if you have remaining usage on your plan"; first enable in a conversation pays the full uncached context at fast-mode rates once — [Fast mode](https://code.claude.com/docs/en/fast-mode#understand-the-cost-tradeoff), [Prompt caching](https://code.claude.com/docs/en/prompt-caching#turning-on-fast-mode)
- **Version:** works in cloud sessions from v2.1.271 (Sep 14) and on the web model menu (v2.1.281) — [Fast mode](https://code.claude.com/docs/en/fast-mode#use-fast-mode-in-cloud-sessions), [Changelog](https://code.claude.com/docs/en/changelog)

#### Advisor tool (`/advisor`)
- **What/How:** experimental; Claude consults a second, stronger model at key moments; `/advisor fable|opus|sonnet|<id>|off`, `advisorModel` setting, `--advisor` flag; requires the Anthropic API — [Advisor](https://code.claude.com/docs/en/advisor), [Commands](https://code.claude.com/docs/en/commands)
- **Cost:** "advisor usage counts toward your plan's usage limits, except that a Fable advisor bills to usage credits on plans where Fable usage does"; toggling `/advisor` keeps the cached prefix — [Advisor](https://code.claude.com/docs/en/advisor), [Prompt caching](https://code.claude.com/docs/en/prompt-caching#connecting-or-removing-an-mcp-server)

#### Output styles (`/output-style`)
- Built-in styles besides Default include **Proactive** (starts work, makes reasonable assumptions) and **Concise** ("lead with the result and leave out preamble, narration, and recaps"); `/output-style concise` needs v2.1.269+; Concise added Week 34 — [Output styles](https://code.claude.com/docs/en/output-styles), [Commands](https://code.claude.com/docs/en/commands), [What's new](https://code.claude.com/docs/en/whats-new/index)

### Inferences
- Token economy for Pro: because Pro now defaults to Opus 5.5 (medium), a user who keeps hitting weekly limits should deliberately choose `sonnet` (Sonnet 5.5, half the list price) or `haiku` (Haiku 5.5, ~1/40 of Opus 5.5 list price per the changelog figures) per role, avoid mid-session model switches (full uncached re-read), use `ultrathink` per turn instead of raising session effort, and treat fast mode/Fable as paid extras (usage credits).
- **Game idea — /model & aliases:** "Class/rank" per NPC: leader = Sonnet 5.5 (or Opus 5.5 medium for hard quests), fixed agents = Sonnet, freelancers = Haiku 5.5; enforce with the mod `agent.spawn` hook (`next({...e, model:'haiku'})`) and show the model badge on each NPC card (from `$.agent.list()` / `/tasks`).
- **Game idea — Fable:** a "Legendary hero" summon gated behind an explicit confirmation that warns it may bill usage credits.
- **Game idea — opusplan:** "Strategist plans, soldier executes" toggle for the leader, with a UI warning that every plan-mode toggle rebuilds the cache.
- **Game idea — Effort:** per-NPC "Focus" dial mapped to subagent `effort` frontmatter / Agent-tool `effort` param / mod `turn.step` hook (`next({...e, effort})`); freelancers default to `low`.
- **Game idea — ultrathink:** a consumable "Insight scroll" that prefixes the next leader prompt with `ultrathink` (one turn only, no cache impact from changing effort).
- **Game idea — thinking:** show a "pondering" animation; hide the thinking toggle when the NPC runs a 5.5/Fable model (it can't be turned off).
- **Game idea — ultracode:** "Raise a war-band" button (runs `/effort ultracode`), shown only if workflows are enabled, with a big token-cost warning.
- **Game idea — fast mode:** "Haste potion" priced in real money (usage credits), disabled by default on Pro; if bought, apply only at session start.
- **Game idea — advisor:** "Elder sage" icon lights up when the advisor is consulted (mods `turn.step` result exposes `serverToolUses`, v2.1.290).
- **Game idea — output styles:** default every guild leader to Concise ("laconic NPCs") to cut output tokens; an NPC "speech style" selector maps to `/output-style`.

### Gaps
- Whether Fable on a Pro plan draws on included limits or always bills usage credits is not stated explicitly (docs say "depending on your plan and seat tier"; support only mentions a Max Fable weekly limit).
- No official token-per-effort-level multipliers are published; only qualitative guidance.
- Whether Opus 5.5 at medium costs more plan budget per task than Sonnet 5.5 at medium in practice is not documented (only list prices).

---

## Q2. Plan mode and permission modes (Shift+Tab cycle, plan approval, auto mode): how do they work now?

### Takeaway
Plan mode is entered with `Shift+Tab` (CLI) / `/plan` / `--permission-mode plan` and blocks source edits until you approve a plan ("Yes, and use auto mode" / "Yes, manually approve edits" / "No, keep planning"; `Ctrl+G` edits the plan). Auto mode is now the built-in starting mode (v2.1.283) and on Pro its classifier calls are **free**. In the Desktop app `Shift+Tab` does **not** cycle modes — use the mode selector or `Ctrl+Shift+M`.

### Cited Findings
- **Modes:** `default` (labelled Manual), `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions` — [Permission modes](https://code.claude.com/docs/en/permission-modes#available-modes)
- **Shift+Tab cycle (CLI):** from `auto` the first press goes to `default`, then `acceptEdits` → `plan` → optional `bypassPermissions` → `auto`; status bar shows `⏸ plan mode on` etc.; on Windows `Alt+M` when the runtime doesn't enable VT input mode — [Permission modes](https://code.claude.com/docs/en/permission-modes#switch-permission-modes), [Interactive mode](https://code.claude.com/docs/en/interactive-mode)
- **Plan mode behavior:** "Claude reads files, runs shell commands to explore, and writes a plan, but does not edit your source"; with auto mode available and `useAutoModeDuringPlan` on (default), the classifier reviews planning shell commands instead of prompting — [Permission modes](https://code.claude.com/docs/en/permission-modes#analyze-before-you-edit-with-plan-mode)
- **Enter:** `Shift+Tab`, `/plan [description]`, `claude --permission-mode plan`, or `defaultMode: "plan"` in `.claude/settings.json` — [Permission modes](https://code.claude.com/docs/en/permission-modes), [Commands](https://code.claude.com/docs/en/commands)
- **Approval:** options "Yes, and use auto mode", "Yes, manually approve edits", "No, keep planning"; `Ctrl+G` opens the plan in your editor; `showClearContextOnPlanAccept` adds "approve and clear the planning context"; accepting gives the session a generated title — [Permission modes](https://code.claude.com/docs/en/permission-modes#review-and-approve-a-plan)
- **Context:** the plan written in plan mode is re-injected from disk after compaction — [Context window](https://code.claude.com/docs/en/context-window#what-survives-compaction)
- **Cost guidance:** "Use plan mode for complex tasks… preventing expensive re-work when the initial direction is wrong" — [Costs](https://code.claude.com/docs/en/costs#work-efficiently-on-complex-tasks)
- **Desktop:** mode selector next to Send; "In Desktop, `Shift+Tab` doesn't cycle permission modes"; `Ctrl+Shift+M` opens the permission-mode menu on Windows; a Plan pick applies to the current session only (other picks are remembered per folder); Bypass requires the Settings toggle on Pro — [Desktop](https://code.claude.com/docs/en/desktop#keyboard-shortcuts), [Permission modes](https://code.claude.com/docs/en/permission-modes#switch-permission-modes)
- **Cloud/web:** cloud sessions offer Accept edits, Plan, Auto (no Bypass); Remote Control offers Manual, Accept edits, Plan, Auto — [Permission modes](https://code.claude.com/docs/en/permission-modes#switch-permission-modes)
- **Auto mode default:** "With Claude Code v2.1.283 or later, auto mode is the built-in starting permission mode for interactive terminal and VS Code sessions"; native Windows needs v2.1.233+ for the built-in auto default; Week 32 announced auto as default for Pro/Max/Team from **August 14, 2026** — [Permission modes](https://code.claude.com/docs/en/permission-modes), [Week 32](https://code.claude.com/docs/en/whats-new/2026-w32)
- **Auto mode cost on Pro:** "the classifier calls auto mode makes no longer count toward your usage limits" (Pro, Max, Team) — [Week 32](https://code.claude.com/docs/en/whats-new/2026-w32); "Pro, Max, and Team plans never show the notice" about billed classifier requests — [Auto mode classifier charges](https://code.claude.com/docs/en/auto-mode-classifier-billing)
- **Auto mode tools:** `/auto-mode-setup` drafts `autoMode.environment` (Pro/Max/Team, v2.1.228+, native Windows v2.1.233+); Bash prompts offer "Yes, and switch to auto mode" (v2.1.247+, not on PowerShell prompts); `/permissions` shows recent auto-mode denials; `/insights` estimates prompts auto mode could have handled (v2.1.281) — [Commands](https://code.claude.com/docs/en/commands), [Permission modes](https://code.claude.com/docs/en/permission-modes), [Changelog](https://code.claude.com/docs/en/changelog)
- **Safety:** auto mode "reduces permission prompts but does not guarantee safety"; the classifier also reviews every `SendMessage` to another agent (v2.1.222+) — [Permission modes](https://code.claude.com/docs/en/permission-modes#eliminate-prompts-with-auto-mode)
- **Teams:** a teammate spawned while the lead is in plan mode works read-only until its plan is ready; the lead approves it automatically — [Agent teams](https://code.claude.com/docs/en/agent-teams#have-teammates-plan-before-implementing)

### Inferences
- For a Pro user, auto mode is now the cheapest *and* least interruptive default for guild sessions (classifier free), with plan mode reserved for quest kickoff.
- **Game idea — Plan mode:** a "War council" phase: the leader always starts a quest in plan mode; the plan is shown as a quest scroll in the pane; approving it ("Yes, and use auto mode") starts the quest; approved plans are archived as quest logs (they also survive compaction).
- **Game idea — Auto mode:** show auto-mode denials (from `/permissions` → recent denials, or the mods `tool.check` events) as "the guard blocked an action" events in the guild feed.
- **Game idea — Desktop:** since `Shift+Tab` doesn't work in the Desktop Code tab, the mod should present its own mode chip (the `SessionMode` render site exists in Terminal and Desktop — [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference#render-sites)).

### Gaps
- Whether a mod can *change* the permission mode programmatically (vs. only redraw the mode display) is not documented in the pages read.

---

## Q3. Context management (/context, /compact, auto-compaction, /autocompact, /clear, what survives, prompt caching): how should the user keep context small?

### Takeaway
On the 1M-context 5.5/Fable models, auto-compaction waits until ~967K tokens by default, while every request re-sends the whole conversation — so a long session silently burns Pro limits. Use `/clear` between unrelated tasks (free), `/compact <focus>` at natural breaks (cheap while the cache is warm), and lower the trigger with `/autocompact 200k…500k` or `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE`. Subagents can now have their own `autoCompactWindow` (v2.1.296, Oct 9).

### Cited Findings
- **/context [all]:** colored grid of context usage with optimization suggestions — [Commands](https://code.claude.com/docs/en/commands)
- **/compact [instructions]:** summarizes the conversation; custom focus (e.g. `/compact Focus on code samples and API usage`) or a `# Compact instructions` section in CLAUDE.md — [Costs](https://code.claude.com/docs/en/costs#manage-context-proactively)
- **Compaction cost:** the summary request reads the prefix from cache while warm, "so a mid-session `/compact` costs a fraction of what the context size suggests"; after the cache expires it reprocesses the full history uncached (most expensive when resuming an old session); run it "at a natural break… instead of waiting for auto-compaction"; `/rewind` truncates to an already-cached prefix — [Prompt caching](https://code.claude.com/docs/en/prompt-caching#compacting-the-conversation). "When you want a fresh start instead of continuity, `/clear` costs nothing" — [Costs](https://code.claude.com/docs/en/costs#why-usage-climbs-in-a-long-session)
- **Auto-compact thresholds:** native-1M models (Fable, Sonnet 5+, Haiku 5.5, Opus 4.7+) "compact before the window fills, at about 967K tokens by default"; cloud sessions compact earlier; `CLAUDE_CODE_DISABLE_1M_CONTEXT=1` holds models to 200K — [Model configuration](https://code.claude.com/docs/en/model-config#default-auto-compact-thresholds)
- **/autocompact:** `/autocompact 500k` (100K–1M; `200` = 200K) saves per model in `modelSettings` (per-model since v2.1.288); `/autocompact auto` resets; `autoCompactWindow` setting; `--autocompact` flag; `CLAUDE_CODE_AUTO_COMPACT_WINDOW` env overrides all — [Model configuration](https://code.claude.com/docs/en/model-config#set-the-auto-compact-window), [Commands](https://code.claude.com/docs/en/commands)
- **Other knobs:** `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` (1–100, compact earlier; applies to main and subagents), `DISABLE_AUTO_COMPACT=1`, `DISABLE_COMPACT=1` — [Environment variables](https://code.claude.com/docs/en/env-vars)
- **Per-subagent window:** "Added `autoCompactWindow` to subagent frontmatter and `--agents` definitions, so a subagent can auto-compact earlier than the main conversation's window" (v2.1.296, Oct 9, 2026) — [Changelog](https://code.claude.com/docs/en/changelog)
- **What survives compaction:** system prompt/output style still apply; project-root CLAUDE.md, unscoped rules and auto memory re-injected from disk; fresh git status; the plan re-injected; up to five recently edited/read files re-read (files >5K tokens become path references); invoked skill bodies re-injected (5K tokens per skill, 25K total); background commands/subagents keep running; `SessionStart` hooks matching `compact` add their output — [Context window](https://code.claude.com/docs/en/context-window#what-survives-compaction)
- **/clear [name]:** aliases `/reset`, `/new`; previous conversation resumable via `/resume` or the rewind menu's previous-session entry (same process); `/usage` session totals reset on `/clear` (v2.1.211+) — [Commands](https://code.claude.com/docs/en/commands), [Checkpointing](https://code.claude.com/docs/en/checkpointing#rewind-past-a-cleared-conversation), [Costs](https://code.claude.com/docs/en/costs)
- **Why long sessions are expensive:** "Claude Code sends your full conversation with every request… so a one-line question in a session that has been open all day still draws usage for the whole conversation" — [Costs](https://code.claude.com/docs/en/costs#why-usage-climbs-in-a-long-session)
- **Cache lifetime:** on a subscription within plan usage the main conversation gets a **1-hour** TTL, while subagents, workflows, in-process teammates, forks and compaction get **5 minutes**; once you draw on usage credits the main conversation drops to 5 minutes; `promptCacheTtl` / `subagentPromptCacheTtl` override — [Prompt caching](https://code.claude.com/docs/en/prompt-caching#which-ttl-each-request-gets)
- **Actions that break vs keep cache:** break: model switch, effort change on older models, fast-mode first enable, MCP tool-definition changes when not deferred, enabling/disabling a plugin (depending on its components), denying an entire tool, compaction, many images (one slower turn per batch), upgrades (first turn after restart); keep: editing files, editing CLAUDE.md mid-session, changing permission mode, output style, invoking skills, `/recap`, rewinding — [Prompt caching](https://code.claude.com/docs/en/prompt-caching)
- **Cache stats:** `/usage` shows a `Prompt cache (main)` line (hit %, misses, likely cause, warm/cold) from v2.1.251 — [Costs](https://code.claude.com/docs/en/costs#prompt-cache-statistics)
- **CLAUDE.md hygiene:** "Aim to keep CLAUDE.md under 200 lines"; move workflow-specific instructions into skills (loaded on demand) — [Costs](https://code.claude.com/docs/en/costs#move-instructions-from-claude-md-to-skills); auto memory `MEMORY.md` loads its first 200 lines or 25KB every session — [Memory](https://code.claude.com/docs/en/memory)
- **MCP:** tool definitions are deferred by default (only names + server instructions enter context); prefer CLIs like `gh`; disable unused servers in `/mcp` — [Costs](https://code.claude.com/docs/en/costs#reduce-mcp-server-overhead)

### Inferences
- The single biggest Pro token lever in Oct 2026 is probably lowering the auto-compact window on the 1M models (e.g. `/autocompact 250k`) plus `/clear` between quests; the default ~967K trigger means late-session turns re-read (cached) hundreds of thousands of tokens each.
- **Game idea — "Aging" (context %):** age an NPC by its context fill: `$.session.usage().context.percent` (mods) or `context_window.used_percentage` (status line) for the leader, and `tokenCount/contextWindowSize` from `subagentStatusLine` task rows for subagents; life stages (apprentice → veteran → elder) at fixed fractions of the *configured* auto-compact window, not of 1M.
- **Game idea — Retirement/apprentice handoff:** at "elder", the game asks the NPC to write a handoff into its memory file (project `MEMORY.md` or `.claude/agent-memory/<name>/`), then runs `/compact <keep: open quests, decisions, handoff>` (or `/clear` + new session); a `SessionStart` hook with source `compact` re-injects the "apprentice charter" — the docs guarantee this hook output survives compaction.
- **Game idea — Lifespan per fixed agent:** set `autoCompactWindow` in each fixed agent's frontmatter (v2.1.296) as its "lifespan stat".
- **Game idea — /context:** an "Inventory weight" screen listing what occupies context (MCP, skills, memory) with "drop item" suggestions.
- **Game idea — Cache campfire:** a "campfire warm/cold" indicator (1h TTL on subscription for the leader, 5 min for subagents) telling the user when coming back will cost a full re-read, and nudging `/compact` at quest end.

### Gaps
- No official guidance on an "optimal" auto-compact window for Pro users; the 250K figure above is an inference.
- Whether a mod's `$.session.compact` accepts focus instructions is not documented in the pages read (method is listed only).

---

## Q4. Sessions, history and checkpoints (/resume, names, /branch, /fork, /rewind, resume-from-summary, /btw, /recap): how do they work?

### Takeaway
Sessions are saved continuously; resume with `claude --continue`, `claude --resume [name]` or `/resume`; name them (`-n`, `/rename`) so they're resumable and addressable. `/rewind` (or `Esc Esc`) restores code and/or conversation or summarizes from/up to a point; Bash-made and subagent-made file changes are **not** restored. On Pro, resuming a big idle session offers "Resume from summary".

### Cited Findings
- **Resume entry points:** `claude --continue`, `claude --resume` (picker), `claude --resume <name>`, `--resume <transcript-path>`, `--from-pr <number>`, `/resume` (alias `/continue`) — [Sessions](https://code.claude.com/docs/en/sessions#resume-a-session), [Commands](https://code.claude.com/docs/en/commands)
- **Resume from summary (Pro/Max):** when resuming a session idle more than ~1 hour and over 100,000 tokens, a dialog offers "Resume from summary" (runs `/compact`), "Resume full session as-is", "Don't ask me again" — [Sessions](https://code.claude.com/docs/en/sessions#resume-from-a-summary)
- **Names:** `claude -n <name>`, `/rename <name>`, `Ctrl+R` in the picker, plan-accept titles; unnamed sessions get a default display name like `my-app-3f` that is **not** a resume handle — [Sessions](https://code.claude.com/docs/en/sessions#name-your-sessions)
- **Picker shortcuts:** `Space` preview, `Ctrl+A` all projects, `Ctrl+W` all worktrees, `Ctrl+B` current branch, paste a PR/MR URL to find the session that created it — [Sessions](https://code.claude.com/docs/en/sessions#use-the-session-picker)
- **Branching:** `/branch [name]` (switch into a copy) or `claude --continue --fork-session`; `/fork [prompt]` copies the conversation into a new **background** session (v2.1.212+) that works in its own worktree; `/subtask <task>` spawns a forked subagent that reports back — [Sessions](https://code.claude.com/docs/en/sessions#branch-a-session), [Commands](https://code.claude.com/docs/en/commands)
- **Checkpoints:** automatic before each prompt that starts a turn; last 100 kept; saved with the conversation; snapshots deleted ~30 days after last save (`cleanupPeriodDays`) — [Checkpointing](https://code.claude.com/docs/en/checkpointing#automatic-tracking)
- **/rewind** (aliases `/checkpoint`, `/undo`) or `Esc Esc` on an empty prompt: Restore code and conversation / Restore conversation / Restore code / Summarize from here / Summarize up to here (optional guidance) / Never mind; "Summarize up to here" added Week 20; rewind past `/clear` added Week 26 — [Checkpointing](https://code.claude.com/docs/en/checkpointing#rewind-and-summarize), [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Checkpoint limits:** Bash-command file changes not tracked; subagent edits generally not restored ("Use git to revert them"); external/concurrent-session edits not tracked; "Not a replacement for version control" — [Checkpointing](https://code.claude.com/docs/en/checkpointing#limitations)
- **Storage:** subagent transcripts at `~/.claude/projects/{project}/{sessionId}/subagents/agent-{agentId}.jsonl`, cleaned after `cleanupPeriodDays` (30 days default) — [Subagents](https://code.claude.com/docs/en/sub-agents#resume-subagents)
- **/btw (side question):** answers from current context with **no tools**, never enters history, "while the conversation's prompt cache is warm, a side question costs little beyond the answer itself"; `f` forks the Q&A into a background subagent; Desktop side chat = `Ctrl+;` on Windows (not saved to disk) — [Interactive mode](https://code.claude.com/docs/en/interactive-mode#side-questions-with-btw), [Desktop](https://code.claude.com/docs/en/desktop#ask-a-side-question-without-derailing-the-session)
- **Session recap:** one-line recap generated after ≥3 minutes away (terminal unfocused, ≥3 turns), `/recap` on demand, capped at 400 chars, toggle in `/config` — [Interactive mode](https://code.claude.com/docs/en/interactive-mode#session-recap)
- **/export [filename]:** conversation as plain text — [Commands](https://code.claude.com/docs/en/commands)
- **Desktop ↔ CLI:** `/resume` in the Desktop prompt picks up CLI sessions (Week 35); `/desktop` (alias `/app`) moves a CLI session into Desktop (macOS or **x64** Windows, subscription only); `claude --desktop [--continue|--resume <id>]` (v2.1.285) — [Desktop](https://code.claude.com/docs/en/desktop#coming-from-the-cli), [Commands](https://code.claude.com/docs/en/commands)
- **Gotcha:** "If you resume the same session in two terminals without forking, messages from both interleave into one transcript" — [Sessions](https://code.claude.com/docs/en/sessions#branch-a-session)

### Inferences
- **Game idea — Names:** the mod should `/rename` each guild session `guild-<name>` on creation so it is resumable (`claude --resume guild-x`) and addressable by `@guild-x` in cross-session messaging.
- **Game idea — /rewind:** a "Time-turner" item; warn in-game that Bash-made changes and freelancer (subagent) edits won't be undone ("only git can").
- **Game idea — Summarize up to here:** "Chronicle compression" ritual that compresses old history while keeping the latest scene.
- **Game idea — /branch & /fork:** "Parallel timeline" quests (`/branch`) and "Send a squire" (`/fork <task>`) that runs as a background session in its own worktree.
- **Game idea — /btw:** "Whisper to the leader" box that asks a question without polluting the leader's memory (cheap while cache is warm).
- **Game idea — Recap:** a "Previously on…" banner when the user returns, sourced from the session recap.

### Gaps
- Exact token cost of automatic session recaps is not stated (prompt-caching docs only say `/recap` keeps the cache).

---

## Q5. Usage, cost and analytics on the Pro plan (/usage, /cost, /stats, /status, /insights, status line, usage ring, limits, usage credits, auto-continue): how can the user see and control spend?

### Takeaway
Pro has a **5-hour session limit and a weekly limit, shared between Claude chat and Claude Code** (and IDE use); Anthropic doubled Claude Code's 5-hour limits on May 6, 2026 but publishes no prompt counts. `/usage` (aliases `/cost`, `/stats`) shows plan bars plus an attribution breakdown by skill/subagent/plugin/MCP and the heaviest `/loop`s; the status line exposes `rate_limits.five_hour/seven_day` percentages; Claude Code can wait and auto-continue when a limit resets (not for weekly resets >24h away).

### Cited Findings
- **Pro limits:** "a five-hour session limit and a weekly limit… shared across Claude and Claude Code"; IDE usage counts toward the same limits; no prompt counts per window given; check with `/status`; decline API-credit offers to stay within the plan; an `ANTHROPIC_API_KEY` env var overrides subscription auth and causes API charges — [Use Claude Code with your Pro or Max plan](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan) (page says "Updated this week", no exact date)
- **Limit change:** published **May 6, 2026**: Claude Code five-hour limits doubled for Pro, Max, Team and seat-based Enterprise; peak-hours reduction removed for Pro and Max; weekly limits not mentioned — [Higher usage limits and a SpaceX compute deal](https://www.anthropic.com/news/higher-limits-spacex)
- **General factors that increase usage** (support): message/attachment size, conversation length, tool use, model choice and effort level, artifacts, multi-step tasks; projects' cached content "counts less against your limits when reused" — [Usage limit best practices](https://support.claude.com/en/articles/9797557-usage-limit-best-practices). Weekly limits reset at a fixed time per account (Settings > Usage) — per search-result summary of [How do usage and length limits work?](https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work) (not fetched directly)
- **/usage** (aliases `/cost`, `/stats` opens Stats tab): Session block (estimated $ at list price — "not relevant for billing" on Pro/Max), plan usage bars, **attribution** to skills, subagents, plugins and individual MCP servers, **behavior flags** (long context, cache misses ≥10%), **Loops** rows for the heaviest `/loop`/scheduled tasks (v2.1.242+); `d`/`w` = last 24h / 7 days; computed from local history on this machine only — [Costs](https://code.claude.com/docs/en/costs#using-the-usage-command), [Commands](https://code.claude.com/docs/en/commands)
- **/status:** version, model, account, connectivity; `Session kind`; `Peer address` (messaging inbox); `Auto mode server` row — [Commands](https://code.claude.com/docs/en/commands), [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging), [Auto mode classifier charges](https://code.claude.com/docs/en/auto-mode-classifier-billing)
- **/insights:** HTML report on how you work (projects, friction, features to try), up to 200 unseen sessions per run, written to `~/.claude/usage-data/report.html`; tokens count against your plan; not available in cloud sessions — [Costs](https://code.claude.com/docs/en/costs#analyze-your-usage-patterns), [Commands](https://code.claude.com/docs/en/commands)
- **Status line JSON:** `context_window.used_percentage/remaining_percentage/context_window_size`, `cost.total_cost_usd`, `rate_limits.five_hour.used_percentage`, `rate_limits.seven_day.used_percentage` and `resets_at` — `rate_limits` "appears only for claude.ai Pro and Max subscribers… and only after the first API response" — [Status line](https://code.claude.com/docs/en/statusline)
- **Per-subagent rows:** `subagentStatusLine` setting renders each subagent row in the agent panel from a command that receives a `tasks` array (with `tokenCount`, `contextWindowSize`); `agentType` added v2.1.293 — [Status line](https://code.claude.com/docs/en/statusline#subagent-status-lines), [Changelog](https://code.claude.com/docs/en/changelog)
- **Desktop usage ring:** "Click the usage ring next to the model picker to see your current context window usage and your plan usage" (context per session; plan usage shared across surfaces) — [Desktop](https://code.claude.com/docs/en/desktop#check-usage)
- **Auto-wait at a limit (CLI):** v2.1.234+, on by default in interactive claude.ai sessions; Claude continues the task after the reset; re-arms at most twice; **doesn't start on its own for resets >24h away** (weekly limits), in Remote Control or teammate sessions; never in background sessions or `-p`; turn off with `autoContinueAtUsageLimit: false`; `/rate-limit-options` offers "Wait here, then continue automatically" — [Interactive mode](https://code.claude.com/docs/en/interactive-mode#wait-for-a-usage-limit-to-reset), [Commands](https://code.claude.com/docs/en/commands)
- **Auto-continue on Desktop:** check "Auto-continue when limits reset" on the limit card (Week 33, Aug 10–14) — [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Usage credits:** `/usage-credits` opens Settings > Usage on Pro (turn on/off, monthly spend limit); continuing past a limit bills credits; main-conversation cache TTL drops to 5 min on credits — [Costs](https://code.claude.com/docs/en/costs#add-usage-credits-to-your-subscription), [Prompt caching](https://code.claude.com/docs/en/prompt-caching#which-ttl-each-request-gets)
- **Background token usage:** resume summarization and status checks "typically under $0.04 per session"; prompt suggestions send a short mostly-cached request after each response, skipped near the limit, can be turned off — [Costs](https://code.claude.com/docs/en/costs#background-token-usage)
- **Why usage climbs:** long context, cache misses after breaks, scheduled tasks firing while idle, cross-session messages delivered as new turns, `/goal` idle check-ins (max 3), subagents/workflows, teammates, compaction — [Costs](https://code.claude.com/docs/en/costs#why-usage-climbs-in-a-long-session)
- **Context-cost auditing:** `/skill-doctor` shows each skill's context cost and use frequency (v2.1.252+, Week 36); `/skills` sorts by token count (`t`); `claude plugin details <plugin>` shows what a plugin adds to context ("those tokens count against the user's usage whether or not the plugin gets used") — [Commands](https://code.claude.com/docs/en/commands), [Measure plugin cost](https://code.claude.com/docs/en/plugins/measure)
- **Ultrareview:** "Includes 3 free runs on Pro and Max, then requires usage credits" — [Commands](https://code.claude.com/docs/en/commands)

### Inferences
- Because `/usage` attribution is local-machine only, guild sessions on the same PC are all visible, but cloud/phone usage is not — the game's "treasury" must say so.
- **Game idea — Stamina/treasury HUD:** read `rate_limits.five_hour`/`seven_day` (status line) or `$.session.usage().rateLimits` (mods) and refresh on the mods `session.measure` event ("after each turn, and when a plan limit's percent used changes").
- **Game idea — "Who spent the gold" ledger:** mirror `/usage` attribution (press `w` for weekly) per skill/subagent/plugin/MCP and flag loops.
- **Game idea — Guild chronicle:** a monthly `/insights` report linked from the guild hall.
- **Game idea — Inn rest:** when a limit hits, show "Resting at the inn until HH:MM"; warn that weekly-limit resets (>24h) won't auto-continue.
- **Game idea — Economy mode:** a toggle that turns off prompt suggestions and session recaps, sets Concise style, lowers `/autocompact`, and forces freelancers to Haiku.
- **Game idea — Mod tax:** run `claude plugin details <the-game-plugin>` and `/skill-doctor` in-game to show the RPG mod's own per-session context "tax".

### Gaps
- No published numeric Pro weekly/5-hour budgets (support says usage depends on length/model/features).
- Whether the May 6 doubling still applies in Oct 2026 and whether weekly limits changed is not stated in sources found.

---

## Q6. Task lists, background tasks, Monitor and /goal: how do they work and what are the traps?

### Takeaway
The Task checklist (`TaskCreate/Get/List/Update`, `Ctrl+T`) is **off by default on Opus/Sonnet 5.5 and Haiku 5.5** (since v2.1.268) — enable with `CLAUDE_CODE_ENABLE_TODO_TOOLS=1`, share across sessions with `CLAUDE_CODE_TASK_LIST_ID`. `/tasks` and `Ctrl+B` manage background shells/subagents; the Monitor tool streams background events but **on Windows needs Git Bash**; `/goal` keeps Claude working until an evaluator confirms a condition.

### Cited Findings
- **Task tools availability:** "available by default only on Claude 3.x models, Opus 4 through 4.7, Sonnet 4 through 4.6, and Haiku 4.5… On every other model, Claude Code leaves the tools out unless you opt in" (rationale: newer models track work without a checklist; tool definitions cost context); opt in with `CLAUDE_CODE_ENABLE_TODO_TOOLS=1`, `--allowedTools TaskCreate`, or `--tools`; always present in background and cloud sessions; default applies from v2.1.268 — [Tools reference](https://code.claude.com/docs/en/tools-reference#task-tool-availability), [Environment variables](https://code.claude.com/docs/en/env-vars)
- **Task list UI:** `Ctrl+T` toggles (shows up to five tasks); tasks persist across compactions; "show me all tasks"/"clear all tasks"; share with `CLAUDE_CODE_TASK_LIST_ID=my-project claude` (named dir in `~/.claude/tasks/`) — [Interactive mode](https://code.claude.com/docs/en/interactive-mode#task-list)
- **TodoWrite:** disabled by default in favor of the Task tools; `CLAUDE_CODE_ENABLE_TASKS=0` re-enables it — [Tools reference](https://code.claude.com/docs/en/tools-reference)
- **/tasks** (alias `/bashes`): background shells and subagents incl. finished ones; `t` teleports to a cloud session from it — [Commands](https://code.claude.com/docs/en/commands), [Cloud](https://code.claude.com/docs/en/claude-code-on-the-web#continue-a-cloud-session-in-your-terminal)
- **Background Bash:** `Ctrl+B` (tmux: twice) backgrounds a running command; timed-out commands auto-move to background; local sessions have no time limit, unattended (`-p`, cloud) do; output >5GB terminated; `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS=1` disables — [Interactive mode](https://code.claude.com/docs/en/interactive-mode#background-bash-commands)
- **Stop all background subagents:** `Ctrl+X Ctrl+K` (press twice within 3 s) — [Interactive mode](https://code.claude.com/docs/en/interactive-mode)
- **Monitor tool:** runs a command/WebSocket in the background and feeds each line to Claude; deadline 5 min default, 30 min max (10 min in `-p`); "On Windows, the tool is available only when Git Bash is installed"; unavailable with `DISABLE_TELEMETRY` or `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`; plugins can declare auto-starting monitors; added Week 15 (Apr 6–10) — [Tools reference](https://code.claude.com/docs/en/tools-reference#monitor-tool), [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Monitor vs /loop:** Monitor "avoids polling altogether and is often more token-efficient and responsive than re-running a prompt on an interval" — [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks#let-claude-choose-the-interval)
- **/goal [condition|clear]:** sets a completion condition; starts a turn immediately; a small fast model evaluates after each turn ("typically negligible" cost); clears when met, judged impossible, or on an error you must fix; one goal per session; `◎ /goal active` indicator; doesn't change permission mode (use auto mode to run unattended); background work defers evaluation, with check-ins after 30 min and at most 3 idle check-ins per goal (`CLAUDE_CODE_GOAL_CHECKIN_MINUTES=0` disables); needs hooks trust (off under `disableAllHooks`); added Week 20 — [Goal](https://code.claude.com/docs/en/goal), [Costs](https://code.claude.com/docs/en/costs#why-usage-climbs-in-a-long-session)
- **PushNotification tool:** desktop notification plus phone push when Remote Control is connected — [Tools reference](https://code.claude.com/docs/en/tools-reference)

### Inferences
- **Game idea — Quest board:** the guild "quest board" = the Task list; the mod must set `CLAUDE_CODE_ENABLE_TODO_TOOLS=1` (settings `env`) for 5.5 models or the board stays empty, and `CLAUDE_CODE_TASK_LIST_ID=<guild>` so all of a guild's sessions share one board; show it with `Ctrl+T` or render it in the pane.
- **Game idea — Errands:** a panel mirroring `/tasks` (scouts/errands in flight) with a "Recall all scouts" button = `Ctrl+X Ctrl+K`.
- **Game idea — Watchtower NPC:** a Monitor-based watcher tailing build/test logs; on Windows show "requires Git Bash" and fall back to a self-paced `/loop`.
- **Game idea — Quest objective:** `/goal` as the quest's win condition with the evaluator's verdicts shown as quest progress; cap idle check-ins to save tokens.

### Gaps
- Whether the mods `$.agent.list()` statuses and the Task list can be linked (task ↔ agent) is not documented.

---

## Q7. Subagents ("fixed agents" and "freelancers"), forks, nesting, persistent memory, dynamic workflows and /batch: what controls exist?

### Takeaway
Subagents are defined as Markdown files (`.claude/agents/` project or `~/.claude/agents/` user) with frontmatter for `model`, `effort`, `tools`, `memory` (persistent per-agent knowledge), `isolation: worktree`, `background`, `maxTurns`, `omitClaudeMd`, and now `autoCompactWindow`. In interactive sessions "fork mode" is on, so spawned subagents run in the background and forks share the parent's prompt cache. Defaults: up to 20 concurrent, 3 nesting levels; named subagents can be resumed with `SendMessage`. Dynamic workflows scale to dozens–hundreds of agents (must be enabled in `/config` on Pro).

### Cited Findings
- **Where/how:** ask Claude or edit `.claude/agents/` / `~/.claude/agents/`; `/agents` now only prints a reminder (interactive UI removed after v2.1.197) — [Commands](https://code.claude.com/docs/en/commands)
- **Frontmatter:** `name`, `description`, `tools`, `disallowedTools`, `model` (`sonnet|opus|haiku|fable|<id>|inherit`), `permissionMode`, `maxTurns`, `skills` (preloaded full content), `mcpServers`, `hooks`, `memory` (`user|project|local`), `background`, `omitClaudeMd` (v2.1.271+), `effort`, `isolation: worktree`, `color`, `initialPrompt`, `experimental.cacheTtl` (5m/1h) — [Subagents](https://code.claude.com/docs/en/sub-agents#write-subagent-files); `autoCompactWindow` (v2.1.296) — [Changelog](https://code.claude.com/docs/en/changelog)
- **Persistent memory:** `memory: project` → `.claude/agent-memory/<agent>/` (shareable via git), `user` → `~/.claude/agent-memory/<agent>/`, `local` → `.claude/agent-memory-local/<agent>/`; the agent's prompt includes the first 200 lines/25KB of its `MEMORY.md` and instructions to curate it; `project` is the recommended default; requires auto memory on — [Subagents](https://code.claude.com/docs/en/sub-agents#enable-persistent-memory)
- **Model order:** per-invocation `model` → frontmatter → `CLAUDE_CODE_SUBAGENT_MODEL` → main model; a mod's `agent.spawn` hook can override; `CLAUDE_CODE_SUBAGENT_MODEL_FORCE=1` (v2.1.257+) forces one model for all subagents, teammates and workflow agents; `/tasks` shows each subagent's model and effort (v2.1.242+); subagents inherit the main thinking setting — [Subagents](https://code.claude.com/docs/en/sub-agents#choose-a-model). `CLAUDE_CODE_WORKFLOW_SUBAGENT_MODEL` sets one model for workflow agents (v2.1.296) — [Changelog](https://code.claude.com/docs/en/changelog)
- **Cost guidance:** delegate verbose operations (tests, docs fetching, logs) so output stays in the subagent; "choose a smaller model for a subagent" e.g. `model: haiku` — [Costs](https://code.claude.com/docs/en/costs#delegate-verbose-operations-to-subagents)
- **Background by default:** fork mode on by default in interactive sessions (v2.1.232+; Week 33) → all spawned subagents run in the background; prompts from background subagents surface in the main session (Esc denies one call) — [Subagents](https://code.claude.com/docs/en/sub-agents#run-subagents-in-foreground-or-background), [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Forks:** a fork inherits the full conversation and shares the parent's prompt cache, so it "costs less than a fresh subagent for tasks that need the same context"; start with `/subtask <task>`; panel keys `↑/↓`, `Enter` (open/message), `x` (stop), `Esc`; can't spawn further forks; `isolation: "worktree"` possible — [Subagents](https://code.claude.com/docs/en/sub-agents#fork-the-current-conversation)
- **Fresh context:** non-fork subagents get their own system prompt, the delegation message, CLAUDE.md hierarchy (unless `omitClaudeMd`), git status, preloaded skills and a sibling roster; they do **not** get the main auto memory or output style; their window is sized by their own model — [Subagents](https://code.claude.com/docs/en/sub-agents#what-loads-at-startup)
- **Cache:** subagent/fork/teammate requests get a 5-minute TTL by default (`subagentPromptCacheTtl: "1h"` bills higher cache writes) — [Prompt caching](https://code.claude.com/docs/en/prompt-caching#which-ttl-each-request-gets)
- **Names & resume:** Claude can name a subagent (it may do so on its own); `SendMessage` to a finished subagent resumes it with full history; built-in Explore/Plan are one-shot (no resume); a stopped (`x`) subagent doesn't auto-resume — [Subagents](https://code.claude.com/docs/en/sub-agents#resume-subagents)
- **Limits:** nesting up to 3 layers by default (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`); 20 running at once (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`); no total cap (the 200-per-session cap was removed in Week 32) — [Subagents](https://code.claude.com/docs/en/sub-agents#let-subagents-spawn-their-own-subagents), [Week 32](https://code.claude.com/docs/en/whats-new/2026-w32)
- **Auto-compaction:** subagents compact like the main conversation; `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` applies; `compact_boundary` events logged in subagent transcripts — [Subagents](https://code.claude.com/docs/en/sub-agents#auto-compaction)
- **Skills in a subagent:** skill frontmatter `context: fork` (+ `agent`, `background`, `model`, `effort`) runs a skill as a forked subagent — [Skills](https://code.claude.com/docs/en/skills)
- **Dynamic workflows:** a JavaScript script Claude writes that orchestrates many subagents in the background; "On Pro, turn them on from the Dynamic workflows row in `/config`"; bundled `/deep-research`; `/workflows` view (per-agent tokens, pause/resume/stop); "Large workflow" warning above 25 agents or 1.5M projected tokens; "a single run can use meaningfully more tokens"; run on a small slice first; available in CLI, Desktop, IDEs, `-p`, SDK; added Week 22 (May 25–29) — [Workflows](https://code.claude.com/docs/en/workflows), [What's new](https://code.claude.com/docs/en/whats-new/index)
- **/batch <instruction>:** splits a large change into 5–30 units, one background subagent per unit in an isolated worktree — [Commands](https://code.claude.com/docs/en/commands), [Run agents in parallel](https://code.claude.com/docs/en/agents)
- **Comparison:** subagents (Claude delegates in one session) vs agent view (you dispatch background sessions) vs agent teams (lead coordinates peers) vs dynamic workflows (script holds the plan) vs projects (cloud threads) — [Run agents in parallel](https://code.claude.com/docs/en/agents)

### Inferences
- **Game idea — Fixed agents:** each fixed NPC = `.claude/agents/<npc>.md` with `memory: project` (its knowledge lives in `.claude/agent-memory/<npc>/MEMORY.md`, version-controlled), `model: sonnet|haiku`, `effort: low|medium`, `omitClaudeMd: true` for narrow specialists (smaller starting context), `autoCompactWindow` as lifespan, `color` as NPC color.
- **Game idea — Freelancers:** one-off jobs = forks (`/subtask`) when they need the leader's context (cheapest, shared cache) or `general-purpose` subagents forced to Haiku via the mod's `agent.spawn` hook; code-writing freelancers get `isolation: worktree`.
- **Game idea — Apprentice:** retirement = create `<npc>-apprentice.md` whose memory dir is seeded with the elder's curated `MEMORY.md`; the elder's last act is "save what you learned to your memory".
- **Game idea — Mega Brain:** build the graph from the agent-memory directories + project auto memory + the mod's `$.store`; nodes = NPCs/memories, edges = SendMessage/handoffs observed via `session.send`/`session.receive`.
- **Game idea — Raid:** dynamic workflows as "raids" for huge tasks; the game shows the "Large workflow" threshold as a boss warning and offers "scout a small slice first".

### Gaps
- The full list of tools available to *background* subagents ("smaller built-in tool set") was not extracted.

---

## Q8. Parallel sessions, git worktrees and agent view (background sessions): how to run many sessions safely?

### Takeaway
`claude --worktree <name>` (`-w`) or the Desktop "worktree" option gives each session its own checkout under `.claude/worktrees/`; subagents use `isolation: worktree`. Agent view (`claude agents`, research preview) dispatches and monitors background sessions, and **`claude agents --json` is the supported machine-readable state feed** (state/status/waitingFor). Every parallel session consumes quota independently.

### Cited Findings
- **--worktree:** `claude --worktree feature-auth` creates `.claude/worktrees/<name>/` on branch `worktree-<name>`; add `.claude/worktrees/` to `.gitignore`; `.worktreeinclude` copies gitignored files such as `.env`; on exit Claude removes clean unnamed worktrees and prompts otherwise; return with `claude --worktree <name> --resume`; `-p --worktree` worktrees are not cleaned up — [Worktrees](https://code.claude.com/docs/en/worktrees)
- **EnterWorktree:** "work in a worktree" makes Claude create/switch worktrees; paths outside `.claude/worktrees/` prompt — [Worktrees](https://code.claude.com/docs/en/worktrees#ask-claude-to-create-a-worktree)
- **Subagent isolation:** `isolation: worktree` = temporary worktree branched from the default branch, auto-cleaned if unchanged — [Subagents](https://code.claude.com/docs/en/sub-agents#write-subagent-files); `worktree.baseRef` chooses remote default vs local HEAD (Week 19) — [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Windows note:** removing a worktree deletes only links (NTFS junctions/symlinks), not their targets — [Worktrees](https://code.claude.com/docs/en/worktrees#clean-up-worktrees)
- **Agent view:** `claude agents` opens one screen for all background sessions (research preview; Week 20); type a prompt to dispatch a new session; `Space` peek & reply; `Enter`/`→` attach; `←` detach; states Working / Needs input / Idle / Completed / Failed / Stopped; `Ctrl+F` find and `Alt+↑/↓` jump groups (v2.1.288); `n:<text>` filter (v2.1.287) — [Agent view](https://code.claude.com/docs/en/agent-view), [Changelog](https://code.claude.com/docs/en/changelog)
- **Background sessions:** `claude --bg`, `/background` (alias `/bg`), `←` on an empty prompt; run under a supervisor process without a terminal; survive sleep, not shutdown; edit files in their own worktree before editing (`worktree.bgIsolation: "none"` disables) — [Agent view](https://code.claude.com/docs/en/agent-view#how-file-edits-are-isolated), [Commands](https://code.claude.com/docs/en/commands)
- **Shell management:** `claude attach|logs <id|name>` (names v2.1.290+), `claude stop`, `claude respawn [--all]`, `claude rm`, `claude daemon status|logs|stop` — [Agent view](https://code.claude.com/docs/en/agent-view#manage-sessions-from-the-shell)
- **JSON feed:** "`claude agents --json` is the supported way to read session state from outside Claude Code"; fields `id`, `cwd`, `kind`, `state` (working/blocked/done/failed/stopped), `status` (busy/waiting/idle), `waitingFor` (permission prompt, input needed, sandbox request…), `sessionId`, `name`; `~/.claude/jobs/` files are not a stable interface — [Agent view](https://code.claude.com/docs/en/agent-view#list-sessions-as-json)
- **Cost:** row summaries are Haiku-class requests at end of turn and every few minutes during long turns; "running ten agents in parallel uses quota roughly ten times as fast as running one" — [Agent view](https://code.claude.com/docs/en/agent-view#row-summaries), [Agent view limitations](https://code.claude.com/docs/en/agent-view#limitations)
- **Windows:** agent view runs on Windows (fixes for win32-input-mode in v2.1.248; `taskkill /PID` recovery; `←` "Ambiguous ←" guard) — [Agent view](https://code.claude.com/docs/en/agent-view)
- **Desktop parallel sessions:** `+ New session` / `Ctrl+N`; `Ctrl+Tab` cycles; `Ctrl`-click a session for side-by-side; worktree option per session; worktree location and branch prefix in Settings > Claude Code; auto-archive after PR merge; OS notification when a session finishes — [Desktop](https://code.claude.com/docs/en/desktop#work-in-parallel-with-sessions)

### Inferences
- **Game idea — World map:** the mod polls `claude agents --json --all` via `$.process.run` every N seconds (mods `$.clock.every`) to draw every guild/background session with its state icon and "waiting for you" badge — this works across CLI background sessions, unlike the Desktop's own cross-session surface.
- **Game idea — Guild workspace:** each guild = one project folder; parallel quests within a guild run in Desktop worktree sessions; `.worktreeinclude` gives freelancers `.env`.
- **Game idea — Quota warning:** show "each extra guild member running = another full session draining stamina" before dispatching.

### Gaps
- Whether Desktop Code-tab sessions appear in `claude agents --json` (vs only CLI/background sessions) is not stated.

---

## Q9. Agent teams (experimental): how do lead/teammates, the shared task list and mailbox work, and what do they cost?

### Takeaway
Agent teams are **experimental, off by default** (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`), **CLI-only (not in the Desktop app)**, need an interactive session, and cost "significantly more tokens" (~7x a standard session when teammates plan). One lead per session, teammates with their own context, a shared task list with dependencies and file-locked claiming, and JSON mailboxes. On 5.5 models the shared task list only works if the Task tools are enabled.

### Cited Findings
- **Enable:** `"env": {"CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"}`; known limitations around resumption, task coordination, shutdown — [Agent teams](https://code.claude.com/docs/en/agent-teams)
- **Side effect:** while enabled, a subagent Claude names launches as a teammate, "so teams can form even when you didn't ask for one"; set the variable to `0` to stop — [Agent teams](https://code.claude.com/docs/en/agent-teams#claude-spawns-teammates-instead-of-subagents)
- **Interactive only:** in `-p` / Agent SDK, Claude doesn't spawn teammates — [Agent teams](https://code.claude.com/docs/en/agent-teams#enable-agent-teams)
- **Start:** describe the team in natural language ("Spawn three teammates… one on UX, one on architecture, one devil's advocate") — [Agent teams](https://code.claude.com/docs/en/agent-teams#start-your-first-agent-team)
- **Display:** in-process (default; any terminal; ↑/↓ select, Enter view/message, `x` stop, `Ctrl+T` task list) or split panes (`teammateMode: "auto"|"tmux"|"iterm2"`, `--teammate-mode`); split panes need tmux or iTerm2 and are "not supported in VS Code's integrated terminal, Windows Terminal, or Ghostty" — [Agent teams](https://code.claude.com/docs/en/agent-teams#choose-a-display-mode)
- **Models:** order = model named in spawn prompt → subagent definition's `model` → `CLAUDE_CODE_SUBAGENT_MODEL` → lead's model; `teammateDefaultModel` removed v2.1.234; teammates inherit lead effort; a teammate's model and fast mode are fixed at spawn — [Agent teams](https://code.claude.com/docs/en/agent-teams#specify-teammates-and-models)
- **Tasks:** states pending / in progress / completed, with dependencies; lead assigns or teammates self-claim; claiming uses file locking; agents without the Task tools coordinate by messages instead — [Agent teams](https://code.claude.com/docs/en/agent-teams#assign-and-claim-tasks); Task tools are off by default on 5.5 models — [Tools reference](https://code.claude.com/docs/en/tools-reference#task-tool-availability)
- **Architecture/storage:** lead, teammates, task list, mailbox; mailbox `~/.claude/teams/{team}/inboxes/{agent}.json`; team config `~/.claude/teams/{team}/config.json` (runtime state; don't edit); task list `~/.claude/tasks/{team}/` (persists); team name `session-` + first 8 chars of session ID — [Agent teams](https://code.claude.com/docs/en/agent-teams#architecture)
- **Roles from subagent definitions:** "Spawn a teammate using the security-reviewer agent type…" applies `tools`, `model`, `disallowedTools`, `effort`, body; `skills` not applied; `mcpServers` only for split-pane — [Agent teams](https://code.claude.com/docs/en/agent-teams#use-subagent-definitions-for-teammates)
- **Quality gates:** hooks `TeammateIdle`, `TaskCreated`, `TaskCompleted` (exit 2 = keep working / block) — [Agent teams](https://code.claude.com/docs/en/agent-teams#enforce-quality-gates-with-hooks)
- **Permissions/messages:** teammates inherit the lead's mode (not `dontAsk`); their prompts bubble to the lead; a message from another agent never counts as your approval — [Agent teams](https://code.claude.com/docs/en/agent-teams#permissions)
- **Context:** teammates load CLAUDE.md, MCP, skills + the spawn prompt; not the lead's history; idle notifications carry the final answer — [Agent teams](https://code.claude.com/docs/en/agent-teams#context-and-communication)
- **Cost:** "Agent teams use significantly more tokens than a single session"; "approximately 7x more tokens than standard sessions when teammates run in plan mode"; use Sonnet for teammates, keep teams small, shut down finished teammates; in-process teammate cache 5 min — [Agent teams](https://code.claude.com/docs/en/agent-teams#token-usage), [Costs](https://code.claude.com/docs/en/costs#agent-team-token-costs)
- **Best practice:** 3–5 teammates; 5–6 tasks per teammate; avoid two teammates editing one file; tell the lead to wait for teammates — [Agent teams](https://code.claude.com/docs/en/agent-teams#best-practices)
- **Limitations:** `/resume` & `/rewind` don't restore in-process teammates; task status can lag; one team per session; no nested teams; no background subagents from in-process teammates; lead fixed for life — [Agent teams](https://code.claude.com/docs/en/agent-teams#limitations)
- **Desktop:** "Agent teams… are available in the CLI, not in Desktop" (use dynamic workflows or cross-session management there) — [Desktop](https://code.claude.com/docs/en/desktop#whats-not-available-in-desktop). Cloud sessions can enable them via the env var — [Cloud](https://code.claude.com/docs/en/claude-code-on-the-web#manage-context)
- **Mods:** `agent.spawn` fires for teammates (`e.isTeammate`) from v2.1.289 — [Changelog](https://code.claude.com/docs/en/changelog), [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference)

### Inferences
- For a Pro user on the Desktop app, agent teams are both unavailable (Desktop) and expensive; the guild model maps better to "leader session + subagents + cross-session messaging".
- **Game idea — Raid party (CLI only):** an optional "raid" mode that launches the CLI with agent teams for big parallel reviews (3 Sonnet teammates), reading the mailbox JSON files to animate messages between party members and using `TeammateIdle` as a "morale check" hook.

### Gaps
- No numeric token benchmark beyond the "~7x in plan mode" statement.

---

## Q10. Cross-session messaging (guilds talking to each other): how does it work, on Windows and in Desktop, and what does it cost?

### Takeaway
Since v2.1.224 (macOS/Linux, Week 32) and **v2.1.234 on native Windows**, sessions on the same machine can message each other (`ListAgents`/`SendMessage`, `/list-agents` aka `/peers`, `@session-name` mentions), with inbound control `crossSessionInbound: accept|hold|refuse`. Delivered messages start a new turn in the receiver (full-context token cost). The Desktop Code tab has its own "work across sessions" surface (only Desktop-run sessions), and Desktop/VS Code sessions can't show the approval dialog for held messages.

### Cited Findings
- **Availability:** "requires Claude Code v2.1.224 or later on macOS and Linux, including Linux inside WSL 2. On native Windows, it requires Claude Code v2.1.234 or later… messaging is on with nothing to enable" — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging); launched Week 32 (Aug 3–7) for macOS/Linux — [Week 32](https://code.claude.com/docs/en/whats-new/2026-w32)
- **What:** one Claude writes plain text to another session ("never the sender's conversation history or files"); Claude may send on its own or when asked ("Explain what we just did to the session working on the payments API") — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging#message-another-session)
- **How:** `@` + name typeahead (v2.1.232+; quote names with spaces); `/list-agents` (alias `/peers`) shows reachable subagents, teammates, local sessions, and cloud/other-machine sessions when connected to Remote Control; a session answers to its `/rename`/`--name` name — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging#see-which-sessions-claude-can-reach)
- **Delivery:** read between tool calls during an active turn; if idle, a new turn starts; shows as `› Message from @api-worker: …` (Ctrl+O to expand) — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging#message-delivery)
- **Idle notice:** `notify_when_idle` asks another local session for one notice when it next goes idle/exits (v2.1.236+, expires after 12 h, no tokens in the watched session) — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging#get-a-notice-when-another-session-goes-idle)
- **Safety:** an incoming message can't approve prompts, can't change configuration, `/commands` in it don't run, permission prompts still fire — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging#how-a-session-treats-an-incoming-message)
- **Inbound control:** `crossSessionInbound` = `accept` / `hold` / `refuse` (also `/config` row "Messages from your other sessions", v2.1.232+); default delivers unless sender bypasses permissions; held messages max 100; `isolatePeerMachines: true` requires approval before any cross-machine send; deny `SendMessage`/`ListAgents` to stop sending — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging#control-inbound-messages)
- **Desktop/VS Code gotcha:** "A session in the VS Code extension or the Desktop app can't show the dialog. Claude Code keeps a held message there until the same deadline" (`dialogExpiry`, 5 min) — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging#control-inbound-messages)
- **Windows transport:** per-session named pipe on native Windows (Unix socket elsewhere); scripts posting to a session must send `{"type":"auth","token":"<CLAUDE_CODE_MESSAGING_TOKEN>"}` first on Windows; socket path in `/status` → `Peer address` and `CLAUDE_CODE_MESSAGING_SOCKET` — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging#the-sessions-inbox-socket)
- **Reachability gotchas:** "A session inside WSL 2 and a native Windows session on the same computer can't reach each other"; container ↔ host can't; other machines/cloud only via Remote Control with a claude.ai login; `--bare` `-p` sessions bind no socket — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging#message-sessions-on-other-machines)
- **Limits:** plain text only; ~1M-character cap per same-machine message; burst refusals; loops throttled (≤50 queued accepted messages) — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging#limitations)
- **Cost:** "Once delivered, the message counts toward usage like a prompt you type"; an idle receiver starts a new turn "sending your full context each time"; set `crossSessionInbound: hold` to avoid that — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging#message-delivery), [Costs](https://code.claude.com/docs/en/costs#why-usage-climbs-in-a-long-session)
- **Desktop "Work across sessions":** Claude can list Code-tab sessions, read what each did, message, rename or archive them ("tell the payments session the schema changed"); sees only sessions the desktop app runs (local, SSH, WSL), **not** CLI, VS Code or cloud sessions; 20 most recent by default; messages shown as a card with sender title; archiving always asks you — [Desktop](https://code.claude.com/docs/en/desktop#work-across-sessions)
- **Mods API:** `$.session.send({ to: {sessionId} | {agentId} | address, text })` makes "the same delivery the SendMessage tool makes"; `session.receive`/`session.send` events let a mod observe or consume messages — [Mods API](https://code.claude.com/docs/en/plugins/mods/api#send-and-receive-messages-between-sessions)
- **Teams comparison:** structured team-protocol messages stay within a team; cross-session = sessions you run yourself — [Agent teams](https://code.claude.com/docs/en/agent-teams)

### Inferences
- The user's "guilds message each other only when asked" requirement maps to: guild sessions set `crossSessionInbound: "hold"` (or the mod consumes unsolicited messages in `session.receive`) and an explicit "Send envoy" action in the game that calls `$.session.send`.
- **Game idea — Diplomacy/envoys:** "Send envoy" button → `$.session.send({to:{sessionId}, text})`; a raven animation; `notify_when_idle` = "raven returns when the other guild rests". In the Desktop app the leader can also be asked in plain language ("tell the payments guild…") via the built-in cross-session surface.
- **Game idea — Diplomatic immunity:** since messages delivered to an idle guild cost a full-context turn, the game shows a cost warning on each envoy and batches multiple notes into one message.
- Keep all guilds either native-Windows or all-WSL: mixing breaks messaging.

### Gaps
- Whether Desktop Code-tab local sessions are listed by CLI `/list-agents` (i.e., bind an inbox pipe) is implied (they have inbound controls) but not explicitly confirmed.

---

## Q11. Scheduling, automation, remote and cloud (/loop, cron tools, reminders, Desktop scheduled tasks, Routines, Remote Control, cloud sessions, Projects, channels, hooks, headless -p, Agent SDK, GitHub Actions, deep links): what are the options on Pro?

### Takeaway
Three schedulers: `/loop`/cron tools (in-session, machine on, min 1 min, 7-day expiry), Desktop scheduled tasks (local, app open, min 1 min), and Routines (cloud, research preview, min 1 h, Pro included). Remote Control lets the phone/web drive a local session; cloud sessions (`claude --cloud`, pull back with `--teleport`) run on Anthropic VMs and count toward plan limits; Projects (public beta, Pro/Max) coordinate parallel cloud "threads" from one conversation — but default to Opus with high effort and burn Pro limits faster.

### Cited Findings

#### /loop and cron tools
- **What/How:** `/loop 5m <prompt>` fixed interval; `/loop <prompt>` self-paced (Claude picks 1 min–1 h); bare `/loop` runs the built-in maintenance prompt or `.claude/loop.md` / `~/.claude/loop.md` (≤25,000 bytes); alias `/proactive`; skills allowed as prompt; `Esc` stops a self-paced loop — [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks#run-a-prompt-repeatedly-with-loop), [Commands](https://code.claude.com/docs/en/commands)
- **One-shot reminders:** "remind me at 3pm to push the release branch" → single-fire task; tools `CronCreate`, `CronList`, `CronDelete`; 8-char IDs; max 50 tasks per session; local timezone; jitter (recurring runs up to half the interval/30 min late; `*/5` runs at 4m45s) — [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks)
- **Limits:** session-scoped; fire only while Claude Code runs and is idle; no catch-up; recurring tasks expire after 7 days; restored on `--resume` (self-paced loops are not); backgrounding carries loops to the background session; `CLAUDE_CODE_DISABLE_CRON=1` — [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks#limitations)
- **Cost:** "a scheduled task fires on its interval even while the session is idle, sending your full context each time"; `/usage` lists the heaviest loops — [Costs](https://code.claude.com/docs/en/costs)

#### Desktop scheduled tasks
- Local tasks in the Desktop **Routines** page (Code tab → Routines → New routine → Local); access to local files; fire only while the app is open and the computer awake; per-task permissions; optional worktree per run; min interval 1 minute; needs Desktop 1.1.5368+ — [Desktop scheduled tasks](https://code.claude.com/docs/en/desktop-scheduled-tasks)

#### Routines (cloud scheduled triggers)
- **What:** saved prompt + repos + connectors run on Anthropic cloud (research preview) via schedule (hourly/daily/weekdays/weekly/one-off), API `/fire` POST with bearer token (beta header `experimental-cc-routine-2026-04-01`), or GitHub events; available on **Pro**, Max, Team, Enterprise; manage at claude.ai/code/routines or `/schedule` (alias `/routines`); run autonomously with no permission picker; draw subscription usage; hourly caps (100 scheduled runs/hour/account; 30 Run-now+API fires/hour/routine) — [Routines](https://code.claude.com/docs/en/routines)
- **Comparison:** Cloud min interval 1 h, no local files (fresh clone), machine can be off — [Scheduled tasks](https://code.claude.com/docs/en/scheduled-tasks#compare-scheduling-options)

#### Remote Control
- **What:** drive a session running on your machine from claude.ai/code or the Claude mobile app; filesystem, MCP and tools stay local; survives sleep/network drops — [Remote Control](https://code.claude.com/docs/en/remote-control)
- **How:** `claude remote-control` (server mode, many concurrent sessions), `claude --remote-control`, `/remote-control` (alias `/rc`) in CLI/Desktop/VS Code; Desktop has a per-session Remote Control switch and "Connect new sessions to Remote Control"; `remoteControlAtStartup` / `disableRemoteControl` settings — [Remote Control](https://code.claude.com/docs/en/remote-control), [Desktop](https://code.claude.com/docs/en/desktop#control-which-sessions-appear-on-your-other-devices)
- **Requirements/gotchas:** Pro/Max/Team/Enterprise; API keys, Bedrock/Vertex/Foundry, custom `ANTHROPIC_BASE_URL` and gateways unsupported; `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` disables it; local process must keep running; one remote session per interactive process; terminal-panel commands (`/plugin`, `/resume`) are local-only, while `/compact`, `/clear`, `/context`, `/usage`, `/model x`, `/effort x`, `/fast`, `/rename`, `/config key=value` (mobile) work remotely — [Remote Control](https://code.claude.com/docs/en/remote-control#requirements), [Remote Control limitations](https://code.claude.com/docs/en/remote-control#limitations)
- **Phone device card:** any machine running `claude remote-control` shows as a device card so you can start a session on it from the phone (Week 34); forking an RC session from the app runs it as a background session (v2.1.273) — [What's new](https://code.claude.com/docs/en/whats-new/index), [Changelog](https://code.claude.com/docs/en/changelog)

#### Cloud sessions (claude.ai/code, web/mobile/Desktop "Cloud")
- **What:** Claude Code on Anthropic-managed VMs that keeps running after you close the laptop; Pro included; counts toward plan limits, "no separate charge for the cloud VM"; needs GitHub (non-GitHub via `CCR_FORCE_BUNDLE=1` bundle, no push back) — [Cloud](https://code.claude.com/docs/en/claude-code-on-the-web)
- **How:** `claude --cloud "task"` clones the GitHub remote at the current branch (push first); one-way from CLI; `claude --teleport [id]`, `/teleport` (`/tp`), `/tasks` → `t`, or claude.ai "Open in > Terminal" pulls a session back (clean git state, same repo/account); Desktop "Open in > Cloud" moves a local session with a summary — [Cloud](https://code.claude.com/docs/en/claude-code-on-the-web#move-tasks-between-terminal-and-cloud), [Desktop](https://code.claude.com/docs/en/desktop#continue-in-another-surface)
- **Differences from local:** text-output commands only; `/clear` unavailable (start a new session); `/config` opens web settings; auto-compaction triggers partway through the window; subagents work; agent teams via env var; doesn't read your machine's `~/.claude` setup — [Cloud](https://code.claude.com/docs/en/claude-code-on-the-web#manage-context), [Projects](https://code.claude.com/docs/en/claude-projects#how-a-project-is-organized)
- **PR helpers:** `/autofix-pr [prompt]` spawns a cloud session that fixes CI failures/review comments on your branch's PR; `/code-review ultra` / `/ultrareview` deep cloud review (3 free runs on Pro) — [Commands](https://code.claude.com/docs/en/commands)

#### Projects (claude.ai/code + Desktop)
- **What:** "one ongoing conversation where Claude coordinates a stream of related work"; Claude starts a **thread** (usually a cloud session, or a local one via Remote Control) per task; Overview pane shows what needs you; project instructions + memory reach every thread; public beta on **Pro and Max**, gradual rollout, not in CLI/VS Code/JetBrains — [Projects](https://code.claude.com/docs/en/claude-projects)
- **Cost:** "A new project runs Opus everywhere, with high effort for threads and low effort for the conversation" (change in Project settings > General); "on a Pro plan in particular you should expect to reach your limit sooner on days you run one"; enforced limit 200 new threads/day; idle threads watching a PR wake on CI/comments; threads that hit the limit wait and continue after reset — [Projects](https://code.claude.com/docs/en/claude-projects#usage-and-cost)

#### Channels
- MCP servers that push events (Telegram, Discord, iMessage; require Bun) into a **running** session; research preview; Pro included — [Channels](https://code.claude.com/docs/en/channels), [Feature availability](https://code.claude.com/docs/en/feature-availability)

#### Hooks (settings hooks)
- Shell/HTTP/prompt handlers on events incl. `SessionStart`, `SessionEnd`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`, `SubagentStart`, `SubagentStop`, `PreCompact`, `PostCompact`, `Notification`, `TeammateIdle`, `TaskCreated`, `TaskCompleted`, `PermissionRequest`, `PreModelSwitch`, `ConfigChange`, `CwdChanged`, `FileChanged`, `WorktreeCreate/Remove` — [Hooks guide](https://code.claude.com/docs/en/hooks-guide); a PreToolUse hook can filter test output to cut context — [Costs](https://code.claude.com/docs/en/costs#offload-processing-to-hooks-and-skills); `onFailure: "block"` (v2.1.295) — [Changelog](https://code.claude.com/docs/en/changelog); Notification hook gets `agent_needs_input`/`agent_completed` from agent view — [Agent view](https://code.claude.com/docs/en/agent-view#read-session-state)

#### Headless `-p`, bare mode, Agent SDK, GitHub Actions, deep links
- **-p:** `claude -p "…" --allowedTools … --output-format …`; exit codes for scripts; `-p` rejects `--bg`; fork mode off by default — [Headless](https://code.claude.com/docs/en/headless)
- **--bare:** skips hooks, skills, plugins, MCP, auto memory, CLAUDE.md; "bare mode doesn't use your subscription login" — needs `ANTHROPIC_API_KEY` — [Headless](https://code.claude.com/docs/en/headless#start-faster-with-bare-mode)
- **Agent SDK (Python/TypeScript):** same loop/tools as Claude Code; "Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK" — [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)
- **GitHub Actions:** `/install-github-app`; `@claude` in issues/PRs; subscription auth via `CLAUDE_CODE_OAUTH_TOKEN` from `claude setup-token` (Pro/Max/Team/Enterprise); API key recommended for shared secrets — [GitHub Actions](https://code.claude.com/docs/en/github-actions)
- **Deep links:** `claude-cli://` URLs open Claude Code in a **new terminal window** in a given directory with a prefilled (unsent) prompt — [Deep links](https://code.claude.com/docs/en/deep-links)

#### Mobile & Dispatch
- The Claude iOS/Android app is a client (cloud sessions, projects, Remote Control, Dispatch); push notifications when a task finishes or needs you (Week 16) — [Mobile](https://code.claude.com/docs/en/mobile), [What's new](https://code.claude.com/docs/en/whats-new/index)

### Inferences
- For a Pro user, `/loop` and Routines are silent token drains; prefer Monitor (if Git Bash) or event-driven channels/hooks over polling.
- **Game idea — Patrols:** `/loop` with self-paced interval as "patrols", each shown with its cost from `/usage` Loops rows; auto-cancel after N iterations.
- **Game idea — Messenger reminder:** "Messenger arrives at 15:00" = one-shot reminder.
- **Game idea — Daily guild council:** a Desktop scheduled task (local) at a fixed time, worktree-isolated.
- **Game idea — Expeditions:** Routines/cloud sessions as "expeditions" that run while the PC is off; "Recall expedition" = `--teleport`.
- **Game idea — Command from the road:** Remote Control switch per guild; the phone shows guild sessions; Dispatch = "courier from the phone".
- **Game idea — Projects comparison:** treat Projects as Anthropic's own "guild" analogue; if used, set Thread model to Sonnet/Haiku and lower effort first.
- **Game idea — Event bus:** settings hooks (`SubagentStart/Stop`, `TaskCreated/Completed`, `Notification`) or, better, mod events drive the guild feed.
- **Game idea — Quest links:** deep-link buttons that open a new guild session in its folder with a prefilled quest (note: opens a terminal window, not Desktop).
- Avoid `--bare` and the Agent SDK for personal game automation on Pro (API key billing).

### Gaps
- Routine run-count limits per Pro plan per day (beyond hourly caps) not stated.
- Whether Desktop scheduled tasks count toward `/usage` Loops rows is not stated.

---

## Q12. The Claude desktop app and surrounding apps (Code tab local/cloud/SSH/WSL, panes, side chat, usage ring, built-in browser, Claude in Chrome, computer use, Dispatch, Cowork, artifacts, mobile): what's specific, especially on Windows?

### Takeaway
The Desktop app (Windows x64 and ARM64 installers) has Chat, **Cowork** and **Code** tabs. The Code tab runs the same engine as the CLI with sessions in a sidebar, drag-and-drop panes (chat, diff, browser, terminal, file, plan, tasks, subagent), side chat, a usage ring, a built-in browser, computer use (Windows+macOS, Pro/Max), Dispatch sessions, local scheduled tasks and mods. Missing vs CLI: agent teams, `dontAsk`, `-p`, `/config key=value`, terminal-panel commands, and `Shift+Tab`.

### Cited Findings
- **Tabs:** "Chat for conversations, Cowork for Dispatch and longer agentic work, and Code for software development" — [Desktop](https://code.claude.com/docs/en/desktop)
- **Install:** macOS universal, Windows x64, Windows ARM64 installer, Linux beta (apt/.deb, Week 27) — [Desktop](https://code.claude.com/docs/en/desktop), [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Session setup:** Environment = Local / Cloud / SSH / WSL distribution (Windows), project folder, model, permission mode — [Desktop](https://code.claude.com/docs/en/desktop#start-a-session)
- **WSL sessions:** need WSL 2 + git in the distro; trust is per distro+folder; plugins (hence mods) aren't available in WSL sessions; a WSL session and a native Windows session can't message each other — [Desktop in WSL](https://code.claude.com/docs/en/desktop-wsl), [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview#where-mods-run), [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging)
- **Panes:** chat, diff, browser, terminal, file, plan, tasks, subagent (+ iOS Simulator on macOS); `Ctrl+\` closes focused pane; panes can pop out into their own window (Week 37); requires Desktop v1.2581.0+ — [Desktop](https://code.claude.com/docs/en/desktop#arrange-your-workspace), [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Windows shortcuts:** `Ctrl+/` all shortcuts, `Ctrl+N` new session, `Ctrl+Tab` cycle, `Ctrl+Shift+D` diff, `Ctrl+Shift+B` browser, `` Ctrl+` `` terminal, `Ctrl+;` side chat, `Ctrl+O` view modes (Normal/Thinking/Verbose), `Ctrl+Shift+M/I/E` mode/model/effort menus — [Desktop](https://code.claude.com/docs/en/desktop#keyboard-shortcuts)
- **Tasks pane:** shows subagents, background shells and dynamic workflows of the current session — [Desktop](https://code.claude.com/docs/en/desktop#watch-background-tasks)
- **Usage ring:** context window usage (per session) + plan usage (shared) — [Desktop](https://code.claude.com/docs/en/desktop#check-usage)
- **Built-in browser:** tabbed Browser pane with a clean profile (no saved logins); safety classifiers review write actions on external sites; per-site approval; use Claude in Chrome when you need your logged-in identity (Week 28) — [Desktop](https://code.claude.com/docs/en/desktop#browse-external-sites)
- **Claude in Chrome:** GA on all direct Anthropic plans (Week 27); Chrome/Edge (+ other Chromium detection); needs `/login` (not API key/`setup-token`); not supported in WSL; Windows registry NativeMessagingHosts troubleshooting — [Chrome](https://code.claude.com/docs/en/chrome), [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Computer use:** Desktop research preview on **macOS and Windows**, Pro/Max only (not Team/Enterprise), off by default (enable in Settings); background operation is macOS-only (Week 36); Claude prefers connectors → Bash → Chrome → iOS Simulator before screen control; CLI computer use is macOS-only — [Desktop](https://code.claude.com/docs/en/desktop#let-claude-use-your-computer), [Computer use (CLI)](https://code.claude.com/docs/en/computer-use)
- **Dispatch:** persistent conversation in Cowork that can spawn Code sessions (badge in sidebar, phone push on finish/approval); Pro/Max only; computer-use approvals in Dispatch sessions expire after 30 min — [Desktop](https://code.claude.com/docs/en/desktop#sessions-from-dispatch)
- **Cowork:** "uses the same agentic architecture that powers Claude Code, accessible within Claude Desktop without opening the terminal"; reads/writes local files, sub-agent coordination, Claude in Chrome pairing; loads connectors/skills/plugins enabled on the claude.ai account (Customize) and "doesn't read the Claude Code CLI's `~/.claude` directory"; has its own permission modes — [Cowork overview](https://claude.com/docs/cowork/overview), [Permission modes](https://code.claude.com/docs/en/permission-modes)
- **Artifacts:** live web pages on claude.ai published from a session (private until shared) on Pro/Max/Team/Enterprise with `/login`; `/artifacts` lists/attaches; can call the viewer's MCP connectors (v2.1.209+, Week 29); `/design` and `/slides` templates on by default on Pro — [Artifacts](https://code.claude.com/docs/en/artifacts), [Commands](https://code.claude.com/docs/en/commands)
- **CLI ↔ Desktop:** shared CLAUDE.md, MCP (`~/.claude.json`, `.mcp.json`, plus `claude_desktop_config.json` in local Code sessions), hooks, skills, settings; `/desktop` and `claude --desktop` move a CLI session in (macOS or x64 Windows); Desktop `/resume` picks up CLI sessions — [Desktop](https://code.claude.com/docs/en/desktop#coming-from-the-cli)
- **Not in Desktop:** agent teams; `--print`/scripting; `dontAsk`; inline completions; commands with only a terminal panel (`/permissions` → "isn't available in this environment"); `/config` opens Settings and ignores `key=value`; `Shift+Tab` doesn't cycle modes — [Desktop](https://code.claude.com/docs/en/desktop#whats-not-available-in-desktop)
- **Auto-continue:** Desktop limit card "Auto-continue when limits reset" (Week 33) — [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Mods in Desktop:** hooks run and panes render in the Code tab (Desktop bundles Claude Code; mods from v2.1.286), except WSL sessions — [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview#turn-mods-on-or-off)
- **Windows troubleshooting:** PATH after install needs a new terminal; MCP toggles not responding → check config, restart app, Task Manager; end app via Task Manager — [Desktop](https://code.claude.com/docs/en/desktop#windows-specific-issues)
- **Windows shell:** Git for Windows no longer required (Week 18); PowerShell tool auto-enabled when Git Bash is absent and on by default for claude.ai accounts even with Git Bash; denying Bash also turns PowerShell off; Git Bash still needed for Monitor — [Tools reference](https://code.claude.com/docs/en/tools-reference#powershell-tool), [What's new](https://code.claude.com/docs/en/whats-new/index)

### Inferences
- **Game idea — Guild hall pane:** the game's side panel = a mod `Pane` docked beside the transcript (works in Desktop Code tab); keep guild sessions on native Windows (not WSL) so the mod loads.
- **Game idea — Tavern gossip:** side chat (`Ctrl+;` / `/btw`) as "tavern gossip" that never ages the leader.
- **Game idea — Stamina mirror:** mirror the Desktop usage ring inside the game HUD (same numbers from `$.session.usage()`).
- **Game idea — Browser quests:** use the built-in Browser pane for "scouting" docs (clean profile), Claude in Chrome only for "act as me" quests.
- **Game idea — Guild hall page:** publish a read-only "Guild Hall" status artifact (live page) the user can open on the phone.
- **Game idea — Courier:** Dispatch from the phone as a "courier" that creates a new quest session in the Code tab.

### Gaps
- Whether a mod's pane can be popped out into its own Desktop window (Week 37 pane pop-out) is not stated.
- Cowork plan availability details were not captured beyond Dispatch requiring Pro/Max.

---

## Q13. Mods (the runtime the game is built on): what can a mod do, where does it run, and which API calls map to the game's needs?

### Takeaway
Mods (GA in v2.1.287, Oct 1, 2026; Desktop from v2.1.286) are JS/TS plugins that run inside Claude Code: they draw panes/bands, hook tool calls/prompts/turns/subagent spawns/compaction/messages, register commands and tools, call models on the user's plan, run timers, and share a machine-wide key-value store. Key game APIs: `$.agent.list()` (statuses), `$.session.usage()` (context % + rate limits), `$.session.send` (guild messaging), `agent.spawn`/`turn.step` (choose model/effort), `$.store` (cross-session state), `$.model.complete` (Haiku NPC text, billed), `$.clock.every` (polling), `$.ui.*` (UI).

### Cited Findings
- **What:** "A mod is a plugin that changes how Claude Code looks and behaves… made of JavaScript or TypeScript event handlers"; can draw an interface (pane beside the transcript, band above the prompt), redraw Claude Code's own UI, step into tool calls/requests, run commands with no Claude turn, share data between hooks — [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview)
- **Release:** "Added Claude Mods: plugins may now modify deeper behavior" (v2.1.287, Oct 1, 2026); terminal needs v2.1.287+, Desktop's bundled Claude Code v2.1.286+ — [Changelog](https://code.claude.com/docs/en/changelog), [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview#turn-mods-on-or-off)
- **Where mods run:** terminal (hooks+drawing), Desktop Code tab (hooks+drawing, except terminal-only elements), Desktop WSL session (neither), VS Code chat (hooks only), `-p`/SDK (hooks only), Remote Control (in the local terminal), cloud sessions (hooks only, for plugins that reach them) — [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview#where-mods-run)
- **Security:** mods run with your permissions, aren't sandboxed, can see every prompt/tool call, approve tool calls, send messages to other sessions, and "spend your usage"; can't change what a permission prompt shows; `claude plugin validate` lists hooks and calls before install — [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview#decide-whether-to-trust-a-mod)
- **Turn off:** disable in `/plugin`, `--safe-mode`, or `"disableAllHooks": true` — [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview#turn-mods-on-or-off)
- **Events:** tools (`tool.call`, `tool.check`), prompts (`prompt.submit`, `prompt.autocomplete`, `prompt.compose`, `prompt.section`…), commands (`command.run`), config (`config.set`), turns (`turn.start`, `turn.step` — can set `model`/`effort` per request, `turn.complete`), session (`session.start/end/compact/receive/send/append/measure`), subagents (`agent.offer`, `agent.spawn` — choose model or deny; `e.isTeammate`), interface (`ui.render`, …) — [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference#events)
- **session.measure:** fires "After each turn, and when a plan limit's percent used changes" — [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference#events)
- **API namespaces:** `$.ui` (open/close panes, toast, status, log, notice, ask…), `$.command` (register/run/list), `$.tool` (register…; `isDeferred: false` v2.1.293), `$.agent` (register/spawn/list; `list()` statuses `pending|running|waiting|idle|completed|failed|killed`, idle/waiting v2.1.289+), `$.model` (complete/fork/classify), `$.prompt` (submit…), `$.turn.abort`, `$.session` (messages, cwd, model, id, usage, compact, send…; `usage()` returns `{ startedAt, context{tokens,window,percent}, rateLimits[{kind,percentUsed,resetsAt}], cost }`), `$.config` (list/set), `$.settings.read`, `$.env`, `$.fs`, `$.store` ("A key-value store that every session on the machine shares"), `$.state`, `$.clock`, `$.http`, `$.process`, `$.mcp`, `$.audio` (play/speak) — [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference#mods-api-methods)
- **Model calls cost:** `$.model.complete` and `$.model.fork` "use the session's credentials, so they bill to the user's plan"; `maxTokens` default 1024; prompt caching via `{ text, cache: true }` blocks (v2.1.292+; 5-min TTL unless `subagentPromptCacheTtl: 1h`) — [Mods API](https://code.claude.com/docs/en/plugins/mods/api#call-a-model), [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference#limits)
- **Background work without turns:** `$.clock.every/after`; `$.ui.status/toast/log` show info without starting a turn; `$.prompt.submit({text})` starts a turn when idle (labelled as from the mod unless `asUser: true`) — [Mods API](https://code.claude.com/docs/en/plugins/mods/api#run-work-in-the-background)
- **Messaging:** `$.session.send({ to, text })` → `{ isDelivered }`; `session.receive` can return `{ consumed: reason }` to keep a message from Claude — [Mods API](https://code.claude.com/docs/en/plugins/mods/api#send-and-receive-messages-between-sessions)
- **Limits:** hook execution 10 s; `$.process.run` 30 s default (10 min max); `$.store` 4 MiB JSON total; `$.fs` 4 MiB/file; redraws throttled 10/s (30 in terminal); pane auto-placement needs ≥144 terminal columns; names ≤64 chars — [Mods reference](https://code.claude.com/docs/en/plugins/mods/reference#limits)
- **Desktop rendering differences:** `Pane`, `AbovePrompt`, `Spinner` and transcript sites work in both; `Svg` element is **Desktop-only**; Desktop has no `Raster`; `Link` restrictions in Desktop; `Client` element for animation/pointer input (Terminal+Desktop) — [Mods interface](https://code.claude.com/docs/en/plugins/mods/interface)
- **Tooling:** `/plugin-authoring` skill (Claude writes mods, v2.1.287); `claude plugin validate`, `claude plugin test`, `claude plugin eval` (Week 37), `claude plugin details` (context cost) — [Commands](https://code.claude.com/docs/en/commands), [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview), [What's new](https://code.claude.com/docs/en/whats-new/index), [Measure plugin cost](https://code.claude.com/docs/en/plugins/measure)
- **Samples & built-ins:** `token-weather` (context forecast above the prompt), `blast-radius`, `replay-theater`; built-in `cc-plugin-you-should-know` (a side agent that flags things you might miss; enable with `/plugin enable cc-plugin-you-should-know@builtin`); `/diff` is itself a mod — [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview#mods-built-into-claude-code), [Changelog](https://code.claude.com/docs/en/changelog)
- **Context tax:** "Every session where a plugin is enabled includes the names and descriptions of its skills, agents, and commands in Claude's context" — [Measure plugin cost](https://code.claude.com/docs/en/plugins/measure)
- **Other new mod hooks:** `$.ui.notify` native notification (v2.1.295); `prompt.autocomplete` (v2.1.292); `$.ui.selection()` (v2.1.288); workflow agents in `agent.spawn` (v2.1.292) — [Changelog](https://code.claude.com/docs/en/changelog)

### Inferences
- The game can be built almost entirely on documented mod APIs:
  - **Overview of every agent:** `$.agent.list()` (in-session subagents/teammates) + `claude agents --json` via `$.process.run` (background sessions) + `session.receive/send` (messages) → one "guild roster" pane.
  - **Aging:** `$.session.usage().context.percent` refreshed on `session.measure`; `session.compact` event = "rite of passage" (can `{ skip }` to block an unwanted auto-compaction).
  - **Delegation discipline / fewer tokens:** `agent.spawn` forces freelancers to Haiku and denies spawns beyond a budget; `turn.step` lowers effort for routine steps; `prompt.submit` can append a "delegate verbose work" reminder.
  - **Guild messaging on request:** `$.session.send` behind an explicit button; `session.receive` consumes unsolicited envoys.
  - **Mega Brain:** `$.store` (shared by all sessions on the machine, 4 MiB) as the graph database; draw it with the Desktop-only `Svg` element (fall back to text in the terminal).
  - **Control Claude features from the game:** `$.config.set` for `/config` rows, `$.command.run` for commands, `$.prompt.submit` to start turns (e.g. `/compact …` typed as user?), `$.session.compact`.
  - **NPC flavor text:** generate with `$.model.complete({model:'haiku', maxTokens: 60, prompt:[{text: LORE, cache:true}, {text: event}]})` sparingly — every call spends the user's plan.
- Keep the mod's own registered commands/skills few and short-described, and register tools as deferred, to minimize the per-session context tax.

### Gaps
- Exact semantics of `$.command.run` for built-in commands (e.g. can it run `/compact` or `/effort`?), `$.config.set` coverage in the Desktop app, and `$.session.compact` arguments are not documented in the pages read ("the types for your build" are the authority).
- Whether mod-registered commands' descriptions count toward Claude's context like skill descriptions is not stated.

---

## Q14. What changed from mid-2026 to October 2026 that should change how the user works? (dated timeline)

### Takeaway
The big shifts: Sonnet 5 → Opus 5 → **Opus 5.5 as default (Sep 22)**, Sonnet 5.5 (Sep 28), Haiku 5.5 (Oct 7), Fable 5.1 (Aug 31–Sep 4); auto mode as default with free classifier on Pro (Aug 14 / v2.1.283); background-by-default subagents and fork mode; agent view; dynamic workflows/ultracode; cross-session messaging (Aug, Windows from v2.1.234); auto-continue at usage limits; Projects beta; and **Claude Mods (Oct 1)**.

### Cited Findings
- **Week 27 (Jun 29–Jul 3):** Sonnet 5 default for Pro; Claude in Chrome GA; subagents run in background by default; Desktop on Linux beta — [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Week 28 (Jul 6–10):** Desktop in-app browser; `/doctor` checkup (`/checkup`) — [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Week 29 (Jul 13–17):** artifacts call MCP connectors; screen reader mode; `/fork` to background session — [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Week 30 (Jul 20–24):** Opus 5 default Opus (1M, fast mode $10/$50); Desktop iOS Simulator pane; Claude Security plugin; `/code-review` as background subagent — [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Week 31:** no digest published (404 at retrieval) — gap.
- **Week 32 (Aug 3–7, v2.1.220–224):** cross-session messaging (macOS/Linux); self-hosted environments (Team/Enterprise); auto mode default for Pro/Max/Team from Aug 14 and classifier calls no longer count toward limits; Ultraplan removed; 200-subagent cap removed — [Week 32](https://code.claude.com/docs/en/whats-new/2026-w32)
- **Week 33 (Aug 10–14):** Desktop auto-continue after a usage limit; fork mode on by default; `@` mentions other sessions — [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Week 34 (Aug 17–21):** `/design`; Concise output style; RC device cards; `ANTHROPIC_DEFAULT_MODEL` — [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Week 35 (Aug 24–28):** Desktop `/resume` of CLI sessions; Claude-drafted feedback; `--restricted`; `modelPicker` — [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Week 36 (Aug 31–Sep 4):** Fable 5.1; Desktop computer use in background (macOS, Pro/Max); live `/diff` panel; `/skill-doctor` — [Week 36](https://code.claude.com/docs/en/whats-new/2026-w36)
- **Week 37 (Sep 7–11, v2.1.263–269):** `claude plugin eval`; Desktop panes pop out; `maxEffortLevel`; WebFetch 5-min timeout — [What's new](https://code.claude.com/docs/en/whats-new/index)
- **Changelog Sep 12 → Oct 9:** fast mode in cloud sessions + `omitClaudeMd` (2.1.271, Sep 14); RC fork from app (2.1.273); send-now key `Ctrl+Enter`, claude.ai skills/plugins sync to terminal (2.1.275, Sep 17); AGENTS.md read when no CLAUDE.md (2.1.277, Sep 18); **Opus 5.5 default** (2.1.280, Sep 22); `/insights` auto-mode estimate, web fast-mode switch (2.1.281); `/doctor prompt-audit` and auto mode as built-in default for all plans (2.1.283, Sep 25); **Sonnet 5.5**, `/rate-limit-options` in `/help`, `/mcp reconnect all` (2.1.284, Sep 28); `claude --desktop` (2.1.285, Sep 29); **Claude Mods** + "You should know" (2.1.287, Oct 1); `Up` restores a Ctrl+C-cleared prompt, `/code-review --max-findings`, agents-view `Ctrl+F` (2.1.288, Oct 2); `agent.spawn` for teammates (2.1.289, Oct 3); `claude attach/logs` by name (2.1.290, Oct 5); Agent tool `effort` param, mod prompt caching (2.1.292, Oct 6); **Haiku 5.5** (2.1.293, Oct 7); hooks `onFailure: "block"`, OSC 7501 status, `$.ui.notify` (2.1.295, Oct 8); per-subagent `autoCompactWindow`, `CLAUDE_CODE_WORKFLOW_SUBAGENT_MODEL`, Read `allow_large`, Sonnet 5.5 cache reads $0.10 (2.1.296, Oct 9) — [Changelog](https://code.claude.com/docs/en/changelog), [Permission modes](https://code.claude.com/docs/en/permission-modes)

### Inferences
- The default-model change to Opus 5.5 (Sep 22) is the most consequential silent change for a Pro user who "frequently hits the weekly limit": anyone who never ran `/model` moved from Sonnet 5 to Opus 5.5 (2x Sonnet 5.5's list price), so explicitly selecting `sonnet` or `haiku` per role is now important.
- Haiku 5.5 (Oct 7) with 1M context, effort levels and auto-mode support makes it a viable default for freelancer/NPC subagents.
- Mods (Oct 1) make the user's game architecture officially supported; the user should target Claude Code ≥ v2.1.296 for per-subagent `autoCompactWindow`.

### Gaps
- No digests after Week 37 and none for Week 31; mid-Sep→Oct highlights are inferred from changelog "Added" entries only.

---

## Q15. Cross-cutting caveats for this user: Windows + Claude Pro + Desktop app (local sessions) + occasional cloud sessions

### Takeaway
Most features work on native Windows, but several have specific limits: Monitor needs Git Bash; agent-team split panes don't work in Windows Terminal; agent teams aren't in Desktop at all; `Shift+Tab`, `/config key=value` and terminal-panel commands don't work in the Desktop Code tab; WSL sessions can't load mods or talk to native-Windows sessions; cross-session messaging needs v2.1.234+ on Windows; CLI computer use is macOS-only (Desktop computer use works on Windows); `/desktop` needs x64 Windows. On Pro: fast mode and possibly Fable bill usage credits; `--bare`/Agent SDK products need API keys; Projects and parallel sessions drain limits quickly.

### Cited Findings
- Monitor tool on Windows only with Git Bash — [Tools reference](https://code.claude.com/docs/en/tools-reference#monitor-tool)
- Split-pane teammates unsupported in Windows Terminal/VS Code terminal/Ghostty — [Agent teams](https://code.claude.com/docs/en/agent-teams#limitations)
- Agent teams not in Desktop; `Shift+Tab` doesn't cycle modes in Desktop; `/config` ignores `key=value` in Desktop; terminal-panel commands like `/permissions` unavailable — [Desktop](https://code.claude.com/docs/en/desktop#whats-not-available-in-desktop)
- WSL sessions: plugins/mods unavailable; WSL↔native Windows sessions can't message each other; Chrome integration not in WSL — [Mods overview](https://code.claude.com/docs/en/plugins/mods/overview#where-mods-run), [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging), [Chrome](https://code.claude.com/docs/en/chrome)
- Cross-session messaging native Windows v2.1.234+, named pipe + auth token for scripts; Desktop sessions can't show the hold-approval dialog — [Cross-session messaging](https://code.claude.com/docs/en/cross-session-messaging)
- Computer use: Desktop on macOS and Windows (Pro/Max), CLI macOS only; background mode macOS only — [Desktop](https://code.claude.com/docs/en/desktop#let-claude-use-your-computer), [Computer use](https://code.claude.com/docs/en/computer-use)
- `/desktop` requires macOS or x64 Windows and a subscription — [Commands](https://code.claude.com/docs/en/commands)
- Windows shortcuts: `Alt+P` model, `Alt+T` thinking, `Alt+O` fast mode, `Alt+V` paste image, `Alt+M` mode cycle fallback — [Interactive mode](https://code.claude.com/docs/en/interactive-mode)
- Status-line commands run through Git Bash if installed, else PowerShell; use forward slashes in paths — [Status line](https://code.claude.com/docs/en/statusline#windows-configuration)
- Pro features included: cloud sessions, routines, Remote Control, channels, computer use, Dispatch, artifacts; not Code Review — [Feature availability](https://code.claude.com/docs/en/feature-availability#availability-by-subscription-plan)
- Pro paid extras: fast mode via usage credits only; Fable may bill usage credits; Opus/Sonnet 4.6 `[1m]` variants need usage credits on Pro; ultrareview after 3 free runs — [Fast mode](https://code.claude.com/docs/en/fast-mode), [Model configuration](https://code.claude.com/docs/en/model-config#extended-context), [Commands](https://code.claude.com/docs/en/commands)
- Dynamic workflows must be turned on in `/config` on Pro — [Workflows](https://code.claude.com/docs/en/workflows)
- `--bare` doesn't use the subscription login; Agent-SDK third-party products must use API keys; an `ANTHROPIC_API_KEY` in the environment overrides the Pro login and bills the API — [Headless](https://code.claude.com/docs/en/headless#start-faster-with-bare-mode), [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview), [Support](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)
- Parallelism multiplies quota (agent view ~Nx; Projects "reach your limit sooner" on Pro) — [Agent view](https://code.claude.com/docs/en/agent-view#limitations), [Projects](https://code.claude.com/docs/en/claude-projects#usage-and-cost)

### Inferences
- Recommended baseline for this user (proposal): native-Windows Desktop local sessions with Git for Windows installed (unlocks Monitor), Claude Code ≥ v2.1.296, auto mode, `sonnet` for leaders and `haiku` for freelancers, `/autocompact` ~200–300K, Task tools explicitly enabled for the quest board, `crossSessionInbound: hold` on guild sessions, Concise output style, and no fast mode/Fable without explicit opt-in.

### Gaps
- No official Windows-specific note on agent view performance or Desktop pane pop-outs for mods.
