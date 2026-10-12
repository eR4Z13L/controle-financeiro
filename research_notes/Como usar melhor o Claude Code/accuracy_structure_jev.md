# Accuracy, structuring-before-execution, and the "jev" method (Claude / Claude Code) — research notes as of 2026-10-12

Legend for the report writer. Tags: **[OFFICIAL]** = Anthropic docs or engineering blog. **[COMMUNITY]** = practitioner opinion. **[RESEARCH]** = papers. **[VENDOR]** = claims by the company selling the product. **(fetched)** = I read the page in full on 2026-10-12. **(search-summary)** = this environment's egress proxy blocked the page (only anthropic.com, platform.claude.com, code.claude.com and github.com were reachable; arxiv.org, substack, zapier, typesafe.ai, infoq etc. were denied by policy), so the claim comes from the search engine's summary of that page: treat it as "reported", and verify exact numbers before quoting them as fact.

---

## Q1. What do Anthropic's official best practices recommend (Claude Code + prompt engineering)?

### Takeaway
Anthropic's current Claude Code guide is built around one constraint ("Claude's context window fills up fast, and performance degrades as it fills") and two habits: (1) give Claude a check it can run (tests, build, screenshot, expected output) and ask for evidence, and (2) separate exploring and planning from implementation (Explore → Plan → Implement → Commit, using plan mode). For larger features, have Claude interview you with AskUserQuestion, write SPEC.md, then implement it in a fresh session. The prompting docs add more: be clear and direct, explain why, give 3–5 examples in XML tags, allow "I don't know", ground answers in quotes, and use "Never speculate about code you have not opened."

### Cited Findings

**Claude Code "Best practices" page [OFFICIAL] (fetched 2026-10-12)**
- The old engineering post URL now permanently redirects (HTTP 308) to the docs page. In practice the docs page is the current version of "Claude Code best practices" — [anthropic.com/engineering/claude-code-best-practices](https://www.anthropic.com/engineering/claude-code-best-practices) → [code.claude.com/docs/en/best-practices](https://code.claude.com/docs/en/best-practices)
- Core constraint (verbatim): "Most best practices are based on one constraint: Claude's context window fills up fast, and performance degrades as it fills." … "When the context window is getting full, Claude may start 'forgetting' earlier instructions or making more mistakes. The context window is the most important resource to manage." — [Best practices](https://code.claude.com/docs/en/best-practices)
- Verification (verbatim): "Give Claude a check it can run: tests, a build, a screenshot to compare. It's the difference between a session you watch and one you walk away from." / "Claude stops when the work looks done. Without a check it can run, 'looks done' is the only signal available, and you become the verification loop." — [Best practices](https://code.claude.com/docs/en/best-practices)
- Before/after prompt examples (verbatim):
  - "write a validateEmail function. example test cases: user@example.com is true, invalid is false, user@.com is false. run the tests after implementing"
  - "[paste screenshot] implement this design. take a screenshot of the result and compare it to the original. list differences and fix them"
  - "the build fails with this error: [paste error]. fix it and verify the build succeeds. address the root cause, don't suppress the error"
  
  — [Best practices](https://code.claude.com/docs/en/best-practices)
- Four ways to gate the stop, from weakest to strongest: in one prompt; across a session with a `/goal` condition ("A separate evaluator re-checks it after every turn"); a deterministic Stop hook that "blocks the turn from ending until it passes"; and a second opinion from a verification subagent or dynamic workflow, which "has a fresh model try to refute the result, so the agent doing the work isn't the one grading it." — [Best practices](https://code.claude.com/docs/en/best-practices)
- "Have Claude show evidence rather than asserting success: the test output, the command it ran and what it returned, or a screenshot of the result." Also: run `/verify` yourself after Claude's check passes. — [Best practices](https://code.claude.com/docs/en/best-practices)
- Explore → Plan → Implement → Commit uses plan mode. Enter it with Shift+Tab until "⏸ plan mode on", or start with `claude --permission-mode plan`. `Ctrl+G` opens the plan in your editor. Example prompts (verbatim): "read /src/auth and understand how we handle sessions and login. also look at how we manage environment variables for secrets." / "I want to add Google OAuth. What files need to change? What's the session flow? Create a plan." / "implement the OAuth flow from your plan. write tests for the callback handler, run the test suite and fix any failures." / "commit with a descriptive message and open a PR" — [Best practices](https://code.claude.com/docs/en/best-practices)
- Plan mode has a cost: "Plan mode is useful, but also adds overhead… Planning is most useful when you're uncertain about the approach, when the change modifies multiple files, or when you're unfamiliar with the code being modified. If you could describe the diff in one sentence, skip the plan." — [Best practices](https://code.claude.com/docs/en/best-practices)
- Be specific: scope the task (e.g., "write a test for foo.py covering the edge case where the user is logged out. avoid mocks."), point to sources, reference existing patterns, and describe the symptom, the likely location and what "fixed" looks like (e.g., "write a failing test that reproduces the issue, then fix it"). — [Best practices](https://code.claude.com/docs/en/best-practices)
- Interview prompt (verbatim): "I want to build [brief description]. Interview me in detail using the AskUserQuestion tool. Ask about technical implementation, UI/UX, edge cases, concerns, and tradeoffs. Don't ask obvious questions, dig into the hard parts I might not have considered. Keep interviewing until we've covered everything, then write a complete spec to SPEC.md." Then "start a fresh session to execute it. The new session has clean context focused entirely on implementation." — [Best practices](https://code.claude.com/docs/en/best-practices)
- Spec quality (verbatim): "The most useful specs are self-contained: they name the files and interfaces involved, state what is out of scope, and end with an end-to-end verification step that proves the feature works. Time spent making the spec precise pays off more than time spent watching the implementation." — [Best practices](https://code.claude.com/docs/en/best-practices)
- CLAUDE.md: keep it short. For each line ask "Would removing this cause Claude to make mistakes?" "Bloated CLAUDE.md files cause Claude to ignore your actual instructions!" Use "IMPORTANT" on a single line only. `/doctor` proposes cuts. Put domain knowledge that is only sometimes relevant into skills. — [Best practices](https://code.claude.com/docs/en/best-practices)
- Hooks compared with CLAUDE.md (verbatim): "Unlike CLAUDE.md instructions which are advisory, hooks are deterministic and guarantee the action happens." — [Best practices](https://code.claude.com/docs/en/best-practices)
- Course-correct early: Esc; Esc+Esc or `/rewind`; "Undo that"; `/clear`. "If you've corrected Claude more than twice on the same issue in one session, the context is cluttered with failed approaches. Run /clear and start fresh with a more specific prompt…" "A clean session with a better prompt almost always outperforms a long session with accumulated corrections." — [Best practices](https://code.claude.com/docs/en/best-practices)
- Context management: `/clear` between tasks; `/compact <instructions>`; "Summarize from here / up to here" in the rewind menu; compaction instructions in CLAUDE.md; `/btw` for side questions whose answers "never enter conversation history". — [Best practices](https://code.claude.com/docs/en/best-practices)
- Subagents for investigation (verbatim): "Use subagents to investigate how our authentication system handles token refresh, and whether we have any existing OAuth utilities I should reuse." — [Best practices](https://code.claude.com/docs/en/best-practices)
- Writer/Reviewer pattern across two sessions: "A fresh context improves code review since Claude won't be biased toward code it just wrote." Also: "have one Claude write tests, then another write code to pass them." — [Best practices](https://code.claude.com/docs/en/best-practices)
- Adversarial review step (verbatim prompt): "Use a subagent to review the rate limiter diff against PLAN.md. Check that every requirement is implemented, the listed edge cases have tests, and nothing outside the task's scope changed. Report gaps, not style preferences." Caveat: "A reviewer prompted to find gaps will usually report some, even when the work is sound… Chasing every finding leads to over-engineering… Tell the reviewer to flag only gaps that affect correctness or the stated requirements." The bundled `/code-review` skill reviews the diff in a fresh subagent. — [Best practices](https://code.claude.com/docs/en/best-practices)
- Named failure patterns: the kitchen-sink session; correcting over and over; the over-specified CLAUDE.md; the trust-then-verify gap ("If you can't verify it, don't ship it."); and infinite exploration. — [Best practices](https://code.claude.com/docs/en/best-practices)
- Effort and thinking: effort levels run from `low` to `max`. `high` is recommended for "Work where verification matters or edge cases are likely, such as fixing a bug in an existing codebase". `max` "may show diminishing returns and is prone to overthinking". Adding "ultrathink" to a prompt "requests deeper reasoning for that turn only". — [Model config](https://code.claude.com/docs/en/model-config)

**Prompt-engineering docs [OFFICIAL] (fetched; the page lists current models incl. Opus 5.5, Sonnet 5.5, Haiku 5.5, Fable 5.1)**
- "Think of Claude as a brilliant but new employee who lacks context on your norms and workflows." **Golden rule:** "Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they'd be confused, Claude will be too." — [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- Add context and motivation. The page's example: instead of "NEVER use ellipses", explain that a text-to-speech engine will read the response aloud. — [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- Examples: "Include 3–5 examples for best results", wrapped in `<example>` / `<examples>`. XML tags (`<instructions>`, `<context>`, `<input>`) "reduces misinterpretation". Put long documents at the top, above the query. — [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- Anti-hallucination snippet for agentic coding (verbatim): "`<investigate_before_answering>` Never speculate about code you have not opened. If the user references a specific file, you MUST read the file before answering. Make sure to investigate and read relevant files BEFORE answering questions about the codebase. Never make any claims about code before investigating unless you are certain of the correct answer - give grounded and hallucination-free answers. `</investigate_before_answering>`" — [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- Anti test-gaming snippet (excerpt, verbatim): "Do not hard-code values or create solutions that only work for specific test inputs… Tests are there to verify correctness, not to define the solution… If the task is unreasonable or infeasible, or if any of the tests are incorrect, please inform me rather than working around them." — [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- Long-horizon work: create tests before starting and track them in a structured file (`tests.json`). Remind Claude: "It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality." Use `init.sh`. When starting fresh rather than compacting: "Review progress.txt, tests.json, and the git logs." — [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- Research prompt (verbatim): "Search for this information in a structured way. As you gather data, develop several competing hypotheses. Track your confidence levels in your progress notes to improve calibration. Regularly self-critique your approach and plan. Update a hypothesis tree or research notes file to persist information and provide transparency." — [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- Over-engineering prompt (opening, verbatim): "Avoid over-engineering. Only make changes that are directly requested or clearly necessary. Keep solutions simple and focused…". Self-correction chain: "generate a draft → have Claude review it against criteria → have Claude refine based on the review". — [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- "Reduce hallucinations" page:
  - Allow "I don't know" ("This simple technique can drastically reduce false information"). Example clause: "If you're unsure about any aspect or if the report lacks necessary information, say 'I don't have enough information to confidently assess this.'"
  - For documents over 20k tokens, extract word-for-word quotes first. If none are relevant, state "No relevant quotes found."
  - Verify with citations: "If it can't find a quote, it must retract the claim". The press-release example says to remove an unsupported claim and "mark where it was removed with empty [] brackets".
  - Advanced techniques: chain-of-thought verification, best-of-N verification ("Inconsistencies across outputs could indicate hallucinations"), iterative refinement, and external knowledge restriction.
  - Limit: these techniques "don't eliminate them entirely".
  
  — [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)

**"Effective context engineering for AI agents" [OFFICIAL] (Sept 29, 2025; fetched)**
- Context rot: as the token count grows, "the model's ability to accurately recall information from that context decreases". The effect is a gradient, not a cliff. LLMs have an "attention budget", and n tokens create n² pairwise relationships. — [Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- Guiding principle: "the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome." Other guidance in the post:
  - "right altitude" system prompts
  - "diverse, canonical examples"
  - just-in-time retrieval
  - compaction
  - structured note-taking (NOTES.md, to-do lists)
  - sub-agents that return condensed summaries, "often 1,000-2,000 tokens"
  
  — [Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)

### Inferences
- The official guidance points to three levers against "inventing": (1) precision before action (interview, spec, plan), (2) external, checkable signals (tests, evidence, hooks), and (3) a small, clean context. These map onto the user's guild design: the leader agent should orchestrate and keep its own context lean, and delegate exploration and review to fixed subagents or freelancers.
- A suggested PT-BR adaptation of the official interview prompt (my translation): "Quero construir [descrição curta]. Me entreviste em detalhe usando a ferramenta AskUserQuestion. Pergunte sobre implementação técnica, UI/UX, casos de borda, preocupações e trade-offs. Não pergunte o óbvio; aprofunde nas partes difíceis que eu talvez não tenha considerado. Continue até cobrir tudo e então escreva uma especificação completa em SPEC.md."

### Gaps
- I did not re-verify the original publication date of the old engineering post (it now redirects).
- I did not verify whether the CLI status line and hooks behave identically inside the Claude desktop app on Windows.

---

## Q2. Structuring the idea before building: interview, spec/PRD, acceptance criteria / definition of done, plan mode, Research→Plan→Implement, small verifiable steps, TDD

### Takeaway
The best-supported pattern is "clarify → write it down → execute in a fresh context → verify":
1. Claude interviews you (AskUserQuestion).
2. It writes a self-contained SPEC.md (files and interfaces, out of scope, an end-to-end verification step).
3. You review a plan (plan mode, or HumanLayer's research → plan → implement).
4. A clean session implements it in small, test-gated phases.

Research on underspecified coding tasks and on multi-turn degradation supports front-loading clarification and then restarting clean.

### Cited Findings
- [OFFICIAL] Interview → SPEC.md → fresh session, and the spec content rules (files and interfaces, out of scope, E2E verification step). See Q1. — [Best practices](https://code.claude.com/docs/en/best-practices)
- [OFFICIAL] `/goal` use cases include "Implementing a design doc until all acceptance criteria hold". A good condition has:
  - "One measurable end state"
  - "A stated check" (e.g., "`npm test` exits 0")
  - "Constraints that matter" (e.g., "no other test file is modified")
  
  Conditions can be up to 4,000 characters. You can bound a run with a clause such as "or stop after 20 turns". Example: `/goal all tests in test/auth pass and the lint step is clean`. — [/goal docs](https://code.claude.com/docs/en/goal)
- [COMMUNITY — HumanLayer, "Advanced Context Engineering for Coding Agents" (ACE-FCA); no visible date, internal references suggest ~Aug–Sep 2025; first-person author appears to be Dex Horthy; fetched]
  - "Frequent intentional compaction" means "deliberately structuring how you feed context to the AI throughout the development process".
  - Workflow: **Research** (output: a compacted research doc) → **Plan** (output: a short implementation plan with exact steps, the files to edit and how, and testing and verification for each phase; "200 lines of a well-written implementation plan" is reviewable) → **Implement** (phase by phase, compacting status back into the plan after each verified phase).
  
  — [HumanLayer ACE-FCA](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md)
- [COMMUNITY — HumanLayer] Leverage hierarchy: a bad line of plan "could lead to hundreds of bad lines of code", and a bad line of research "thousands of bad lines of code". "When you review the research and the plans, you get more leverage than you do when you review the code." Context problems ranked from worst: incorrect information, then missing information, then too much noise. — [HumanLayer ACE-FCA](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md)
- [COMMUNITY — HumanLayer] Reported results:
  - BAML (300k LOC Rust): a bug-fix PR in about 1 hour, approved by the maintainer the next morning.
  - About 35k LOC (cancellation + WASM support) in about 7 hours: roughly 3h of research and plans, 4h of implementation.
  - Their team averaged about $12k/month on Opus (3 people).
  - Acknowledged failures: removing Hadoop from parquet-java "did not go well", and a race-condition hunt took two weeks.
  
  — [HumanLayer ACE-FCA](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md)
- [COMMUNITY — GitHub Spec Kit (fetched)]
  - Spec-Driven Development: "Define what and why before deciding how to build it."
  - Commands: `/speckit-constitution` (once per project: principles), then per feature `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement` → `/speckit-converge` (repeat until it reports "Converged").
  - Clarification, checklists and consistency analysis are available as extra quality gates.
  - Install: `uv tool install specify-cli`, then `specify init my-project --integration copilot` (the integration key is swappable).
  
  — [github/spec-kit](https://github.com/github/spec-kit)
- [OFFICIAL] Small verifiable steps: "Test incrementally: Write one file, test it, then continue. This catches issues early." "Use plan mode for complex tasks… preventing expensive re-work when the initial direction is wrong." — [Costs docs](https://code.claude.com/docs/en/costs)
- [OFFICIAL] TDD-friendly guidance: create tests first and track them in `tests.json`; "It is unacceptable to remove or edit tests…"; use the anti-hard-coding prompt — [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices). Writer/tester split: "have one Claude write tests, then another write code to pass them." — [Best practices](https://code.claude.com/docs/en/best-practices)
- [COMMUNITY — Kent Beck] TDD is a "superpower" with AI agents, but he has trouble stopping agents from deleting or editing tests to make them "pass". He keeps a large, fast suite (about 300 ms) so the "genie" gets caught. He also found he "couldn't just say 'be me'; I had to tell it what I would do", i.e., explicit design constraints. (search-summary) — [Pragmatic Engineer interview](https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent); [Taming the Genie (Kent Beck)](https://newsletter.kentbeck.com/p/taming-the-genie-like-kent-beck)
- [RESEARCH] Laban et al., "LLMs Get Lost In Multi-Turn Conversation" (arXiv May 2025; ICLR 2026 oral). (search-summary)
  - Average 39% performance drop for multi-turn vs single-turn conversations across six generation tasks: roughly −15% aptitude and +112% unreliability.
  - "LLMs often make assumptions in early turns and prematurely attempt to generate final solutions, on which they overly rely… when a wrong turn is taken, the models get lost and do not recover."
  
  — [arXiv 2505.06120](https://arxiv.org/abs/2505.06120); [ICLR 2026 oral](https://iclr.cc/virtual/2026/oral/10009147)
- [RESEARCH] Ambig-SWE (arXiv 2502.13069). (search-summary)
  - Interactivity "can boost performance on underspecified inputs by up to 74%" over non-interactive settings.
  - LLMs "default to non-interactive behavior without explicit encouragement" and struggle to tell underspecified from well-specified inputs.
  - Claude Sonnet 4 (89%) and Claude Sonnet 3.5 (84%) were the only evaluated models with notable accuracy at that distinction.
  
  — [arXiv 2502.13069](https://arxiv.org/abs/2502.13069)
- [RESEARCH] "Ask or Assume? Uncertainty-Aware Clarification-Seeking in Coding Agents" (arXiv 2603.26233, 2026). On an underspecified variant of SWE-bench Verified, using a Claude Sonnet 4.5 multi-agent scaffold, interactive agents retrieved the missing information and reached a resolve rate comparable to an autonomous agent given the fully specified issue. (search-summary) — [arXiv 2603.26233](https://arxiv.org/abs/2603.26233)
- [RESEARCH] "Asking What Matters" (arXiv 2604.14624, 2026). A trained clarification model (CLARITI) matched GPT-5-level performance (36.80%) while asking 41% fewer questions (3.0 vs 5.1). Fewer, better-targeted questions can work as well as more questions. (search-summary) — [arXiv 2604.14624](https://arxiv.org/pdf/2604.14624)

### Inferences
- The Laban result explains the user's complaint ("a IA inventa quando a ideia não está bem estruturada"). When requirements are drip-fed over many turns, the model makes early assumptions and then defends them. The remedy is to gather requirements in one interview, consolidate them into a single document, and implement from a fresh session, which is Anthropic's recommended flow.
- Models default to not asking (Ambig-SWE), so the interview has to be explicitly requested, or built into the game's mission start. Questions should be capped and targeted (Asking What Matters).
- A "Definition of Done / Pergaminho da Missão" template, my synthesis of the official spec guidance and the `/goal` guidance:
  - Objetivo
  - Fora de escopo
  - Arquivos/interfaces envolvidos
  - Critérios de aceite (each one verifiable)
  - Comando de verificação final (e.g., `npm test` exits 0)
  - Restrições (e.g., "não alterar arquivos de teste")
  - Suposições abertas (must be empty before starting)

### Gaps
- Most research numbers here came from search summaries because arxiv.org was blocked. Verify them before quoting exact figures.
- I found no controlled study specifically measuring TDD-with-AI. The evidence is official guidance plus practitioner reports.
- The fetched Spec Kit README did not explicitly list Claude Code among supported agents. It says the integration key is swappable and links to an integrations list I couldn't see.
- The Addy Osmani and Simon Willison write-ups on specs and agentic loops were unreachable (blocked domains), so they are not included.

---

## Q3. Anti-hallucination and verification techniques: citations, verify before claiming, reviewer agents, adversarial verification, checklists, completion-blocking hooks, low context utilization ("dumb zone")

### Takeaway
Hallucination drops most when Claude must (a) read before claiming (file paths, quotes), (b) produce evidence that a script or a fresh reviewer can check, and (c) work in a small, clean context. Claude Code offers three kinds of gate:
- deterministic gates: Stop, TaskCompleted and PreToolUse hooks with exit code 2
- model-evaluated gates: prompt and agent hooks, and `/goal`
- fresh-context reviewers: subagents and `/code-review`

The "dumb zone" heuristic from HumanLayer / Dex Horthy is to keep context use at or below about 40%; HumanLayer's written guide says 40–60%. Anthropic's docs give no fixed percentage; they say only that performance degrades as context fills.

### Cited Findings

**Grounding and citations**
- [OFFICIAL] The `investigate_before_answering` snippet, quotes first, retracting unsupported claims, and permission to say "I don't know" (see Q1). — [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices); [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)
- [OFFICIAL] "Point to sources", e.g. "look through ExecutionFactory's git history and summarize how its api came to be". "Reference files with `@`… Claude reads the file before responding." — [Best practices](https://code.claude.com/docs/en/best-practices)

**Deterministic and model-evaluated gates (hooks, /goal)**
- [OFFICIAL] The hooks reference lists about 33 events, including UserPromptSubmit, PreToolUse, PostToolUse, Stop, SubagentStop, TaskCreated, TaskCompleted, PreCompact and PostCompact. — [Hooks reference](https://code.claude.com/docs/en/hooks)
- [OFFICIAL] **Stop:** "exit 2 prevents Claude from stopping and continues the conversation". The input includes `last_assistant_message`. **TaskCompleted:** fires when a task is being marked completed; "exit 2 blocks completion and sends stderr back as feedback". **PreToolUse:** exit 2 blocks the tool call, or JSON `"permissionDecision": "deny"` with a reason; it can rewrite the arguments via `updatedInput`. The generic block example is `{"decision": "block", "reason": "Test suite must pass before proceeding"}`. — [Hooks reference](https://code.claude.com/docs/en/hooks)
- [OFFICIAL] Hook types: `type: "prompt"` sends a single-turn evaluation to a Claude model, which returns a JSON decision (default timeout 30 s). `type: "agent"` is experimental: it spawns a subagent that can use Read, Grep and Glob to verify conditions (default timeout 60 s). — [Hooks reference](https://code.claude.com/docs/en/hooks)
- [OFFICIAL] `/goal` "is a wrapper around a session-scoped prompt-based Stop hook". A small fast model returns Not yet met, Met, or Impossible after each turn. "It doesn't run commands or read files independently, so write the condition as something Claude's own output can demonstrate." Evaluation tokens are "typically negligible". It works in non-interactive mode, the desktop app, and Remote Control. — [/goal docs](https://code.claude.com/docs/en/goal)

**Second opinions and adversarial verification**
- [OFFICIAL] A verification subagent or dynamic workflow "has a fresh model try to refute the result"; the adversarial review prompt and the caveat about over-reporting gaps are in Q1. — [Best practices](https://code.claude.com/docs/en/best-practices)
- [OFFICIAL] Best-of-N verification: run the same prompt several times; disagreement signals possible hallucination. — [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)
- [OFFICIAL] Anthropic's own multi-agent research system (June 13, 2025):
  - Findings go to a separate "CitationAgent" that attributes claims to sources.
  - The LLM-as-judge rubric includes "citation accuracy (do the cited sources match the claims?)".
  - "a single LLM call with a single prompt outputting scores from 0.0-1.0" was the most consistent judge and aligned best with human judgments.
  - Human testing was still needed for edge cases.
  
  — [Multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)

**Context utilization and the "dumb zone"**
- [OFFICIAL] Performance degrades as context fills (Best practices), and context rot is a gradient, not a cliff (Context engineering). — [Best practices](https://code.claude.com/docs/en/best-practices); [Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [COMMUNITY — HumanLayer] "keeping utilization in the 40-60% range", depending on problem complexity. They quote Geoff Huntley: "The more you use the context window, the worse the outcomes you'll get." — [HumanLayer ACE-FCA](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md)
- [COMMUNITY — Dex Horthy, podcast] "we used to say the dumb zone was like 40% of your context window", which for many models was about 80–100K tokens; he adds "I think it has gotten better". Other secondary sources describe a ~40% inflection point or a 40–60% band. (search-summary) — [wordman.dev podcast](https://www.wordman.dev/podcast/dex-horthy-what-actually-gets-you-2-3x-with-ai-coding/); [Turing Post](https://www.turingpost.com/p/aisoftwarestack); [daily.dev "No Vibes Allowed" talk](https://app.daily.dev/posts/no-vibes-allowed-solving-hard-problems-in-complex-codebases-dex-horthy-humanlayer-1sk1vjeqd). A community tool draws a "smart/warm/dumb zone" context health bar for another coding agent — [arpagon/pi-context-zone](https://github.com/arpagon/pi-context-zone)
- [RESEARCH] Chroma, "Context Rot" (July 14, 2025): 18 LLMs, including Claude 4. Performance became increasingly unreliable as input length grew, with task complexity held constant. (search-summary; the specific numbers in secondary blogs are not verified) — [Chroma research](https://trychroma.com/research/context-rot)
- [OFFICIAL] Status line JSON exposes:
  - `context_window.used_percentage` and `remaining_percentage`, calculated from input tokens only
  - `context_window_size`: "200000 by default, or 1000000 for models with extended context"
  - for Pro and Max subscribers, `rate_limits.five_hour.used_percentage` and `rate_limits.seven_day.used_percentage`
  
  The docs' example script colors the bar yellow at ≥70% and red at ≥90%. — [Status line docs](https://code.claude.com/docs/en/statusline)
- [OFFICIAL] By default, auto-compaction triggers at the model's context limit; on native-1M models (e.g., Opus 4.7+, Sonnet 5+) that is about 967K tokens. You can set it by token count (100K–1M) with `/autocompact 200k`, the `autoCompactWindow` setting, `claude --autocompact 200k`, or `CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000`. — [Model config](https://code.claude.com/docs/en/model-config)
- [OFFICIAL] Each request re-sends the conversation (cached). "`/compact` reads the conversation it summarizes, so compacting a large context is itself a large request… `/clear` costs nothing." — [Costs](https://code.claude.com/docs/en/costs)

### Inferences
- The default only compacts near the full window, so the user has to impose a "dumb zone" policy themselves: watch `used_percentage` in the status line, set `/autocompact` lower, or `/clear` proactively. With 1M-token windows, absolute token counts are a better guide than percentages: 40% of 1M is 400K tokens, far beyond the ~80–100K tokens Horthy originally associated with the dumb zone.
- The 70% and 90% colors in the docs' status-line script are display examples, not quality thresholds. A stricter band for the game (green <40%, yellow 40–60%, red >60%) follows HumanLayer's heuristic and should be labeled as a heuristic.
- An illustrative TaskCompleted gate. This is my sketch built on the documented config shape, not copied from the docs:
  ```json
  { "hooks": { "TaskCompleted": [ { "hooks": [ { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/prova-do-feito.sh" } ] } ] } }
  ```
  The script runs the tests. If they fail, it prints the failing output to stderr and exits with code 2, which blocks completion and returns the output to Claude as feedback. On Windows the user needs a shell that can run it (Git Bash or WSL) or a PowerShell equivalent; I did not verify this.
- The strongest combination: a deterministic gate (tests), plus a fresh reviewer that checks requirements, plus evidence printed in the transcript (which `/goal` can then judge).

### Gaps
- I did not retrieve Horthy's original talk. The 40% figure comes from secondary summaries; the 40–60% range is from HumanLayer's own document.
- The full TaskCompleted input schema, and which events accept prompt or agent hooks, were not in the fetched excerpt.
- I did not verify the primary Chroma numbers.

---

## Q4. Do confidence/percentage prompts help? ("ask me questions until you are 95% confident", "rate your confidence 0–100%", "state assumptions")

### Takeaway
The behavior these prompts trigger is well supported by research: asking clarifying questions before acting, and surfacing assumptions. The number itself is not. LLMs state confidence that is systematically too high (one 2026 study: ~88% stated confidence vs ~79% accuracy). Calibration is better on closed questions (multiple choice, true/false) than on novel open tasks. No study validates "95%" as a meaningful stopping point. Use percentages as a nudge, not a gate; gate on evidence instead (tests, checklists, explicit lists of assumptions).

### Cited Findings
- [COMMUNITY] The viral prompt: "ask me clarifying questions until you're 95% confident before starting". It is the first of Sabrina Ramonov's "5 prompts that actually make claude code useful". (search-summary) — [Substack note](https://substack.com/@sabrinaramonov/note/c-235070151); [Threads](https://www.threads.com/@sabrina_ramonov/post/DWkjIYxjr4m/prompts-that-actually-make-claude-code-useful-ask-me-clarifying-questions-until)
- [COMMUNITY] "Before you start, ask me questions until you're 95% confident you can complete it." … "One round of clarification. Zero rewrites." (search-summary) — [Threads @theaiimpact](https://www.threads.com/@theaiimpact/post/DXN1ADtAMoU/if-claude-asked-you-three-questions-before-starting-a-task-would-you-answer)
- [COMMUNITY] A Claude tips site offers both a confidence-threshold version and a capped version (a fixed number of questions) of the "interview me first" prompt. A PromptBase listing sells a similar meta-prompt. (search-summary) — [tipsforclaude.com](https://tipsforclaude.com/tips/interview-me-first/); [PromptBase](https://promptbase.com/prompt/ask-me-questions-until-95-confident-me)
- [RESEARCH] Xiong et al., "Can LLMs Express Their Uncertainty?" (2023; ICLR 2024): when verbalizing confidence, LLMs "tend to be overconfident, potentially imitating human patterns of expressing confidence". Calibration improves with scale but remains "far from ideal". (search-summary) — [arXiv 2306.13063](https://arxiv.org/abs/2306.13063); [OpenReview](https://openreview.net/forum?id=gjeQKFxFpZ)
- [RESEARCH] One 2026 paper reports models stating about 88% confidence while being correct about 79% of the time. (search-summary; I did not verify which listed paper this figure belongs to) — [Confidence Calibration in LLMs, arXiv 2605.23909](https://arxiv.org/html/2605.23909v1)
- [RESEARCH] "Wired for Overconfidence" (2026): a compact set of MLP blocks and attention heads in middle-to-late layers writes a "confidence-inflation" signal, and intervening on them improves calibration (search-summary) — [arXiv 2604.01457](https://arxiv.org/abs/2604.01457). ADVICE (2025): overconfidence arises from neglecting answer information; it proposes a fine-tuning fix (search-summary) — [arXiv 2510.10913](https://arxiv.org/html/2510.10913v1)
- [RESEARCH] Dissent: The Prompt Report notes that the efficacy of verbalized scores "is under debate". The same search summary says other work (Tian et al.) found verbalized confidences better calibrated than the models' conditional probabilities on several benchmarks. (search-summary) — [The Prompt Report, arXiv 2406.06608](https://arxiv.org/pdf/2406.06608)
- [RESEARCH — Anthropic, July 11, 2022] "larger models are well-calibrated on diverse multiple choice and true/false questions" when the format is right. Self-evaluation, P(True), works and improves when the model considers many of its own samples. Models predict P(IK) well and partly generalize across tasks, but they "struggle with calibration of P(IK) on new tasks". — [Language Models (Mostly) Know What They Know](https://www.anthropic.com/research/language-models-mostly-know-what-they-know)
- [OFFICIAL] Anthropic's own research prompt asks Claude to "Track your confidence levels in your progress notes to improve calibration" and to keep competing hypotheses. This is confidence-tracking as self-critique, not as a numeric gate. — [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- [RESEARCH] Clarification helps: Ambig-SWE (up to +74% on underspecified inputs) and Ask-or-Assume (parity with fully specified issues). Models don't ask unless encouraged. See Q2. — [arXiv 2502.13069](https://arxiv.org/abs/2502.13069); [arXiv 2603.26233](https://arxiv.org/abs/2603.26233)
- [COMMUNITY — Portuguese-language] Portuguese guides recommend telling the AI it is fine not to know something as long as it says so, and forbidding invented data: "Não invente nomes, obras, links, números ou qualquer outro dado que não exista". They also recommend having the model ask questions before starting. No page containing the exact phrase "95% de certeza" was found. (search-summary; I did not verify which page made which claim) — [Olhar Digital, 2026-04-24](https://olhardigital.com.br/2026/04/24/inteligencia-artificial/5-prompts-para-obter-respostas-mais-inteligentes-no-claude-ia-da-anthropic/); [The Human Plus](https://thehumanplus.substack.com/p/6-alteracoes-simples-que-melhoram); [Hashtag Treinamentos](https://www.hashtagtreinamentos.com/chatgpt-ou-claude-no-code)
- [RESEARCH] Verbalized Sampling (Zhang, Sicilia, Tomz; arXiv Oct 2025; ICML 2026 poster). You ask for several responses together with their probabilities, e.g. "Generate 5 jokes about coffee and their corresponding probabilities", to counter mode collapse. The authors report 1.6–2.1× more diversity in creative writing "without sacrificing factual accuracy and safety". (search-summary) — [arXiv 2510.01171](https://arxiv.org/abs/2510.01171); [ICML 2026 poster](https://icml.cc/virtual/2026/poster/60489)

### Inferences
- My recommended replacement for "until 95% confident" asks Claude for:
  1. the assumptions it is making, each tagged high/medium/low confidence and blocking/non-blocking;
  2. questions only for blocking assumptions, at most N per round, via AskUserQuestion;
  3. a stopping rule: proceed only when every acceptance criterion in SPEC.md is testable and no blocking assumption remains.
  
  The stopping condition is a checklist, not a number.
- Example PT-BR prompt (my wording): "Antes de escrever código: liste as suposições que você está fazendo, marcando confiança (alta/média/baixa) e se é bloqueante. Para cada suposição bloqueante, me faça uma pergunta usando AskUserQuestion (no máximo 4 por rodada). Não comece enquanto houver suposição bloqueante aberta. Se não souber algo, diga 'não sei' em vez de inventar. Ao final, atualize o SPEC.md com as respostas."
- Percentages are useful where they can be checked against outcomes: closed questions, classifiers such as Jev, and LLM-judge scores tracked over time. They are weak as a stopping rule for open-ended design.
- Verbalized Sampling fits the creative side of the RPG (quest hooks, NPC dialogue options), not accuracy.

### Gaps
- I found no controlled study of the specific "95% confident" phrasing.
- I did not verify which paper the "88% vs 79%" figure comes from.

---

## Q5. Part B — What is "jev"? Candidates, evidence and confidence

### Takeaway
**Best candidate (my confidence ≈70–80%): Jev, by TypeSafe AI.** It is a "System One" decision model, released in early access on Sept 15, 2026, about four weeks before this research. Instead of text, it answers narrowly typed questions with probabilities. Portuguese coverage gives examples like "Fraude? SIM 97% / NÃO 3%" and confidence policies with 70% and 95% thresholds, used to decide whether to act, ask, or escalate. Coverage in Sept–Oct 2026 was wide, including Portuguese articles, which matches "um método de usar a IA com um negócio de porcentagem".

Second candidate (≈15–20%): the viral "ask me questions until you're 95% confident" prompt (Q4). Lower: the "dumb zone" context-percentage rule (Q3) and Verbalized Sampling (Q4).

### Cited Findings

**Candidate 1 — Jev (TypeSafe AI)**
- **Identity and release.** TypeSafe AI's first "System One" model, in early access since Sept 15, 2026. It returns typed decisions with probabilities instead of generated text. Coverage includes an InfoQ news item titled "TypeSafe AI Releases Jev: a Decision-Only Model That Returns Typed Probabilities Instead of Text". (search-summary; multiple sources agree on the date) — [InfoQ (Oct 2026)](https://www.infoq.com/news/2026/10/typesafe-ai-jev-released/); [TypeSafe blog "Introducing System One Models & Jev"](https://typesafe.ai/blog/introducing-system-one-models-and-jev); [MindStudio](https://www.mindstudio.ai/blog/jev-system-one-model-launch); [daily.dev](https://daily.dev/posts/typesafe-ai-releases-jev-a-decision-only-model-that-returns-typed-probabilities-instead-of-text-zci7cgwtw)
- **How it is used, per a third-party tool author's GitHub README** (fetched; the closest to primary I could read):
  - Jev "takes text state and returns typed answers (`choice` / `score` / `noul`) with a probability or confidence instead of prose".
  - The tools "ask narrow questions, branch on the typed answer in code, and send anything Jev is unsure about to a human or a larger model".
  - "treat answers as first-pass judgments; that is why every tool here gates on confidence".
  - Jev's 67.8% accuracy on TypeSafe's workflow evals is "agreement with other models, not verified ground truth".
  - CLI example: `--escalate 'conf<0.6'`.
  
  — [CMaintz/jev-tools](https://github.com/CMaintz/jev-tools)
- **Question types.** Choice picks from a list. Score rates the input against levels. Noul gives the probability that a statement is true. The model is non-generative: input is text or JSON plus a schema defined in code, and all fields are answered in one parallel pass. (search-summary) — [MindStudio](https://www.mindstudio.ai/blog/jev-system-one-model-launch); [TrueFoundry](https://www.truefoundry.com/blog/typesafe-ai-jev); [DataCamp](https://www.datacamp.com/blog/system-one-models-jev)
- **Training.** TypeSafe trained it with "Reinforcement Learning for Calibrated Decisions (RLCD)", which optimizes for probabilities that match outcomes, unlike chat models trained to produce answers humans prefer. (search-summary; exact attribution among these pages not verified) — [Victor Dibia explainer](https://victordibia.com/explainers/jev/); [Firecrawl](https://www.firecrawl.dev/blog/what-is-jev); [Zapier](https://zapier.com/blog/jev/)
- **Specs (vendor claims).**
  - 70–500 ms end-to-end latency; $0.042 per million input tokens; output free.
  - The homepage headline "193.6x Faster, 444.6x Cheaper" comes from TypeSafe's own workflow evals. An independent look at launch tweets reportedly found user-reported speedups at a median of about 7x.
  - Context window: one summary says 32,000 tokens and another listing says 64,000, so the sources conflict.
  
  (search-summary) — [typesafe.ai](https://typesafe.ai/); [innfactory listing](https://innfactory.ai/en/ai-models/typesafe-jev/); [qcode.cc guide](https://qcode.cc/en/system-one-model-jev-guide)
- **Limits.** It is a proprietary hosted API behind an early-access waitlist, with no published weights and no on-prem option. It produces no text output and is English-primary. It is not suited to drafting, summarising, code, or multi-step planning. (search-summary) — [qcode.cc](https://qcode.cc/en/system-one-model-jev-guide); [innfactory](https://innfactory.ai/en/ai-models/typesafe-jev/)
- **Third-party benchmarks.** (search-summary)
  - Red Hat Developer (Oct 2, 2026): 86.35% and 86.20% on two tests.
  - MotherDuck: 89% on AG News via its `prompt_jev()` SQL function.
  - One benchmark measured an expected calibration error of 0.0588 on 662 prompt-injection messages, i.e., confidence and accuracy about 6 points apart on average.
  
  — [Red Hat Developer](https://developers.redhat.com/articles/2026/10/02/benchmarking-ai-decision-models-against-traditional-guardrails); [MotherDuck blog](https://motherduck.com/blog/motherduck-supports-jev/); [MotherDuck PROMPT_JEV docs](https://motherduck.com/docs/sql-reference/motherduck-sql-reference/ai-functions/prompt-jev/)
- **The "0% hallucination" claim is misleading.** TypeSafe's chart counts schema violations, which are always zero because Jev cannot answer outside the schema. Critics note it can still return valid but confidently wrong values. (search-summary; I could not tell which of these pages made the point) — [Flavio Copes](https://flaviocopes.com/jev/); [Victor Dibia](https://victordibia.com/explainers/jev/); [Zapier](https://zapier.com/blog/jev/)
- **Portuguese coverage** (relevant for a Brazilian user). (search-summary) Examples it gives:
  - "É fraude? SIM (96%)".
  - "Fraude? SIM 97% / NÃO 3%", used in a confidence policy with 70% and 95% thresholds.
  - What calibrated confidence means: "um nível de confiança de 90% significa que ele está correto em 90% dos casos semelhantes, e não que cada resposta específica seja certa".
  - A reported test: 94.2% on OpenBookQA with near-perfect calibration, but 44.7% on an unseen prioritization task.
  
  — [Triggo.ai](https://triggo.ai/en/blog/jev-o-que-e-a-ia-da-typesafe-que-transforma-inteligencia-artificial-em-decisoes); [Templo](https://templo.pro/jev-modelo-decisao/); [El Output PT](https://pt.eloutput.com/noticias/geral/descubriendo-jev-ai-la-revolucion-de-los-modelos-de-decision/); [Meetcody PT](https://meetcody.ai/blog/typesafe-jev-ai-system-one-model/)
- **Threshold patterns** (community; the numbers disagree). (search-summary)
  - DataNorth: act automatically above 0.85; ask the user between 0.6 and 0.85; hand off to a human below 0.6; require more than 0.9 for destructive actions. — [DataNorth](https://datanorth.ai/blog/jev-what-it-is-and-why-this-new-model-matters)
  - ClawAWS (AWS workflow): human review when escalation probability is ≥0.75 or intent confidence is <0.70; an ambiguous 0.40–0.60 band falls back to an LLM. — [ClawAWS](https://clawaws.com/blog/typesafe-jev-typed-decisions-aws-agent-workflows/)
  - jev-agent.com: a Noul has no separate confidence field, so gate on its distance from 0.5. — [jev-agent.com](https://jev-agent.com/agents)
  - AgentConn: "0.9 only works as a threshold if it actually corresponds to about 90% accuracy on your own traffic". — [AgentConn](https://agentconn.com/blog/jev-typesafe-new-agent-layer-if-calibration-holds/)
- **jev-guard** (fetched): "Vets an LLM agent's tool calls through TypeSafe AI's Jev before they run — allow, block, or hold, failing safe on uncertainty." The repo was archived on Oct 1, 2026 and moved to jev-tools `packages/guard` (npm `@cmaintz/jev-guard`, with LangChain JS and Vercel AI SDK adapters). "Not a security boundary… Think second opinion, not sandbox." — [CMaintz/jev-guard](https://github.com/CMaintz/jev-guard); [CMaintz/jev-tools](https://github.com/CMaintz/jev-tools)
- **Limitation research: JevOut** (Xu et al., arXiv 2609.30243). Short, natural-looking context added to an input can redirect a correct decision to a chosen wrong answer.
  - Targeted flip rate (fetched README): Jev 61.4% of 508 initially correct decisions; OpenSourceJev 72.6%; Von 73.2%; plain Qwen 64.9%.
  - Code first released 2026-09-24; v0.2.0 on 2026-10-08; accepted as a poster at Agenthon @ NeurIPS 2026.
  - In 229 cases Jev put ≥0.7 probability on the wrong target, and annotators judged 91.6% of 250 sampled successful contexts natural. (search-summary)
  
  — [xzx34/JevOut](https://github.com/xzx34/JevOut); [arXiv 2609.30243](https://arxiv.org/abs/2609.30243); [project page](https://xzx34.github.io/jevout/)
- **Virality.** Coverage includes "Jev, TypeSafe's Decision Model: What It Is, Why It Spread" and a claim of 1,300+ real builds. (search-summary) — [CellCog](https://cellcog.ai/blog/jev-typesafe-decision-model/); [AY Automate](https://www.ayautomate.com/blog/jev-use-cases)

**Candidate 2 — the "95% confidence" clarifying-questions prompt.** Sources and evidence are in Q4 (Sabrina Ramonov, @theaiimpact, tipsforclaude.com, PromptBase).

**Candidate 3 — the context-percentage rule ("dumb zone" ~40%, or 40–60%).** Sources are in Q3 (HumanLayer ACE-FCA; Dex Horthy podcast).

**Candidate 4 — Verbalized Sampling** (asking for several answers with probabilities). Sources are in Q4.

### Inferences
- **Why Jev is the best match:**
  - the name matches exactly;
  - it literally is a way of using AI that returns percentages;
  - it launched about four weeks before the user's question and spread quickly;
  - Portuguese articles describe exactly "SIM 97% / NÃO 3%" outputs and 70%/95% threshold policies.
  
  The "95%" in those policies may be why the user connects it with the "95% confident" prompt; the two candidates may have merged in memory.
- "System One" presumably refers to Kahneman's System 1 (fast, intuitive) versus System 2 (slow, deliberate) thinking. This is my inference; the summaries I saw do not say so explicitly.
- **What Jev is NOT:** not a prompting technique for Claude, not a coding model, and not a fix for Claude inventing things in open-ended tasks. It is a complementary decision layer. The transferable "method" is:
  1. break decisions into narrow, closed questions;
  2. get a probability for each option;
  3. branch in code with thresholds (act / ask / escalate);
  4. calibrate the thresholds against your own logged outcomes;
  5. treat it as a second opinion, never as a security boundary (see jev-guard and JevOut).
- **For the user's game:** an "Oráculo da Guilda" NPC can use Jev-style routing, for example choosing which freelancer NPC to hire or flagging an action as destructive. It could call Jev's API (waitlist; English-primary, so Portuguese inputs may perform worse; my inference) or emulate the pattern with Claude using closed-form questions. Claude's verbalized percentages are not calibrated (Q4), so the emulated version should be treated as triage, with uncertain cases sent to the player.

### Gaps
- TypeSafe's own docs and blog were blocked, so the exact API, schema syntax and probability semantics are unverified. The context window figure conflicts (32K vs 64K).
- I can't confirm that the user's "jev" is TypeSafe's Jev. It is worth asking where they heard it: a video, a post, or a course.
- I found no evidence linking "GEV", "JEPA", "Jevons", "JTBD" or "EV prompting" to a percentage-based way of using AI. The general and Portuguese searches surfaced only TypeSafe's Jev. I did not run a separate search for each acronym.
- I did not verify the PRP (Product Requirement Prompt) "confidence score" pattern in this session.

---

## Q6. Consolidated playbook: what each technique is, how to apply it, why it works, token cost, source, and RPG integration

### Takeaway
Priorities for this user:
1. Interview → SPEC.md ("Pergaminho") → fresh session.
2. Plan mode, or Research → Plan → Implement, with human review of the plan.
3. Evidence: tests plus a TaskCompleted or Stop hook, or `/goal`.
4. A fresh-context reviewer (the "Conselho/Inspetor").
5. Context hygiene: keep usage at about 40–60% or less; `/clear` after two failed corrections.
6. `investigate_before_answering`, quotes, and permission to say "não sei".

Use confidence only as a qualitative triage of assumptions. Use Jev-style probability gates only where outcomes can be measured.

### Cited Findings (cost data available from sources)
- Agents use about 4× the tokens of chat, and multi-agent systems about 15×. Token usage alone explained 80% of performance variance in Anthropic's BrowseComp evaluation. The multi-agent setup beat single-agent Opus 4 by 90.2% on their research eval. — [Multi-agent research system (June 13, 2025)](https://www.anthropic.com/engineering/multi-agent-research-system)
- Agent teams use "approximately 7x more tokens than standard sessions when teammates run in plan mode". — [Costs](https://code.claude.com/docs/en/costs)
- Sub-agents return condensed summaries, "often 1,000-2,000 tokens". — [Context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- A preprocessing hook can reduce context "from tens of thousands of tokens to hundreds" (e.g., grepping errors out of a 10,000-line log). Keep CLAUDE.md "under 200 lines". — [Costs](https://code.claude.com/docs/en/costs)
- Enterprise average: about $13 per developer per active day and $150–250 per month; below $30 per active day for 90% of users. — [Costs](https://code.claude.com/docs/en/costs)
- Thinking tokens are billed as output, and the default budget "can be tens of thousands of tokens per request". Lower effort with `/effort`. — [Costs](https://code.claude.com/docs/en/costs); [Model config](https://code.claude.com/docs/en/model-config)
- `/goal` evaluator tokens are "typically negligible". — [/goal](https://code.claude.com/docs/en/goal)
- `/compact` is itself a large request; `/clear` costs nothing. `/insights` writes an HTML report on friction points such as "misunderstood requests or buggy code". — [Costs](https://code.claude.com/docs/en/costs)
- Pro and Max: the status line exposes 5-hour and 7-day usage percentages. — [Status line](https://code.claude.com/docs/en/statusline)
- Jev: $0.042 per million input tokens, output free (vendor claim; early access). — see Q5

### Inferences
Playbook table. It synthesizes the sources above. Token costs are relative (Baixo / Médio / Alto) where no source quantifies them, and those ratings are my estimates. The RPG integrations are my design suggestions.

| # | Técnica | Como aplicar (exemplo) | Por que funciona | Custo de tokens | Fonte | Integração no RPG (guilda) |
|---|---|---|---|---|---|---|
| 1 | Entrevista → SPEC.md → sessão nova | Prompt oficial com AskUserQuestion → SPEC.md (Objetivo, Fora de escopo, Arquivos/interfaces, Critérios de aceite, Verificação E2E) → `/clear` ou nova sessão | Remove ambiguidade antes de agir; evita suposições precoces (Laban, −39% em multi-turn); interatividade ajuda até +74% em tarefas subespecificadas (Ambig-SWE) | Médio no início (rodadas de perguntas + spec); economiza retrabalho; implementação começa limpa | [Best practices](https://code.claude.com/docs/en/best-practices); [Ambig-SWE](https://arxiv.org/abs/2502.13069); [Laban](https://arxiv.org/abs/2505.06120) | NPC "Escriba da Guilda" faz a **Entrevista pré-missão**; a missão só vira "Aceita" quando o **Pergaminho da Missão** (SPEC.md) tem todas as seções e zero suposições bloqueantes |
| 2 | Plan mode (Explorar → Planejar → Implementar → Commit) | Shift+Tab até "plan mode on"; "What files need to change? … Create a plan."; Ctrl+G para editar o plano | Separa pesquisa de execução; evita resolver o problema errado | Overhead; pular se o diff cabe em uma frase | [Best practices](https://code.claude.com/docs/en/best-practices); [Costs](https://code.claude.com/docs/en/costs) | **Mapa da Masmorra**: o líder apresenta o mapa e o jogador aprova antes de "entrar" |
| 3 | Pesquisa → Plano → Implementação + compactação intencional (HumanLayer) | research.md → plan.md (~200 linhas revisáveis) → implementar por fases, atualizando o plano; manter contexto em 40–60% | Revisar pesquisa e plano tem mais alavancagem que revisar código (1 linha ruim de pesquisa → milhares de linhas ruins) | Mais artefatos, mas cada fase em contexto limpo; a equipe da HumanLayer gastava ~US$12k/mês em Opus (3 pessoas) | [ACE-FCA](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md) | **Três atos da missão**: Batedor (subagente só-leitura) → Estrategista → Party; a **Fogueira** entre atos = salvar o Diário de Missão + `/clear` |
| 4 | Verificação com evidência | "run the tests after implementing"; comparar screenshot; "show evidence" (comando + saída) | Fecha o loop; "parece pronto" ≠ pronto | Baixo–médio (saída de teste ocupa contexto; filtrar com hook) | [Best practices](https://code.claude.com/docs/en/best-practices); [Costs](https://code.claude.com/docs/en/costs) | **Prova do Feito**: o loot da missão é a evidência; sem prova, a missão fica "não confirmada" |
| 5 | Gates determinísticos (hooks Stop / TaskCompleted, exit 2) | Hook que roda os testes; exit 2 bloqueia a conclusão e devolve o erro ao Claude | Hooks são determinísticos; o CLAUDE.md é só conselho | Quase zero tokens de modelo (é script); só o feedback entra no contexto (inferência) | [Hooks](https://code.claude.com/docs/en/hooks); [Best practices](https://code.claude.com/docs/en/best-practices) | **Selo do Inspetor**: nenhuma missão é marcada como concluída sem passar no selo |
| 6 | `/goal` (condição verificável) | `/goal all tests in test/auth pass and the lint step is clean` + "or stop after 20 turns" | Um avaliador separado decide o fim, não o agente que fez o trabalho | Avaliador "negligible"; os turnos extras custam | [/goal](https://code.claude.com/docs/en/goal) | **Juramento da Missão**: condição de vitória explícita + contador de turnos |
| 7 | Revisor adversarial em contexto novo | "Use a subagent to review the diff against PLAN.md… Report gaps, not style preferences." / `/code-review` | O revisor não viu o raciocínio, então não está enviesado | Um subagente extra (contexto próprio; devolve ~1–2k tokens); times de agentes ~7×; multiagente ~15× o chat | [Best practices](https://code.claude.com/docs/en/best-practices); [Context eng.](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents); [Costs](https://code.claude.com/docs/en/costs) | NPC fixo **Conselho/Inspetor**: vê só o diff + o Pergaminho; reporta só lacunas de correção/requisitos (para não inflar a missão) |
| 8 | Investigar antes de responder + citações | Snippet `investigate_before_answering`; "cite arquivo:linha"; "sem citação → retire a afirmação" | Ancora as respostas no que foi realmente lido | Leituras custam contexto; delegar buscas a subagentes | [Prompting BP](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices); [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) | **Regra do Bardo**: afirmação sem fonte vira "boato" (marcada com []) |
| 9 | Permitir "não sei" | "If you're unsure… say 'I don't have enough information…'" | Tira a pressão para inventar | Desprezível | [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations) | NPCs dizem "os pergaminhos não contam isso" em vez de inventar lore ou código |
| 10 | Higiene de contexto ("zona burra") | % de contexto na status line; `/clear` entre tarefas e depois de 2 correções; `/autocompact 200k`; subagentes para pesquisa; `/btw` | Context rot: a qualidade cai com o contexto cheio | Economiza (cada request reenvia a conversa); `/clear` é grátis; `/compact` é caro | [Best practices](https://code.claude.com/docs/en/best-practices); [Status line](https://code.claude.com/docs/en/statusline); [Model config](https://code.claude.com/docs/en/model-config); [ACE-FCA](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md) | **Barra de Fadiga** do líder (verde <40%, amarela 40–60%, vermelha >60% → descansar: salvar diário + `/clear`); **Regra das duas quedas**; **Barra de Energia da Guilda** com o % de 5h/7 dias do plano Pro |
| 11 | TDD com testes imutáveis | NPC Juiz escreve os testes primeiro; "It is unacceptable to remove or edit tests…"; prompt anti-hardcode; hook PreToolUse nega edição em `tests/` durante a implementação | Testes viram critério objetivo; barra o "gênio" que apaga testes (Kent Beck) | Testes extras; permite ciclo autônomo | [Prompting BP](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices); [Best practices](https://code.claude.com/docs/en/best-practices); [Kent Beck](https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent) | **Contrato do Juiz** + **Selo Inquebrável** nos arquivos de teste |
| 12 | Passos pequenos verificáveis | "Write one file, test it, then continue"; checkpoints com `/rewind` | Erros aparecem cedo | Baixo | [Costs](https://code.claude.com/docs/en/costs); [Best practices](https://code.claude.com/docs/en/best-practices) | **Andares da Masmorra**: um andar = uma mudança pequena + teste; `/rewind` = voltar ao último save |
| 13 | Suposições + confiança qualitativa (no lugar de "95%") | Prompt de suposições (alta/média/baixa; bloqueante ou não); "Track your confidence levels in your progress notes" | Faz as lacunas aparecerem; % verbal é superconfiante e não serve de gate | Desprezível | [Prompting BP](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices); [Xiong](https://arxiv.org/abs/2306.13063); [Kadavath/Anthropic](https://www.anthropic.com/research/language-models-mostly-know-what-they-know) | **Medidor de Confiança** (Alta/Média/Baixa) + lista de suposições; as bloqueantes viram **Enigmas** que o jogador resolve antes de seguir |
| 14 | Gates no estilo Jev (probabilidade + limiares) | Perguntas fechadas → probabilidade → agir / perguntar / escalar; calibrar limiares com o histórico | Decisão explícita e auditável, separada da geração de texto | Jev: US$0,042/M tokens de input (fornecedor; early access); emulado com Claude: barato, mas não calibrado | [jev-tools](https://github.com/CMaintz/jev-tools); [DataNorth](https://datanorth.ai/blog/jev-what-it-is-and-why-this-new-model-matters); [AgentConn](https://agentconn.com/blog/jev-typesafe-new-agent-layer-if-calibration-holds/); [JevOut](https://github.com/xzx34/JevOut) | **Oráculo da Guilda**: decide qual freelancer contratar e se uma ação é destrutiva; a faixa do meio pede confirmação ao jogador; nunca é barreira de segurança |
| 15 | CLAUDE.md enxuto + skills | Menos de 200 linhas; `/doctor` para podar; workflows em skills | As regras não se perdem no ruído | Economiza (o CLAUDE.md carrega em toda sessão) | [Best practices](https://code.claude.com/docs/en/best-practices); [Costs](https://code.claude.com/docs/en/costs) | **Código da Guilda** (CLAUDE.md) + **Grimório** (skills carregadas sob demanda) |
| 16 | Spec Kit / constituição | `/speckit-constitution` → specify → plan → tasks → implement → converge | Formaliza o quê/por quê antes do como | Médio (vários artefatos) | [spec-kit](https://github.com/github/spec-kit) | **Constituição da Guilda** = princípios fixos de cada projeto |
| 17 | `/insights` (retrospectiva) | Rodar `/insights` periodicamente | Mostra onde o Claude entendeu mal ou gerou código com bug | Conta no plano | [Costs](https://code.claude.com/docs/en/costs) | **Crônica da Guilda** semanal, usada para ajustar as perguntas da Entrevista |
| 18 | (Criativo) Verbalized Sampling | "Gere 5 ganchos de missão com suas probabilidades" | Aumenta a diversidade (1,6–2,1× em escrita criativa) | Baixo | [arXiv 2510.01171](https://arxiv.org/abs/2510.01171) | **Taverna de Rumores**: gerar opções de quest variadas (não serve para precisão) |

- Effort tip for the user: use `/effort high` for bug fixes in existing code, where verification matters ([Model config](https://code.claude.com/docs/en/model-config)), and lower effort for brainstorming. This trades tokens for accuracy.

### Gaps
- No source quantifies the token cost of the interview or planning phases. The relative ratings in the table are my estimates.
- I did not verify whether hook scripts and the status line work the same way in the Windows desktop app; the bash examples may need Git Bash, WSL or PowerShell equivalents.
- Practitioner write-ups by Addy Osmani and Simon Willison and TypeSafe's primary documentation were unreachable from this environment and are not represented.
