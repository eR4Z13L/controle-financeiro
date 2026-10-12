# Domine o Claude Code sem estourar o Pro

Em outubro de 2026, gastar menos e acertar mais no Claude Code dependem das mesmas três coisas: **contexto pequeno, modelo escolhido de propósito e prova antes de aceitar qualquer resultado**. Três padrões silenciosos drenam o limite semanal do Pro: desde a v2.1.280 (22/set) o modelo `default` do Pro é o **Opus 5.5**, que custa **o dobro do Sonnet 5.5** por token; os modelos atuais têm janela de 1 milhão de tokens e só compactam perto de **967 mil**, enquanto cada pedido reenvia a conversa inteira; e loops, mensagens entre sessões e times de agentes gastam mesmo com você parado ([Configuração de modelo](https://code.claude.com/docs/en/model-config); [Custos](https://code.claude.com/docs/en/costs)). Cinco minutos de ajuste resolvem a maior parte: Sonnet como padrão, teto de compactação em 200 mil tokens, `/clear` entre tarefas, subagentes em Haiku e estilo Concise. Contra invenções, o caminho oficial é **entrevista → SPEC.md → sessão limpa → verificação** com testes, `/goal` ou hooks, mais um revisor de contexto novo ([Boas práticas](https://code.claude.com/docs/en/best-practices)); pedir "95% de certeza" faz a IA perguntar mais, mas o número em si não é confiável. O "jev" que você lembra é, com cerca de 70–80% de confiança, o **Jev da TypeSafe AI**, um modelo de decisão lançado em 15/set/2026 que responde com porcentagens ("SIM 97% / NÃO 3%") — útil como triagem, não como técnica de prompt do Claude ([InfoQ](https://www.infoq.com/news/2026/10/typesafe-ai-jev-released/)). Frameworks pesados como o GSD gastaram **seis vezes mais tokens** que o Claude Code puro num teste informal, sem resultado melhor; copie os princípios em vez de instalar tudo. E os **Claude Mods** (v2.1.287, 1º/out) tornam o seu RPG de guildas oficialmente viável: painel lateral, medição de contexto e de limite, lista de agentes e mensagens entre sessões já têm API ([Mods](https://code.claude.com/docs/en/plugins/mods/overview)).

*Estado em 12/out/2026 (Claude Code v2.1.296).* **Onde está cada pedido:** recursos do Claude Code → seção 4; economia e limites do Pro → seções 1 e 2; precisão, anti-alucinação e o "jev" → seção 3; métodos e frameworks → seção 5; Claude OS, vários projetos e visualização → seção 6; o jogo → coluna "No seu jogo" das tabelas e seção 7.

## 1. Dez ajustes resolvem a maior parte do problema

A ordem abaixo segue o impacto esperado para quem bate o limite semanal com frequência. Os ajustes 1, 2, 4 e 5 cabem num único arquivo de configuração (modelo logo abaixo da tabela) e não pioram a qualidade; os outros são hábitos. A Anthropic não publica quantos tokens o Pro inclui, então as comparações de custo usam os **preços de API como aproximação**.

| # | Ajuste | Como fazer | Por que vale |
|---|---|---|---|
| 1 | **Sonnet como padrão** | `/model sonnet` (Enter salva como padrão). Opus só para escrever o plano ou destravar um bug difícil | O `default` do Pro virou Opus 5.5 em 22/set; por token, o Opus custa 2x o Sonnet ([Modelo](https://code.claude.com/docs/en/model-config); [Preços](https://platform.claude.com/docs/en/about-claude/pricing)) |
| 2 | **Teto de contexto** | `"autoCompactWindow": 200000` no settings ou `/autocompact 200k` | Sem teto, a compactação automática só acontece perto de 967 mil tokens ([Modelo](https://code.claude.com/docs/en/model-config)) |
| 3 | **`/clear` entre tarefas** | `/rename` → `/clear`; volte com `/resume`. Limpe também depois de corrigir a mesma coisa duas vezes | É "a alavanca mais eficaz para qualidade e custo" e não custa nada ([Suporte](https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code); [Custos](https://code.claude.com/docs/en/costs)) |
| 4 | **Subagentes baratos** | `CLAUDE_CODE_SUBAGENT_MODEL=haiku` e um agente `Explore` próprio com `model: haiku` (modelo abaixo) | Haiku 5.5 custa ~1/20 do Sonnet por token; o Explore nativo usa o modelo da conversa principal ([Subagentes](https://code.claude.com/docs/en/sub-agents)) |
| 5 | **Respostas enxutas** | `"outputStyle": "Concise"` no settings (ou `/output-style concise` no terminal) | Corta introdução, narração e recapitulação; token de saída custa 5x o de entrada ([Estilos](https://code.claude.com/docs/en/output-styles); [Preços](https://platform.claude.com/docs/en/about-claude/pricing)) |
| 6 | **Medidor sempre à vista** | Desktop: anel de uso ao lado do seletor de modelo. Terminal: `/statusline` com % de contexto, de 5h e da semana. `/usage` + tecla `w` uma vez por semana | Ver o gasto muda o hábito; a status line roda localmente e não gasta tokens ([Desktop](https://code.claude.com/docs/en/desktop); [Status line](https://code.claude.com/docs/en/statusline)) |
| 7 | **Entrevista e SPEC antes do código** | Prompt de entrevista (seção 3) → `SPEC.md` → sessão nova para implementar | Ambiguidade é a principal origem de "invenção" ([Boas práticas](https://code.claude.com/docs/en/best-practices)) |
| 8 | **Prova obrigatória** | "Rode os testes e mostre a saída"; `/goal`; hook que bloqueia a conclusão | "If you can't verify it, don't ship it" ([Boas práticas](https://code.claude.com/docs/en/best-practices)) |
| 9 | **CLAUDE.md enxuto** | Menos de 200 linhas por arquivo; procedimentos viram skills | O CLAUDE.md entra em toda sessão e, longo, reduz a obediência ([Memória](https://code.claude.com/docs/en/memory)) |
| 10 | **Cache protegido** | Escolha modelo e esforço no início; não ligue/desligue MCP ou plugin no meio da tarefa; volte em até 1 hora | Reler sem cache custa de 25 a 40 vezes mais (cálculo pelos [Preços](https://platform.claude.com/docs/en/about-claude/pricing); [Cache](https://code.claude.com/docs/en/prompt-caching)) |

**Duas checagens de segurança antes de tudo:**

- **Nenhuma `ANTHROPIC_API_KEY` no ambiente do Windows.** Se essa variável existir, o Claude Code usa a chave e cobra pela API em vez de usar o plano ([Suporte](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)).
- **Créditos extras só com teto.** No Pro, Fable e fast mode rodam apenas com créditos pagos, cobrados a preço de API; se ativar, defina um limite mensal baixo em Configurações > Uso ([Fable no plano](https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan); [Fast mode](https://code.claude.com/docs/en/fast-mode); [Créditos](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans)).

**Arquivo inicial** — cole em `%USERPROFILE%\.claude\settings.json`. O app desktop não aceita `/config chave=valor`, então editar o arquivo é o caminho; `model` só vale em sessões novas ([Settings](https://code.claude.com/docs/en/settings)):

```json
{
  "model": "sonnet",
  "outputStyle": "Concise",
  "autoCompactWindow": 200000,
  "env": {
    "CLAUDE_CODE_SUBAGENT_MODEL": "haiku",
    "CLAUDE_CODE_ENABLE_TODO_TOOLS": "1",
    "CLAUDE_CODE_GOAL_CHECKIN_MINUTES": "0"
  }
}
```

A primeira variável manda para o Haiku os subagentes sem modelo definido (agentes com `model: sonnet` no próprio arquivo continuam em Sonnet); a segunda religa a lista de tarefas, desligada por padrão nos modelos 5.5; a terceira impede que o `/goal` gaste com check-ins enquanto você está fora ([Variáveis](https://code.claude.com/docs/en/env-vars); [Ferramentas](https://code.claude.com/docs/en/tools-reference); [Custos](https://code.claude.com/docs/en/costs)).

**Batedor barato** — salve como `%USERPROFILE%\.claude\agents\Explore.md`. Um agente com esse nome substitui o Explore nativo ([Subagentes](https://code.claude.com/docs/en/sub-agents)):

```markdown
---
name: Explore
description: Batedor somente leitura. Use para achar código e explicar onde e como algo funciona.
tools: Read, Grep, Glob
model: haiku
effort: low
omitClaudeMd: true
---
Você é um batedor somente leitura. Encontre o que foi pedido, cite arquivo:linha
e devolva no máximo 15 linhas. Não proponha soluções e não edite nada.
```

O Haiku é mais fraco: para pesquisas difíceis, troque por `sonnet`.

## 2. Contexto, modelo e cache explicam quase todo o gasto do Pro

O Pro (US$20/mês) tem **dois limites**: uma janela de sessão que reinicia a cada 5 horas e um **limite semanal** que reinicia num horário fixo da sua conta. Os dois formam **um único reservatório** para claude.ai, app desktop, extensões de IDE e Claude Code ([Limites](https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work); [Plano Pro](https://support.claude.com/en/articles/8325606-what-is-the-pro-plan)). A Anthropic não publica quantos tokens isso representa, só porcentagens. Em 2026, os limites de 5 horas do Claude Code dobraram em 6/mai, quando também acabou a redução em horário de pico para o Pro ([Anúncio](https://www.anthropic.com/news/higher-limits-spacex)); e desde 14/set o limite semanal ficou **25% maior de forma permanente**, depois de um bônus temporário de +50% entre 13/mai e 13/set — na prática, cerca de 17% menos do que durante o bônus ([ClaudeDevs](https://x.com/ClaudeDevs/status/2093742321473065266); [MindStudio](https://www.mindstudio.ai/blog/claude-code-weekly-rate-limit-changes)). Para comparar: a média corporativa é de ~US$13 por dia ativo e US$150–250 por mês a preço de API ([Custos](https://code.claude.com/docs/en/costs)), de 7 a 12 vezes o preço do Pro. Quem usa todo dia vai bater o teto semanal sem economizar, e por isso **cortar tokens por tarefa rende mais do que escolher horários**.

### Para onde vão os tokens

| Gasto | Por que pesa | Antídoto | No seu jogo |
|---|---|---|---|
| **Conversa longa** | Cada pedido reenvia a conversa inteira, e cada chamada de ferramenta é mais um pedido ([Custos](https://code.claude.com/docs/en/costs)) | `/clear` entre tarefas; teto de 200 mil; leituras pesadas em subagentes | Idade do líder |
| **Modelo caro** | Opus 5.5 custa 2x o Sonnet 5.5; o Haiku 5.5 custa ~1/20 ([Preços](https://platform.claude.com/docs/en/about-claude/pricing)) | Sonnet como padrão; Haiku para trabalho mecânico | Classe do NPC |
| **Cache frio** | Depois de 1h parado (5 min em subagentes), a conversa é relida sem desconto ([Cache](https://code.claude.com/docs/en/prompt-caching)) | Voltar em até 1h; aceitar "Resume from summary" | Lareira quente ou fria |
| **Esforço alto** | Raciocínio é cobrado como saída; num exemplo oficial, o esforço alto gerou ~7x mais tokens ([Blog oficial](https://claude.com/resources/articles/claude-model-and-effort-level-in-claude-code)) | `medium` (padrão); `low` no mecânico; `ultrathink` só no turno difícil | Foco do NPC |
| **Saídas enormes** | Logs e testes inteiros entram no contexto; um hook que filtra só os erros reduz "de dezenas de milhares de tokens para centenas" ([Custos](https://code.claude.com/docs/en/costs)) | Hook de filtro; pedir "só as falhas" | Passiva "Escriba" |
| **Agentes em paralelo** | Agent teams usam ~7x mais tokens quando os colegas trabalham em plan mode; 10 sessões em paralelo gastam ~10x ([Custos](https://code.claude.com/docs/en/costs); [Agent view](https://code.claude.com/docs/en/agent-view)) | Poucos agentes, em Sonnet ou Haiku | Custo de energia da party |
| **Gasto com você parado** | `/loop`, mensagens entre sessões e check-ins do `/goal` disparam turnos com o contexto inteiro ([Custos](https://code.claude.com/docs/en/costs)) | Cancelar loops; segurar mensagens (`crossSessionInbound: "hold"`); desligar check-ins | "Manutenção" da guilda |
| **Compactação** | `/compact` lê a conversa toda; com cache frio é o caso mais caro ([Cache](https://code.claude.com/docs/en/prompt-caching)) | Compactar em pausas naturais, com cache quente; para recomeçar, `/clear` + arquivo de passagem | Ritual do Ceifador |

### Quanto pesa cada modelo

| Modelo | Entrada / saída (US$ por milhão de tokens) | Leitura de cache | Peso vs. Sonnet | No Pro |
|---|---|---|---|---|
| Haiku 5.5 | 0,10 / 0,50 (pedidos até 100 mil tokens; 0,50 / 2,50 acima) | 0,01 | ~0,05x | Incluído |
| Sonnet 5.5 | 2 / 10 | 0,10 | 1x | Incluído |
| Opus 5.5 | 4 / 20 | 0,20 | 2x | Incluído (é o padrão) |
| Opus 5.5 em fast mode | 8 / 40 | — | 4x | Só com créditos |
| Fable 5.1 | 10 / 50 | 0,25 | 5x | Só com créditos |

Preços de API em 12/out/2026; a Anthropic não diz como cada modelo pesa no limite do plano, então use a tabela como aproximação ([Preços](https://platform.claude.com/docs/en/about-claude/pricing); [Fable no plano](https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan); [Fast mode](https://code.claude.com/docs/en/fast-mode)). Dois cálculos mostram o tamanho do efeito no Opus 5.5. Com **800 mil tokens** de conversa, um turno com 15 chamadas de ferramenta gasta ~US$2,56 só para reler o contexto do cache; com **100 mil**, ~US$0,32. E reler 200 mil tokens com cache quente custa ~US$0,04, contra ~US$1,60 com cache frio — **cerca de 40 vezes mais**.

### O que quebra o cache e o que não quebra

| Quebra (o próximo pedido relê tudo) | Não quebra |
|---|---|
| Trocar de modelo — inclusive cada ida e volta do `opusplan` | Editar arquivos do projeto |
| Ligar o fast mode | Editar o CLAUDE.md (mas a mudança só vale após `/clear`, `/compact` ou reinício) |
| Conectar ou remover servidor MCP com o tool search desligado | Trocar modo de permissão ou estilo de saída |
| Negar uma ferramenta inteira | Usar skills e comandos, `/rewind`, `/recap` |
| Compactar; acumular muitas imagens; atualizar o Claude Code | Mudar o esforço nos modelos 5.5 e no Fable 5.1 |
| Ficar parado mais que o prazo do cache: 1h na conversa principal, 5 min em subagentes | Criar subagentes; forks (`/subtask`) até reaproveitam o cache do pai |

Fonte: [Cache](https://code.claude.com/docs/en/prompt-caching). A central de ajuda recomenda o `opusplan` (planejar no Opus, executar no Sonnet), mas cada alternância reconstrói o cache: **planeje uma vez no Opus e fique na execução**, sem ir e voltar ([Suporte](https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code)).

### Mitos que não economizam

| Mito | O que é verdade |
|---|---|
| "Bati o limite, é só trocar para Haiku" | Os limites de sessão e semanal valem para todos os modelos; trocar só ajuda depois de um aviso específico de "Opus limit" ([Custos](https://code.claude.com/docs/en/costs)) |
| "Dividir o CLAUDE.md em `@imports` economiza" | Os arquivos importados carregam na abertura do mesmo jeito ([Memória](https://code.claude.com/docs/en/memory)) |
| "`/compact` é um recomeço grátis" | Ele lê a conversa inteira; grátis é o `/clear` ([Custos](https://code.claude.com/docs/en/costs)) |
| "Escrever 'think hard' ou 'pense bastante' controla o gasto" | Só `ultrathink` é palavra-chave; para o resto, use `/effort` ([Modelo](https://code.claude.com/docs/en/model-config)) |
| "Desligar o raciocínio economiza" | Nos modelos 5.5 e Fable não dá para desligar; baixe o esforço ([Modelo](https://code.claude.com/docs/en/model-config)) |
| "Mencionar arquivos com `@` poupa buscas" | `@` injeta o arquivo inteiro e a árvore de CLAUDE.md; o caminho simples é mais barato ([Suporte](https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code)) |
| "Fast mode economiza porque termina antes" | No Pro só roda com créditos, ao dobro do preço do Opus ([Fast mode](https://code.claude.com/docs/en/fast-mode)) |
| "Com 1 milhão de contexto não preciso limpar" | Cada pedido reenvia tudo, e a qualidade cai com o contexto cheio ([Boas práticas](https://code.claude.com/docs/en/best-practices)) |
| "Sessão parada não gasta" | Loops, mensagens e check-ins disparam turnos completos ([Custos](https://code.claude.com/docs/en/costs)) |
| "O `/cost` mostra quanto o Pro me custa" | É estimativa a preço de API, "irrelevante para a cobrança" no Pro ([Custos](https://code.claude.com/docs/en/costs)) |

### Como medir e o que fazer ao bater o limite

- **`/usage`** (ou `/cost`, `/stats`): barras do plano, quanto cada skill, subagente, plugin e servidor MCP consumiu, alertas para hábitos acima de 10% do uso e a linha "Prompt cache (main)"; `d` e `w` alternam 24h e 7 dias. Só enxerga este computador ([Custos](https://code.claude.com/docs/en/costs)).
- **Configurações > Uso no claude.ai**: os números oficiais de 5h e da semana, com hora de reset; use quando um painel local não abrir no desktop ([Suporte](https://support.claude.com/en/articles/9797557-usage-limit-best-practices)).
- **`/context`, `/skill-doctor` e `claude plugin details <nome>`**: mostram o que ocupa o contexto e quanto cada skill ou plugin custa por turno ([Janela de contexto](https://code.claude.com/docs/en/context-window); [Medir plugins](https://code.claude.com/docs/en/plugins/measure)).
- **ccusage** (terceiro, grátis): `npx ccusage@latest blocks` mostra suas janelas de 5h a partir dos logs locais; os valores em dólar são estimativas ([ccusage](https://github.com/ryoppippi/ccusage)).
- **Ao bater o limite:** `/rate-limit-options` → esperar e continuar sozinho após o reset (v2.1.234+); no desktop, marque "Auto-continue when limits reset". Isso não vale para resets a mais de 24h, como o semanal ([Modo interativo](https://code.claude.com/docs/en/interactive-mode); [Novidades](https://code.claude.com/docs/en/whats-new/index)).

## 3. Precisão vem de especificar antes e provar depois

Todo o guia oficial da Anthropic parte de uma restrição: **"a janela de contexto enche rápido, e o desempenho cai conforme ela enche"**. Dela saem dois hábitos — dar ao Claude uma checagem que ele consiga rodar e separar explorar/planejar de implementar ([Boas práticas](https://code.claude.com/docs/en/best-practices)). A pesquisa explica por que a IA "inventa" quando a ideia chega aos pedaços: em conversas de vários turnos com a informação dada aos poucos, os modelos perderam em média **39%** de desempenho, porque assumem coisas cedo e não se recuperam ([Laban et al.](https://arxiv.org/abs/2505.06120)); em tarefas de código mal especificadas, deixar o modelo perguntar melhorou o resultado em até **74%** — mas ele quase nunca pergunta se não for incentivado ([Ambig-SWE](https://arxiv.org/abs/2502.13069)). Os dois números vieram dos resumos dos artigos; confira no original antes de citá-los. O remédio é juntar tudo numa entrevista, escrever, implementar em contexto limpo e verificar.

### O fluxo em quatro passos

**1. Entrevista.** Adaptação do prompt oficial ([Boas práticas](https://code.claude.com/docs/en/best-practices)):

> Quero construir [descrição curta]. Me entreviste em detalhe usando a ferramenta AskUserQuestion. Pergunte sobre implementação técnica, UI/UX, casos de borda, preocupações e trade-offs. Não pergunte o óbvio; aprofunde nas partes difíceis que eu talvez não tenha considerado. Continue até cobrir tudo e então escreva uma especificação completa em SPEC.md.

**2. Pergaminho da Missão (SPEC.md).** Para a Anthropic, as melhores specs nomeiam arquivos e interfaces, dizem o que está fora do escopo e terminam com uma verificação de ponta a ponta ([Boas práticas](https://code.claude.com/docs/en/best-practices)). Modelo:

- **Objetivo**
- **Fora de escopo**
- **Arquivos e interfaces envolvidos**
- **Critérios de aceite**, cada um verificável (formato "QUANDO… ENTÃO…")
- **Comando de verificação final** (ex.: `npm test` termina com código 0)
- **Restrições** (ex.: "não alterar arquivos de teste")
- **Suposições abertas** — precisa estar vazia antes de começar

**3. Plano em contexto limpo.** Abra uma sessão nova (ou `/clear`) e use o plan mode; pule o plano se o diff cabe numa frase ([Boas práticas](https://code.claude.com/docs/en/best-practices)). "Um plano custa algumas centenas de tokens; um diff errado de 400 linhas custa milhares, duas vezes" ([Suporte](https://support.claude.com/en/articles/14552983-models-usage-and-limits-in-claude-code)).

**4. Prova.** Exija evidência — a saída do teste, o comando rodado, uma screenshot — e não a palavra "pronto". Os portões, do mais fraco ao mais forte:

| Portão | Exemplo | Custo |
|---|---|---|
| **No próprio pedido** | "Implemente, rode os testes e mostre a saída. Corrija a causa, não esconda o erro." | Nada extra |
| **`/goal`** | `/goal todos os testes em test/auth passam e o lint está limpo, ou pare após 20 turnos` | Avaliador de custo "desprezível" ([Goal](https://code.claude.com/docs/en/goal)) |
| **Hook determinístico** | `TaskCompleted` ou `Stop` com código de saída 2 impede a conclusão enquanto os testes falham ([Hooks](https://code.claude.com/docs/en/hooks)) | Zero tokens de modelo |
| **Revisor de contexto novo** | "Use um subagente para revisar o diff contra o SPEC.md. Confira se cada requisito foi feito e testado e se nada fora do escopo mudou. Reporte lacunas, não preferências de estilo." Ou `/code-review` | Um subagente, que devolve ~1–2 mil tokens |

Dois cuidados. O `/goal` só julga o que aparece na conversa — ele não roda comandos —, então escreva a condição como algo que a saída do Claude consiga demonstrar ([Goal](https://code.claude.com/docs/en/goal)). E um revisor mandado procurar lacunas quase sempre acha alguma, mesmo com o trabalho certo: peça só o que afeta correção ou requisitos, senão a missão incha ([Boas práticas](https://code.claude.com/docs/en/best-practices)).

**Esboço para Windows** (não testado; a forma `powershell.exe` + `args` segue o exemplo oficial de [Hooks](https://code.claude.com/docs/en/hooks)). Em `.claude/settings.json` da guilda:

```json
{
  "hooks": {
    "TaskCompleted": [
      { "hooks": [ {
        "type": "command",
        "command": "powershell.exe",
        "args": ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File",
                 "${CLAUDE_PROJECT_DIR}/.claude/hooks/prova-do-feito.ps1"]
      } ] }
    ]
  }
}
```

E em `.claude/hooks/prova-do-feito.ps1` (troque `npm test` pelo seu comando de teste):

```powershell
$saida = (npm test 2>&1 | Out-String) -split "`n" | Select-Object -Last 60
if ($LASTEXITCODE -ne 0) {
  [Console]::Error.WriteLine("Testes falharam; corrija antes de concluir:`n" + ($saida -join "`n"))
  exit 2
}
exit 0
```

O código 2 bloqueia a conclusão da tarefa e devolve o erro ao Claude como instrução; só as últimas 60 linhas entram no contexto. O `TaskCompleted` depende da lista de tarefas, que o arquivo inicial da seção 1 já religa.

### Técnicas anti-invenção que valem o custo

| Técnica | Como aplicar | No seu jogo |
|---|---|---|
| **Investigar antes de afirmar** | No CLAUDE.md: "Nunca especule sobre código que você não abriu; se eu citar um arquivo, leia-o antes de responder" (adaptado do trecho oficial `investigate_before_answering`) ([Prompting](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)) | "Regra do Bardo": afirmação sem fonte vira boato marcado com [ ] |
| **Permitir "não sei"** | "Se faltar informação, diga que não tem informação suficiente" — técnica que "pode reduzir drasticamente" informação falsa ([Alucinações](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)) | NPC responde "os pergaminhos não contam isso" |
| **Citar antes de concluir** | Em documentos com mais de 20 mil tokens, extrair trechos literais primeiro; sem trecho, a afirmação sai ([Alucinações](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)) | Relatório do NPC chega com a prova anexada |
| **Testes intocáveis** | Testes antes do código; "é inaceitável remover ou editar testes"; hook `PreToolUse` que nega edição em `tests/` ([Prompting](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices); [Hooks](https://code.claude.com/docs/en/hooks)). Kent Beck relata agentes apagando testes para "passar" ([Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/tdd-ai-agents-and-coding-with-kent)) | "Contrato do Juiz" e "selo inquebrável" |
| **Passos pequenos** | "Escreva um arquivo, teste, depois continue" ([Custos](https://code.claude.com/docs/en/costs)) | Andares da masmorra; `/rewind` = voltar ao último save |
| **Limpar após duas correções** | Corrigiu a mesma coisa duas vezes? `/clear` e um prompt mais específico; "uma sessão limpa com prompt melhor quase sempre vence" ([Boas práticas](https://code.claude.com/docs/en/best-practices)) | "Regra das duas quedas" |
| **Escritor e revisor separados** | Uma sessão escreve, outra, de contexto novo, revisa; ou um Claude escreve os testes e outro o código ([Boas práticas](https://code.claude.com/docs/en/best-practices)) | NPC fixo "Inspetor" |
| **Best-of-N** | Rodar o mesmo pedido mais de uma vez; respostas divergentes indicam alucinação ([Alucinações](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations)) | "Conselho de três sábios" para decisões caras |
| **Contexto baixo** | A HumanLayer mantém o uso entre 40% e 60%; Dex Horthy chamava os ~40% de início da "zona burra" — heurística, não regra oficial ([ACE-FCA](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md); [Podcast](https://www.wordman.dev/podcast/dex-horthy-what-actually-gets-you-2-3x-with-ai-coding/)) | Barra de fadiga do líder |
| **Retrospectiva** | `/insights` gera um relatório HTML dos pontos de atrito, como pedidos mal entendidos (gasta tokens) ([Custos](https://code.claude.com/docs/en/costs)) | "Crônica da guilda" mensal |

### "Pergunte até ter 95% de certeza": o comportamento ajuda, o número não

O prompt viral "me faça perguntas até ter 95% de confiança antes de começar" ([Sabrina Ramonov](https://substack.com/@sabrinaramonov/note/c-235070151)) funciona porque força a IA a perguntar, e isso a pesquisa apoia. O número, não: modelos tendem a declarar confiança **acima** do acerto real ([Xiong et al.](https://arxiv.org/abs/2306.13063)), e a própria Anthropic achou boa calibração só em formatos fechados, como múltipla escolha e verdadeiro/falso, com piora em tarefas novas ([Anthropic, 2022](https://www.anthropic.com/research/language-models-mostly-know-what-they-know)). Nenhum estudo valida 95% como ponto de parada. Troque a porcentagem por uma checklist:

> Antes de escrever código: liste as suposições que você está fazendo, marcando confiança (alta/média/baixa) e se é bloqueante. Para cada suposição bloqueante, me faça uma pergunta usando AskUserQuestion (no máximo 4 por rodada). Não comece enquanto houver suposição bloqueante aberta. Se não souber algo, diga "não sei" em vez de inventar. Ao final, atualize o SPEC.md com as respostas.

Para corrigir bugs em código existente, onde a verificação importa, `/effort high` vale o custo; já o `max` "tende a pensar demais" ([Modelo](https://code.claude.com/docs/en/model-config)).

### O "jev" é um modelo que responde em porcentagens, não um prompt

O candidato mais forte (confiança ~70–80%) é o **Jev, da TypeSafe AI**: o primeiro modelo "System One" da empresa, em acesso antecipado desde **15/set/2026**. Em vez de texto, ele responde a perguntas estreitas com tipos fixos — escolher uma opção (*choice*), dar uma nota (*score*) ou dizer a probabilidade de algo ser verdade (*noul*) —, sempre com uma probabilidade ([InfoQ](https://www.infoq.com/news/2026/10/typesafe-ai-jev-released/); [jev-tools](https://github.com/CMaintz/jev-tools)). A cobertura em português usa exemplos como **"Fraude? SIM 97% / NÃO 3%"** e políticas com limiares de **70% e 95%** para decidir se age, pergunta ou escala ([Triggo.ai](https://triggo.ai/en/blog/jev-o-que-e-a-ia-da-typesafe-que-transforma-inteligencia-artificial-em-decisoes); [Templo](https://templo.pro/jev-modelo-decisao/)) — o que bate com "um método de usar a IA com um negócio de porcentagem". O 95% dessas políticas talvez explique por que ele se mistura, na memória, com o prompt dos "95% de certeza".

- **Como funciona o método:** quebrar a decisão em perguntas fechadas → receber uma probabilidade por opção → o código decide por faixas. Exemplo de faixas: agir sozinho acima de 0,85; perguntar ao usuário entre 0,6 e 0,85; passar a um humano abaixo de 0,6; exigir mais de 0,9 para ações destrutivas ([DataNorth](https://datanorth.ai/blog/jev-what-it-is-and-why-this-new-model-matters)). Calibre com o seu histórico: 0,9 "só funciona como limiar se corresponder a ~90% de acerto no seu tráfego" ([AgentConn](https://agentconn.com/blog/jev-typesafe-new-agent-layer-if-calibration-holds/)).
- **Limites:** API fechada com lista de espera, sem saída de texto, focada em inglês e inadequada para código ou planejamento ([qcode.cc](https://qcode.cc/en/system-one-model-jev-guide)). O "0% de alucinação" anunciado conta só respostas fora do formato; ele ainda pode errar com confiança ([Flavio Copes](https://flaviocopes.com/jev/)). Um ataque acadêmico inverteu **61,4%** das decisões corretas do Jev com contexto de aparência natural ([JevOut](https://github.com/xzx34/JevOut)), e o autor do jev-guard resume: "segunda opinião, não sandbox" ([jev-guard](https://github.com/CMaintz/jev-guard)). O fabricante anuncia US$0,042 por milhão de tokens de entrada e saída grátis ([TypeSafe](https://typesafe.ai/)).
- **Outros candidatos, menos prováveis:** o prompt dos "95% de certeza" (~15–20%); a regra de manter o contexto abaixo de ~40%; e o Verbalized Sampling, que pede várias respostas com probabilidades para ganhar variedade criativa ([arXiv 2510.01171](https://arxiv.org/abs/2510.01171)).
- **Como aproveitar no Claude Code:** o Jev não é técnica de prompt do Claude nem cura invenção em tarefas abertas. O que se transfere é o padrão: um **"Oráculo da Guilda"** que faz perguntas fechadas ("qual freelancer contratar?", "esta ação é destrutiva?") e decide por faixas, com a faixa do meio sempre pedindo a sua confirmação. Se o oráculo for o próprio Claude, trate as porcentagens só como triagem, porque elas não são calibradas.
- **Para fechar a dúvida:** vale lembrar onde você viu o termo (vídeo, post, curso); a identificação não é 100% certa.

## 4. Recursos do Claude Code: o que carrega sempre, custa sempre

A versão mais recente no changelog é a **v2.1.296 (9/out/2026)**; atualize com `claude update` (o app desktop traz a própria cópia) ([Changelog](https://code.claude.com/docs/en/changelog)). A documentação oficial tem espelho em português: troque `/docs/en/` por `/docs/pt/` no endereço, como em [agent teams em PT](https://code.claude.com/docs/pt/agent-teams). Uma regra organiza tudo o que vem a seguir: **o que carrega em toda sessão custa em toda sessão; o que carrega sob demanda é quase grátis até ser usado**.

### 4.1 Configuração e extensões

| Recurso | O que faz | Como usar | No seu jogo |
|---|---|---|---|
| **CLAUDE.md** | Instruções lidas em toda sessão, empilhadas: gerenciado → usuário (`~/.claude/CLAUDE.md`) → projeto → `CLAUDE.local.md` ([Memória](https://code.claude.com/docs/en/memory)) | Menos de 200 linhas; `@imports` organizam mas não economizam; comentários `<!-- -->` não gastam tokens; `/init` cria; `/doctor prompt-audit` acha conflitos | **Carta da Guilda**: persona do líder, regras de delegação, elenco |
| **Regras** (`.claude/rules/`) | Instruções por área; com `paths:` só carregam quando Claude mexe em arquivos que batem ([Memória](https://code.claude.com/docs/en/memory)) | Uma regra por área, ex.: `paths: ["assets/**"]` | **Leis de cada casa** (Galeria, Estúdio, Construtora) |
| **Memória automática** | Claude anota aprendizados em `~/.claude/projects/<projeto>/memory/MEMORY.md`; as primeiras 200 linhas (25 KB) entram em toda sessão; fica no seu PC e não vai para subagentes ([Memória](https://code.claude.com/docs/en/memory)) | `/memory` liga, desliga e abre a pasta; "lembre que…" salva | **Diário da guilda** |
| **Memória de agente** | `memory: project` dá ao subagente a pasta `.claude/agent-memory/<nome>/`, que pode ir para o git ([Subagentes](https://code.claude.com/docs/en/sub-agents)) | Um campo no frontmatter do agente | **Diário do NPC**; o Ceifador grava ali o testamento para o aprendiz |
| **settings.json** | Configuração em 5 níveis: gerenciado > `--settings` > `.claude/settings.local.json` > `.claude/settings.json` > `~/.claude/settings.json`; listas se somam ([Settings](https://code.claude.com/docs/en/settings)) | No desktop, `/config` abre as Configurações e ignora `chave=valor`: edite o arquivo; `model` e esforço só valem ao abrir a sessão | **Pergaminho de Economia** aplicado pelo jogo (`$.config.set`) |
| **Permissões e modos** | 6 modos (Manual, aceitar edições, plano, auto, dontAsk, bypass); regras avaliadas na ordem negar → perguntar → permitir; no terminal, o modo inicial é auto desde v2.1.283, e o classificador dele não conta no limite do Pro ([Modos](https://code.claude.com/docs/en/permission-modes); [Semana 32](https://code.claude.com/docs/en/whats-new/2026-w32)) | Desktop: seletor ao lado do Enviar ou `Ctrl+Shift+M`; `/fewer-permission-prompts` libera comandos de leitura; negar `Agent(model:opus)` barra subagentes em Opus ([Permissões](https://code.claude.com/docs/en/permissions)) | **Postura da guilda** (Plano = conselho; Auto = campanha). O mod não deve aprovar nada via `tool.check`: num PC pessoal ele passa por cima até de regras de negação |
| **Skills e comandos** | Pasta com `SKILL.md` vira `/nome`; só a descrição fica sempre no contexto e o corpo carrega ao usar; `.claude/commands/x.md` continua funcionando ([Skills](https://code.claude.com/docs/en/skills)) | `disable-model-invocation: true` zera o custo até você chamar; `context: fork` roda num subagente; até 500 linhas; no Windows, `shell: powershell`; `/skill-doctor` mostra o custo de cada uma | **Grimório**: habilidades dos NPCs (`/pintar-asset`, `/relatorio-guilda`) |
| **Subagentes** | `.claude/agents/<nome>.md` com contexto próprio; devolve só um resumo, muitas vezes de 1–2 mil tokens ([Subagentes](https://code.claude.com/docs/en/sub-agents); [Engenharia de contexto](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)) | Campos `model`, `effort`, `tools`, `memory`, `omitClaudeMd`, `autoCompactWindow` (v2.1.296), `color`, `maxTurns`, `isolation: worktree`; rodam em segundo plano; até 3 níveis e 20 ao mesmo tempo | **Agentes fixos** (pasta da guilda) e **freelancers** (`~/.claude/agents/`, valem para todas) |
| **Hooks** | Scripts determinísticos em ~30 eventos (início de sessão, antes de ferramenta, fim de turno, compactação…); código de saída 2 bloqueia ([Hooks](https://code.claude.com/docs/en/hooks)) | Ficam no settings; no Windows, `"shell": "powershell"`; custam zero tokens, salvo se injetarem texto ou forem do tipo `prompt`/`agent` | **Selo do Inspetor** (`TaskCompleted`), **cartas** (`Notification`), **memórias** (`PreCompact`/`PostCompact`), **relatórios** (`SubagentStop`) |
| **Plugins** | Pacote com skills, agentes, hooks, mod, MCP, temas, estilos e executáveis ([Plugins](https://code.claude.com/docs/en/plugins/overview)) | Terminal: `/plugin install nome@marketplace`; desktop: **+ → Plugins**. Nome e descrição de cada item entram em todo turno — meça com `claude plugin details <nome>`; não carregam na nuvem nem no WSL ([Medir plugins](https://code.claude.com/docs/en/plugins/measure); [Instalar](https://code.claude.com/docs/en/plugins/install)) | O RPG inteiro distribuído como **um plugin** no escopo de usuário |
| **Mods** | Plugin com código JS/TS que roda dentro do Claude Code: desenha painéis, lê o uso, cria comandos, chama modelos ([Mods](https://code.claude.com/docs/en/plugins/mods/overview)) | Ativos por padrão desde v2.1.287 (terminal) e v2.1.286 (desktop); "early access"; peça "faça um mod que…" e o Claude usa a skill `/plugin-authoring` | A plataforma do jogo (seção 7) |
| **MCP** | Liga ferramentas externas; com o *tool search*, que é o padrão, só os nomes entram no contexto até o uso ([MCP](https://code.claude.com/docs/en/mcp)) | `claude mcp add`; prefira CLIs como `gh` quando existirem; desligue o que não usa em `/mcp`; os conectores do claude.ai aparecem sozinhos | API de imagens do **Leonardo da Vinho** declarada só no arquivo dele (`mcpServers`), fora do contexto do líder |
| **Estilos de saída** | Mudam o jeito de responder: Default, Proactive, Concise, Explanatory, Learning ou um próprio ([Estilos](https://code.claude.com/docs/en/output-styles)) | `/output-style concise`; no desktop, `"outputStyle"` no settings; subagentes ignoram o estilo | Estilo **Narrador** curto, só para o líder |
| **Status line** | Linha de status gerada por script local: contexto, custo, % de 5h e da semana, cache; não gasta tokens ([Status line](https://code.claude.com/docs/en/statusline)) | `/statusline <descrição>`; no Windows roda via Git Bash ou PowerShell, com barras `/` nos caminhos; `subagentStatusLine` mostra uma linha por subagente com seus tokens | **HUD sem mod** e barra de vida dos NPCs |
| **Atalhos e temas** | `~/.claude/keybindings.json` e `~/.claude/themes/`, recarregados na hora ([Atalhos](https://code.claude.com/docs/en/keybindings)) | `/keybindings`, `/theme`; plugins podem trazer temas | **Um tema por guilda**; atalho para trocar painéis do mod |

**Comandos nativos que valem decorar** ([Comandos](https://code.claude.com/docs/en/commands)):

| Comando | Para quê |
|---|---|
| `/clear`, `/rename`, `/resume` | Recomeçar sem perder a sessão antiga |
| `/compact <foco>`, `/autocompact 200k`, `/context` | Controlar o tamanho do contexto |
| `/model`, `/effort`, `/advisor` | Escolher modelo, esforço e conselheiro |
| `/plan`, `/rewind` (ou `Esc Esc`) | Planejar sem editar; voltar atrás |
| `/btw`, `/subtask` | Pergunta lateral sem histórico; fork que reaproveita o cache |
| `/goal`, `/tasks` | Condição de vitória; tarefas em segundo plano |
| `/usage`, `/insights` | Consumo e retrospectiva |
| `/memory`, `/init`, `/doctor`, `/skill-doctor` | Instruções, memória e custo de cada skill |
| `/statusline`, `/output-style` | Painel e estilo de resposta |
| `/code-review`, `/ultrareview` | Revisão em contexto novo; revisão profunda na nuvem (3 grátis no Pro) |
| `/fewer-permission-prompts`, `/permissions` | Menos interrupções (o segundo não existe no desktop) |
| `/list-agents`, `/rc`, `/schedule` | Sessões alcançáveis; controle remoto; rotinas na nuvem |

### 4.2 Fluxo de trabalho: planejar e limpar rendem mais que paralelizar

| Recurso | O que faz e como usar | Cuidado no Pro e no Windows | No seu jogo |
|---|---|---|---|
| **Plan mode** | Lê, explora e escreve um plano sem editar código; você aprova ("Yes, and use auto mode"), aprova revisando cada edição ou pede mais plano; `Ctrl+G` edita o plano; o plano sobrevive à compactação ([Modos](https://code.claude.com/docs/en/permission-modes)) | No desktop, `Shift+Tab` não alterna modos: use o seletor ou `Ctrl+Shift+M`; pule o plano se o diff cabe numa frase | **Conselho de guerra**: toda missão começa com o mapa da masmorra aprovado por você |
| **Modelos** | `/model` com `sonnet`, `opus`, `haiku`, `fable` ou `opusplan`; `Alt+P` troca sem apagar o prompt ([Modelo](https://code.claude.com/docs/en/model-config)) | Trocar de modelo relê tudo sem cache; `opusplan` reconstrói o cache a cada alternância; Fable só com créditos | **Classe do NPC**: líder e fixos em Sonnet, freelancers em Haiku |
| **Esforço** | De `low` a `max`; padrão `medium` nos modelos 5.5 ("Opus 5.5 em medium iguala ou supera o Opus 5 em high"); `ultrathink` no texto dá raciocínio extra só naquele turno ([Modelo](https://code.claude.com/docs/en/model-config)) | `max` tende a pensar demais; mudar o esforço não quebra o cache nos 5.5; desktop: `Ctrl+Shift+E` | **Foco** de cada NPC; item "Pergaminho de Insight" = `ultrathink` |
| **Advisor** | `/advisor opus`: um modelo mais forte é consultado só em decisões-chave ([Advisor](https://code.claude.com/docs/en/advisor)) | Conta no limite, mas costuma sair mais barato que usar Opus o tempo todo | **Sábio ancião** que acende quando é consultado |
| **Contexto e compactação** | `/context` mostra o que ocupa espaço; `/compact <foco>` resume; `/autocompact 200k` define o teto; depois de compactar voltam o CLAUDE.md da raiz, o plano, até 5 arquivos recentes e as skills usadas ([Janela de contexto](https://code.claude.com/docs/en/context-window)) | Compacte com o cache quente, em pausas naturais; `/clear` é grátis | **Envelhecimento** e **Ceifador** (seção 7) |
| **Checkpoints** | Um ponto de restauração por prompt (os últimos 100); `Esc Esc` ou `/rewind` restaura código e/ou conversa, ou resume a partir dali ([Checkpoints](https://code.claude.com/docs/en/checkpointing)) | Não desfaz mudanças feitas via Bash nem por subagentes; não substitui o git | **Vira-tempo** |
| **Sessões** | `/rename`, `/resume`, `claude -n nome`, `/branch` (cópia), `/fork` (cópia em segundo plano) ([Sessões](https://code.claude.com/docs/en/sessions)) | Sessão sem nome não vira endereço; ao voltar depois de mais de 1h com mais de 100 mil tokens, aceite "Resume from summary" | Cada guilda com nome fixo, ex.: `guilda-financas` |
| **`/btw`** | Pergunta lateral, sem ferramentas, que não entra no histórico; no desktop, `Ctrl+;` ([Modo interativo](https://code.claude.com/docs/en/interactive-mode)) | Quase grátis com cache quente | **Sussurro ao líder**, que não o envelhece |
| **Lista de tarefas** | Checklist com TaskCreate e TaskUpdate; `Ctrl+T` mostra ([Ferramentas](https://code.claude.com/docs/en/tools-reference); [Modo interativo](https://code.claude.com/docs/en/interactive-mode)) | Desligada por padrão nos modelos 5.5 desde v2.1.268: ligue com `CLAUDE_CODE_ENABLE_TODO_TOOLS=1`; compartilhe entre sessões com `CLAUDE_CODE_TASK_LIST_ID` | **Quadro de missões** |
| **`/goal`** | Condição de vitória checada por um modelo pequeno após cada turno ([Goal](https://code.claude.com/docs/en/goal)) | Avaliação barata; check-ins ociosos gastam (a variável da seção 1 os desliga) | **Juramento da missão** com contador de turnos |
| **Segundo plano e Monitor** | `Ctrl+B` manda um comando para segundo plano; `/tasks` lista; `Ctrl+X Ctrl+K` para todos os subagentes; o Monitor acompanha logs sem ficar perguntando ([Modo interativo](https://code.claude.com/docs/en/interactive-mode); [Ferramentas](https://code.claude.com/docs/en/tools-reference)) | No Windows, o Monitor exige Git Bash; ele gasta menos que um `/loop` | **Expedições** e **Torre de vigia** |
| **Worktrees** | `claude --worktree nome` cria uma cópia isolada em `.claude/worktrees/`; subagentes aceitam `isolation: worktree` ([Worktrees](https://code.claude.com/docs/en/worktrees)) | `.worktreeinclude` leva arquivos ignorados pelo git, como o `.env` | **Canteiros de obra** da Construtora |
| **Agent view** | `claude agents` mostra as sessões em segundo plano e o estado de cada uma; `claude agents --json` é a fonte estável para scripts ([Agent view](https://code.claude.com/docs/en/agent-view)) | Prévia de pesquisa; 10 agentes em paralelo gastam ~10x | Fonte do **mapa do mundo** |
| **Agent teams** | Líder + colegas com lista de tarefas e caixas de mensagem ([Agent teams](https://code.claude.com/docs/en/agent-teams)) | Experimental, só no terminal (não no desktop), ~7x mais tokens com colegas em plan mode; painéis divididos não funcionam no Windows Terminal | **Raide** opcional; evite no Pro |
| **Workflows dinâmicos e `/batch`** | Um script orquestra muitos subagentes; `/batch` divide uma mudança entre 5 e 30 agentes em worktrees ([Workflows](https://code.claude.com/docs/en/workflows); [Comandos](https://code.claude.com/docs/en/commands)) | No Pro, precisa ser ligado em `/config`; alerta acima de 25 agentes ou 1,5 milhão de tokens; o `ultracode` aciona workflows o tempo todo | **Exército** com aviso de custo |
| **Mensagens entre sessões** | Uma sessão manda texto a outra (`/list-agents`, `@nome`); `notify_when_idle` avisa quando outra termina, sem gastar tokens dela ([Mensagens](https://code.claude.com/docs/en/cross-session-messaging)) | Windows nativo: v2.1.234+; mensagem entregue vira turno novo com o contexto inteiro; WSL e Windows nativo não se falam | **Diplomacia e corvos** entre guildas |
| **Agendamento e rotinas** | `/loop` (dentro da sessão, expira em 7 dias); tarefas agendadas do desktop (locais, com o app aberto); Rotinas na nuvem (mínimo de 1h, incluídas no Pro, `/schedule`) ([Agendamento](https://code.claude.com/docs/en/scheduled-tasks); [Rotinas](https://code.claude.com/docs/en/routines)) | Cada disparo reenvia o contexto inteiro | **Patrulhas**, **conselho diário**, **expedições** |
| **Remote Control** | Controla uma sessão do seu PC pelo celular ou navegador (`/rc`) ([Remote Control](https://code.claude.com/docs/en/remote-control)) | O processo local precisa continuar rodando | **Comandar da estrada** |
| **Sessões na nuvem** | Rodam em máquinas da Anthropic (`claude --cloud`; trazer de volta com `--teleport`) ([Nuvem](https://code.claude.com/docs/en/claude-code-on-the-web)) | Contam no limite; exigem GitHub; leem só o `.claude/settings.json` do repositório, não o seu `~/.claude` nem plugins locais; `/clear` não existe; mods não desenham ([Settings](https://code.claude.com/docs/en/settings); [Instalar plugins](https://code.claude.com/docs/en/plugins/install)) | **Expedições** com o PC desligado; o jogo precisa de um modo texto |
| **App desktop** | Abas Chat, Cowork e Code; painéis de chat, diff, navegador, terminal, arquivo, plano, tarefas e subagente; `Ctrl+N`, `Ctrl+Tab`, `Ctrl`+clique divide a tela; anel de uso; aviso quando uma sessão termina ([Desktop](https://code.claude.com/docs/en/desktop)) | Faltam agent teams, `/permissions`, `/config chave=valor` e `Shift+Tab`; sessões WSL não carregam plugins; o Cowork lê conectores e skills da conta, não o seu `~/.claude` ([Cowork](https://claude.com/docs/cowork/overview)) | Onde mora o **painel lateral** do jogo |
| **Projects (beta)** | Conversa coordenadora que abre "threads" na nuvem e mostra um painel Overview por estado ([Projects](https://code.claude.com/docs/en/claude-projects)) | Roda Opus em tudo por padrão (mude em Project settings > General); exige github.com; mais na seção 6 | Vocabulário oficial para os estados das guildas |

## 5. Frameworks pesados custaram seis vezes mais num teste, sem resultado melhor

Os métodos se dividem em cinco famílias — kits de especificação (Spec Kit, OpenSpec, Kiro, Agent OS), ciclos de fases com contexto controlado (GSD, HumanLayer, harness da Anthropic, Ralph), bibliotecas de skills (Superpowers, Compound Engineering, gstack, CCPM), equipes de papéis (BMAD, SuperClaude) e enxames (Ruflo) —, e quase todos já vêm como skills ou plugins. A evidência de que melhoram resultados é **fraca**: não existe estudo independente e controlado. O único comparativo encontrado é informal, num projeto de landing page: o Claude Code puro levou 20 minutos e 200 mil tokens; o Superpowers, 60 minutos e 250 mil; o GSD, 105 minutos e **1,2 milhão** — com resultados "honestamente indistinguíveis" (lido via resumo de busca) ([Chase AI](https://www.chaseai.io/blog/gsd-vs-superpowers-vs-claude-code)). A Thoughtworks alerta que ferramentas de especificação podem gerar documentos longos e difíceis de revisar ([Thoughtworks Radar](https://www.thoughtworks.com/radar/techniques/spec-driven-development)). A tendência de 2026 é de enxugamento, porque o Claude Code absorveu plan mode, subagentes e skills: o Agent OS v3 entregou a escrita de specs ao plan mode nativo, o CCPM virou uma skill e o GSD original foi arquivado ([Agent OS v3](https://github.com/buildermethods/agent-os/discussions/310)).

| Método | Como funciona | Tokens | Situação em out/2026 | Serve para |
|---|---|---|---|---|
| [Superpowers](https://github.com/obra/superpowers) | brainstorm → worktree → plano em tarefas pequenas → subagente por tarefa (ou execução inline) → TDD → revisão | Médio; o modo inline gasta menos; o próprio projeto avisa que pode "queimar mais tokens que o esperado" | No marketplace oficial: `/plugin install superpowers@claude-plugins-official` | Quem quer disciplina: design antes, TDD, revisão |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | `/opsx:explore` → `/opsx:propose` (proposta, specs, design, tarefas) → `/opsx:apply` → `/opsx:archive` em specs vivas | Leve | Ativo; `npm install -g @fission-ai/openspec@latest` | Projetos existentes e mudanças iterativas |
| [Spec Kit (GitHub)](https://github.com/github/spec-kit) | constituição → specify → plan → tasks → implement → converge | Médio (muito Markdown) | Ativo; `uv tool install specify-cli` | Features novas com spec formal |
| [Specs estilo Kiro](https://kiro.dev/docs/specs/concepts) | `requirements.md` com critérios EARS ("QUANDO… O sistema DEVE…") → `design.md` → `tasks.md` | Leve (é só um formato) | Portável para qualquer ferramenta | Qualquer feature com critério de aceite |
| [BMAD](https://github.com/bmad-code-org/BMAD-METHOD) | Papéis: Analista → PM → Arquiteto → Scrum Master (histórias detalhadas) → Dev → QA; trilhas Quick Flow, BMad e Enterprise ([referência](https://www.mintlify.com/bmad-code-org/BMAD-METHOD/reference/agents/overview)) | Médio a pesado; o Quick Flow é leve | v6.12 só recebe correções; V7 em alfa, prevista para 16/out/2026, via plugin | Produtos maiores; quem gosta de "equipe" com papéis |
| [GSD → GSD Core](https://github.com/open-gsd/gsd-core) | Discuss → Plan → Execute → Verify → Ship; cada executor com contexto limpo de 200 mil; `STATE.md` entre sessões | Pesado | Repositório original arquivado em 26/jun/2026; agora `npx @opengsd/gsd-core@latest` | Projetos longos com orçamento folgado |
| [HumanLayer RPI](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md) | Pesquisa → Plano → Implementação com o contexto entre 40% e 60%; revisar pesquisa e plano rende mais que revisar código | Princípio barato; a prática deles custa ~US$12 mil/mês em Opus para 3 pessoas | Ensaio de 2025, atualizado em 2026 | Bases de código grandes e complexas |
| [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) | brainstorm → plan → work → review → registrar lições em `docs/solutions/` | Médio | Ativo; 36 skills | Projetos longos que devem "aprender" |
| [feature-dev (Anthropic)](https://github.com/anthropics/claude-code/tree/main/plugins/feature-dev) | 7 fases: exploradores, perguntas, 2–3 arquiteturas para você escolher, implementação aprovada, 3 revisores | Médio a pesado (até ~8 subagentes) | Oficial | Features grandes e ambíguas; não para correções triviais |
| [Harness de longa duração (Anthropic)](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | A sessão inicial cria `init.sh`, um log de progresso e uma lista JSON de features com o campo `passes`; cada sessão faz uma feature e testa | Leve | Artigo oficial de 26/nov/2025 | Projetos de muitas sessões |
| [Agent OS v3](https://github.com/buildermethods/agent-os) | Descobre e injeta os padrões do seu código; `/shape-spec` melhora o plan mode | Leve | Encolheu em jan/2026 | Manter as convenções da casa |
| [Ralph loop](https://venturebeat.com/ai/how-ralph-wiggum-went-from-the-simpsons-to-the-biggest-name-in-ai-right-now) | Repete o mesmo prompt até surgir a frase de conclusão ou os testes passarem | Leve por volta; sem limite, roda para sempre | Plugin oficial; use `--max-iterations` | Tarefas mecânicas com teste objetivo |
| [RIPER-5](https://forum.cursor.com/t/i-created-an-amazing-mode-called-riper-5-mode-fixes-claude-3-7-drastically/65516) | Modos Pesquisar, Inovar, Planejar, Executar e Revisar, trocados explicitamente | Leve | Só comunidade; o plan mode já cobre | Disciplina sem instalar nada |
| [Task Master](https://github.com/eyaltoledano/claude-task-master) | PRD → tarefas com dependências → próxima tarefa | 36 ferramentas MCP ≈ 21 mil tokens; modo `core` ≈ 5 mil | Ativo (empresa Hamster) | Transformar PRD em backlog |
| [CCPM](https://github.com/automazeio/ccpm) | PRD → épico → GitHub Issues → agentes em worktrees | Médio a pesado | Virou uma skill; os ganhos divulgados são autodeclarados | Quem vive no GitHub Issues |
| [SuperClaude](https://github.com/SuperClaude-Org/SuperClaude_Framework) | 30 comandos, 20 agentes, 7 modos, 8 servidores MCP | Médio a pesado | v4.3.0; v5 "sem previsão" | Quem quer uma paleta enorme de comandos |
| [Ruflo (ex-Claude-Flow)](https://github.com/ruvnet/claude-flow) | Enxames com "rainha", mais de 100 agentes, 314 ferramentas MCP | Muito pesado | Ativo; renomeado | Experimentos, não orçamento apertado |
| [gstack](https://horadecodar.com.br/papeis-gstack-claude-code/) | Skills por papel: CEO, designer, gerente de engenharia, QA; `/qa`, `/ship` | Médio | Ativo; número de estrelas não verificado | Fundador solo que quer revisores virtuais |

### Os oito princípios que os bons compartilham

1. Escrever a intenção antes do código, com aprovação humana.
2. Dividir em tarefas pequenas, cada uma com sua verificação.
3. Dar a cada tarefa um contexto novo ou enxuto, com subagentes para pesquisa.
4. Exigir prova antes de "pronto".
5. Guardar o estado em arquivos de passagem e no git.
6. Dimensionar o processo pelo tamanho da tarefa.
7. Usar scripts determinísticos para o que não exige raciocínio.
8. Registrar lições para a próxima tarefa ficar mais fácil.

### O que adotar no Pro e como levar para o jogo

Não instale frameworks pesados (Ruflo, GSD completo, SuperClaude com todos os MCPs, BMAD Enterprise). Copie três ideias baratas e bem fundamentadas:

1. **Missão = mini-spec com critérios testáveis** (OpenSpec, Kiro, Spec Kit): cada cartão do quadro tem objetivo, escopo, critérios QUANDO/ENTÃO, arquivos, verificação e um campo `passa: sim/não`, como a lista JSON do harness da Anthropic.
2. **Pesquisa → Plano → Implementação, com contexto novo e pergaminhos de passagem** (HumanLayer, harness da Anthropic, GSD): Batedor (só leitura, cita arquivo:linha) → Estrategista (tarefas pequenas, cada uma com verificação) → Construtor (uma tarefa por vez) → Inspetor.
3. **Prova antes da entrega + memória da guilda** (Superpowers, Compound Engineering): sem evidência não há entrega; depois de cada missão, uma "lição aprendida" vai para `docs/solutions/`.

Se quiser instalar algo, **Superpowers** (com execução inline, para gastar menos) e **OpenSpec** são as apostas mais seguras; deixe o **feature-dev** para "missões chefe". Os **ranks de missão** dimensionam o processo, como o Quick Flow do BMAD e o "não use para o trivial" do feature-dev: **E–D**, sem spec, faz e testa; **C–B**, mini-spec mais plano; **A–S**, pesquisa completa, opções de arquitetura na Galeria e revisores.

## 6. Nenhuma ferramenta mostra o organograma entre projetos — seu jogo pode

Nenhuma das ferramentas pesquisadas desenha um organograma completo entre projetos nem um grafo das mensagens entre agentes: é um nicho aberto, e é exatamente o que o seu Mega Brain e o painel de guildas propõem. Antes de construir, vale separar os três sentidos de "projeto" no Claude, porque **cada um tem memória própria e nenhum enxerga o outro**.

### "Projeto" tem três significados no Claude

| "Projeto" | O que é | Memória | Use para |
|---|---|---|---|
| **Projeto do chat** (claude.ai e desktop) | Espaço com base de conhecimento e instruções próprias; nos planos pagos, o RAG amplia a capacidade em até 10x ([Projetos](https://support.claude.com/en/articles/9517075-what-are-projects)) | Própria por projeto; a busca de conversas não cruza projetos ([Memória do chat](https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context)) | **Quartel-General**: documentos de referência e decisões entre guildas |
| **Projects do Claude Code** (beta no Pro e Max desde ~17/set/2026) | Conversa coordenadora que abre threads na nuvem e mostra o Overview: Ready for review, Waiting on you, Working, Landing, Idle, Resolved ([Projects](https://code.claude.com/docs/en/claude-projects); [The Register](https://www.theregister.com/a/5297532)) | `MEMORY.md` próprio + instruções de até 16 mil caracteres | Visão oficial de vários trabalhos — mas roda Opus por padrão, exige repositórios no github.com, limita a 200 threads novas por dia e, no Pro, "espere chegar ao limite mais cedo" |
| **Pasta local** | Cada sessão pertence a uma pasta; histórico e memória ficam em `~/.claude/projects/<pasta>/` ([Sessões](https://code.claude.com/docs/en/sessions)) | Memória automática por repositório ([Memória](https://code.claude.com/docs/en/memory)) | **A unidade natural da guilda** |

Uma thread do Projects pode rodar no seu PC via Remote Control (v2.1.280+), mas recebe só as instruções do projeto, não a memória ([Projects](https://code.claude.com/docs/en/claude-projects)). Para o seu caso — Pro, Windows, sessões locais —, a pasta local continua sendo a melhor guilda; o Projects serve de inspiração para os estados e de opção ocasional para missões grandes, com threads ajustadas para Sonnet.

### Estrutura para várias guildas

- **Reino (global):** `~/.claude/CLAUDE.md` com o seu perfil, idioma português e convenções; `~/.claude/rules/` para regras que valem em todas as guildas; `~/.claude/agents/` com os freelancers que qualquer guilda pode contratar ([Memória](https://code.claude.com/docs/en/memory); [Subagentes](https://code.claude.com/docs/en/sub-agents)).
- **Cada guilda:** `CLAUDE.md` como carta (menos de 200 linhas); `.claude/agents/` com os membros fixos; `docs/CURRENT_STATE.md` como **único** arquivo de status (fase, missão atual, bloqueios, próximo passo, "precisa de você?", data); `WORKLOG.md` (diário em que só se acrescenta); `HANDOFF.md` (passagem de bastão). Essas convenções vêm da comunidade; a Anthropic não tem um padrão oficial de arquivo de estado ([second-brain-os](https://github.com/brkakyldz/second-brain-os); [skill de handoff](https://skills.sh/ykdojo/claude-code-tips/handoff)).
- **Registro:** `GUILDAS.md`, com uma linha por guilda, ou o `$.store` do mod. Ler o estado em arquivos custa zero tokens; ler de GitHub Issues ou Linear via MCP gasta tokens.
- **Quartel-General:** um Projeto do chat para decisões entre guildas, já que a busca de conversas não atravessa projetos.

### Sistemas "Claude OS": copie os padrões, não os kits

| Sistema | Ideia central | Maturidade | Windows | Copie isto |
|---|---|---|---|---|
| [coleam00/second-brain-starter](https://github.com/coleam00/second-brain-starter) | Skill que gera o PRD do seu "segundo cérebro"; heartbeat a cada 30 min | 804★ | Não informado | Arquivos `SOUL`, `USER`, `MEMORY`, `HEARTBEAT`; o heartbeat custa ~US$0,05 por execução contra US$0,38 via MCP |
| [Persistia (ex-claude-code-os)](https://github.com/bernardohcrocha/claude-code-os) | `_brain/` por projeto, com `index.md` lido primeiro e um `dashboard.html` que se atualiza a cada 5 min | 161★ | Agendador via launchd/systemd; Windows não citado | Índice lido primeiro, painel HTML e revisão semanal |
| [tonydzi/second-brain-starter-kit](https://github.com/tonydzi/second-brain-starter-kit) | 100 skills; `/arch`, `/brain` e uma `/search` local de 0 tokens | 8★ | Tem guia para Windows | Comandos de "saúde" do sistema |
| [brkakyldz/second-brain-os](https://github.com/brkakyldz/second-brain-os) | Vault do Obsidian + git; `CURRENT_STATE.md` e `WORKLOG.md` por projeto; scripts "doctor" | 0★ | Windows, macOS, Linux | Um único arquivo de status por projeto |
| [konark20/second-brain-for-claude](https://github.com/konark20/second-brain-for-claude) | Pastas PARA + `/weekly`, `/handoff`, `/resume`, `/ticket-status` | 0★ | Não informado | Revisão semanal e passagem de bastão |
| [justnau1020/claude-os](https://github.com/justnau1020/claude-os) | "O agente principal é líder de equipe, não operário" | 3★ | Não informado | Regra de qual pasta pertence a qual equipe |
| [LLM Wiki (Karpathy)](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) | Fontes brutas + wiki mantida pela IA + `index.md` + `log.md` + "lint" de contradições | Gist | Qualquer | Índice lido primeiro e diário cronológico |

A maioria desses repositórios é recente e pequena, e nenhum mostra agentes ao vivo: são sistemas de memória e processo. O estado ao vivo precisa vir de hooks ou de eventos do mod.

### Ferramentas para ver agentes e sessões

| Ferramenta | O que mostra | Windows | Observação |
|---|---|---|---|
| **Agent view** (`claude agents`) | Sessões em segundo plano por estado: Working, Needs input, Idle, Completed, Failed, Stopped | Sim | Oficial, prévia de pesquisa; `--json` é estável para scripts ([Agent view](https://code.claude.com/docs/en/agent-view)) |
| **Barra lateral do desktop** | Sessões agrupadas por projeto e estado; painéis de tarefas e de subagentes | Sim | Oficial; avisa quando uma sessão termina ([Desktop](https://code.claude.com/docs/en/desktop)) |
| **Overview do Projects** | Threads por estado | Desktop e web | Oficial, beta, na nuvem ([Projects](https://code.claude.com/docs/en/claude-projects)) |
| **`/list-agents`, `/tasks`, `/workflows`** | Quem alcança quem; tarefas em segundo plano; progresso de workflows | Sim | Oficial ([Agentes em paralelo](https://code.claude.com/docs/en/agents)) |
| [Pixel Agents](https://github.com/pablodelucca/pixel-agents) | Escritório em pixel-art: um personagem por sessão, subagentes como personagens próprios, balão quando o agente espera você | Windows, Linux, macOS | ~9,7 mil★; o mais parecido com o seu RPG, e o roteiro prevê virar "Actually a game" |
| [disler/observability](https://github.com/disler/claude-code-hooks-multi-agent-observability) | Linha do tempo de eventos com raias por agente, incluindo SubagentStart/Stop | Não informado | 1,5 mil★; os resumos exigem `ANTHROPIC_API_KEY` — se ela ficar no mesmo ambiente, o Claude Code passa a cobrar pela API |
| [opcode](https://github.com/winfunc/opcode) | Projetos, sessões e uso por modelo e por projeto | Windows 10/11 | 22,4 mil★; precisa compilar do código-fonte |
| [Nimbalyst](https://github.com/nimbalyst/nimbalyst) | Espaço visual para vários agentes, com kanban e worktrees | macOS, Windows, Linux | 1,9 mil★; substituiu o Crystal |
| [ccusage](https://github.com/ryoppippi/ccusage) | Consumo por dia, por sessão e por janela de 5h | Provável (Node) | 19 mil★; lê logs locais, zero tokens |
| [claude-code-templates](https://github.com/davila7/claude-code-templates) | `--analytics`: estado ao vivo e métricas | Provável (Node) | 32,6 mil★ |

Evite no Windows: o [Claude Squad](https://github.com/smtg-ai/claude-squad) exige tmux (só funciona no WSL), o Conductor é só para macOS ([guia](https://codepick.dev/en/guides/conductor-build-intro/)) e o [Vibe Kanban](https://github.com/BloopAI/vibe-kanban) está sendo descontinuado.

### Mega Brain: um grafo por guilda, uma galáxia no conjunto

- **Graphify** (~125,8 mil★) transforma uma pasta em `graph.html` (interativo), `GRAPH_REPORT.md` (conceitos-chave e conexões surpreendentes) e `graph.json`. O **código é analisado localmente, sem modelo e sem custo**; documentos e mídia passam pelo modelo e gastam tokens ([Graphify](https://github.com/Graphify-Labs/graphify)).
- **Passo a passo:** `uv tool install graphifyy` → `graphify install` (detecta o Windows, ou use `--platform windows`) → `/graphify . --update --code-only` em cada guilda → `graphify merge-graphs a.json b.json` para montar a galáxia. Grafos prontos entre repositórios são um recurso pago do Graphify Cloud.
- **No jogo:** cada guilda vira um sistema estelar, cada comunidade do grafo vira um planeta, e as ligações entre guildas (bibliotecas e conceitos em comum) viram rotas. Some aos nós as memórias dos agentes (`.claude/agent-memory/`) e as passagens de bastão.
- **Alternativa sem código:** no Obsidian, grupos de cor por `path:guildas/<nome>` mostram as ligações entre projetos ([Obsidian](https://obsidian.md/help/plugins/graph)); Karpathy usa essa visão para enxergar "a forma" do wiki ([LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)).

### Organograma: definições fixas mais eventos ao vivo

- **Parte fixa:** membros = `.claude/agents/*.md` de cada guilda; freelancers = `~/.claude/agents/*.md`; cor e modelo vêm do frontmatter, sem chamar modelo nenhum ([Subagentes](https://code.claude.com/docs/en/sub-agents)).
- **Parte viva:** `$.agent.list()` traz `status`, `parentId` (quem criou o agente) e `spawnedBy`; o evento `agent.spawn` avisa quem nasce e de quem; os hooks `SubagentStart`/`SubagentStop` trazem `agent_id`, tipo e o último relatório; `session.send`/`session.receive` registram as cartas ([Referência de mods](https://code.claude.com/docs/en/plugins/mods/reference); [Hooks](https://code.claude.com/docs/en/hooks)).
- **Entre guildas:** `$.agent.list()` só vê a sessão atual. Cada sessão publica um "batimento" no `$.store`, ou o mod lê `claude agents --json` via `$.process.run` — não está confirmado se as sessões do desktop aparecem nessa lista ([Agent view](https://code.claude.com/docs/en/agent-view)).
- **Confiabilidade, da maior para a menor:** eventos e API do mod → hooks → `claude agents --json` → arquivos de runtime (times, caixas de mensagem) → transcrições JSONL, cujo formato "muda entre versões" ([Sessões](https://code.claude.com/docs/en/sessions)).
- **Arestas do grafo:** membro de, reporta a, contratado por, mandou mensagem para, missão atribuída a.

## 7. Os mods de outubro tornam as guildas uma arquitetura oficial

Os mods chegaram na **v2.1.287 (1º/out/2026)** e funcionam na aba Code do app desktop a partir da v2.1.286. Eles rodam dentro do Claude Code, desenham **painéis ao lado da conversa** e uma faixa acima do prompt, enxergam eventos (chamadas de ferramenta, turnos, criação de subagentes, compactação, mensagens), chamam modelos no seu plano e guardam dados num `$.store` compartilhado por todas as sessões do PC ([Mods](https://code.claude.com/docs/en/plugins/mods/overview); [Referência](https://code.claude.com/docs/en/plugins/mods/reference); [Changelog](https://code.claude.com/docs/en/changelog)). **Desenhar e ler o uso não gastam tokens**; só chamadas de modelo e mensagens entregues gastam. Como a superfície ainda é "early access", o arquivo de tipos que a sua versão grava vale mais que a documentação quando os dois divergirem ([Referência](https://code.claude.com/docs/en/plugins/mods/reference)).

### Mapa do jogo para recursos oficiais

| Elemento | Recurso oficial | Como implementar |
|---|---|---|
| **Guilda** | Uma sessão por pasta | Nome fixo com `/rename guilda-<nome>`, para retomar e receber mensagens ([Sessões](https://code.claude.com/docs/en/sessions)) |
| **Líder** | Sessão principal | Sonnet por padrão; opcionalmente `"agent": "lider"` no `.claude/settings.json`, com `tools: Agent(pintor, escriba), Read, Bash` no agente para limitar a quem ele delega ([Subagentes](https://code.claude.com/docs/en/sub-agents)) |
| **Agentes fixos** | `.claude/agents/<npc>.md` | `memory: project`, `color`, `model: sonnet` ou `haiku`, `effort`, poucas `tools`, `omitClaudeMd: true` se o NPC não precisa das regras do projeto, `autoCompactWindow` como expectativa de vida ([Subagentes](https://code.claude.com/docs/en/sub-agents); [Changelog](https://code.claude.com/docs/en/changelog)) |
| **Freelancers (NPCs)** | `~/.claude/agents/` + evento `agent.spawn` | O mod força Haiku (`next({...e, model: 'haiku'})`), pede resumo de até 15 linhas e usa `maxTurns` pequeno ([Referência](https://code.claude.com/docs/en/plugins/mods/reference)) |
| **Galeria de Arte (Leonardo da Vinho)** | Subagente com `mcpServers` próprio, skill com script PowerShell ou ferramenta do mod via `$.http.fetch` | Só ele carrega as ferramentas de imagem (servidor próprio ou o conector do Canva); a chave da API fica no `userConfig` do plugin com `sensitive: true` ([Subagentes](https://code.claude.com/docs/en/sub-agents); [Componentes de plugin](https://code.claude.com/docs/en/plugins/components)) |
| **Estúdio de Gravação** | Mesmo padrão do Leonardo, ou casa da crônica | Se o estúdio gera áudio: ferramenta só no NPC do estúdio (o `$.audio` do mod não toca som no Windows). Como crônica: `WORKLOG.md`, `HANDOFF.md`, lições em `docs/solutions/`, o `compact_summary` do hook `PostCompact` e o último relatório de cada NPC no `SubagentStop` ([Hooks](https://code.claude.com/docs/en/hooks)) |
| **Construtora** | Worktrees + plano aprovado | Cada obra num worktree a partir da "planta" (o plano aprovado); a vistoria é a prova antes da entrega ([Worktrees](https://code.claude.com/docs/en/worktrees)) |
| **Prefeitura** | Comando do mod (`$.command.register`) | `/fundar-guilda <nome> <pasta>` cria a pasta, a carta (`CLAUDE.md`), `.claude/agents/`, `CURRENT_STATE.md`, `WORKLOG.md`, `HANDOFF.md` e o registro no `$.store`; também aplica as "leis" (o preset de economia) ([API de mods](https://code.claude.com/docs/en/plugins/mods/api)) |
| **Quadro de missões** | Lista de tarefas + Pergaminho da Missão | `CLAUDE_CODE_ENABLE_TODO_TOOLS=1` e `CLAUDE_CODE_TASK_LIST_ID=<guilda>`; cada cartão é uma mini-spec com rank de E a S ([Modo interativo](https://code.claude.com/docs/en/interactive-mode)) |
| **Mega Brain** | Graphify + elemento `Svg` | Grafos `--code-only` por guilda + `merge-graphs`; o `Svg` só desenha no desktop, então no terminal use texto ([Interface de mods](https://code.claude.com/docs/en/plugins/mods/interface)) |
| **Quem manda em quem** | `$.agent.list()`, `agent.spawn`, `SubagentStart`/`SubagentStop` | Árvore líder → fixos → instâncias ao vivo; freelancers numa coluna "taverna", com linha pontilhada até quem os contratou ([Referência](https://code.claude.com/docs/en/plugins/mods/reference)) |
| **Cartas** | `classic.Notification`, hook `PermissionRequest`, `$.ui.notify` (v2.1.295), `$.ui.toast` | Os tipos `permission_prompt`, `idle_prompt` e `agent_needs_input` viram um envelope lacrado; o `PermissionRequest` é o sinal imediato, já que o `permission_prompt` só dispara após ~6 s sem digitar ([Hooks](https://code.claude.com/docs/en/hooks); [Changelog](https://code.claude.com/docs/en/changelog)) |
| **Área de treinamento** | Plugin skill-creator, `claude plugin eval`, `claude plugin test`, `/skill-doctor` | Antes de promover um NPC, compare com e sem ele: acerto, tokens e tempo ([Skills](https://code.claude.com/docs/en/skills); [Novidades, semana 37](https://code.claude.com/docs/en/whats-new/2026-w37)) |
| **Energia** | `$.session.usage().rateLimits` + evento `session.measure` | Uma barra única para a conta inteira (5h e semana); cada guilda aparece só como "parcela" do gasto, porque todas bebem do mesmo limite ([Referência](https://code.claude.com/docs/en/plugins/mods/reference)) |
| **Lareira (cache)** | Hook `SessionStart` (origem `resume`) e status line | `prompt_cache_likely_expired` e `estimated_cache_write_usd` permitem avisar "acordar esta guilda custa X" antes do primeiro pedido ([Hooks](https://code.claude.com/docs/en/hooks); [Status line](https://code.claude.com/docs/en/statusline)) |
| **Oráculo** | Perguntas fechadas com faixas (estilo Jev) | Triagem para contratar freelancer ou sinalizar ação destrutiva; nunca como barreira de segurança |

### Ciclo de vida: envelhecer, aposentar e passar o conhecimento

Meça a idade em **tokens absolutos**, não em porcentagem de 1 milhão: 40% de 1 milhão são 400 mil tokens, muito além do ponto em que a qualidade já caiu. Com teto de 200 mil, as fases em 40% e 60% caem em **80 mil e 120 mil tokens** — perto dos ~80–100 mil que Dex Horthy associava à "zona burra" ([Podcast](https://www.wordman.dev/podcast/dex-horthy-what-actually-gets-you-2-3x-with-ai-coding/); [ACE-FCA](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md)). Sugestão (heurística, não regra oficial): **aprendiz** abaixo de 80 mil, **veterano** de 80 a 120 mil, **ancião** acima de 120 mil; aposente líderes Sonnet ou Opus por volta de 150–200 mil e NPCs Haiku antes de 100 mil, porque acima disso o Haiku 5.5 passa a custar 5x por token ([Preços](https://platform.claude.com/docs/en/about-claude/pricing)). A idade do líder vem de `$.session.usage().context.tokens`; a dos NPCs, do `tokenCount` da `subagentStatusLine` ou do uso que o evento `turn.step` registra com o `agentId` ([Referência](https://code.claude.com/docs/en/plugins/mods/reference); [Status line](https://code.claude.com/docs/en/statusline)).

O ritual do Ceifador, só com APIs documentadas:

1. **Aviso.** O evento `session.measure`, que dispara após cada turno, detecta a idade-limite — de preferência logo depois de um turno, com o cache ainda quente.
2. **Testamento.** `$.model.fork` faz uma pergunta sobre a própria conversa reaproveitando o cache, por isso sai barato: "escreva a passagem: objetivo, o que foi feito, o que funcionou, o que falhou, decisões, próximos passos" ([API de mods](https://code.claude.com/docs/en/plugins/mods/api)).
3. **Herança.** O testamento vai para `HANDOFF.md` (líder) ou `.claude/agent-memory/<npc>/MEMORY.md` (NPC); um aprendiz com o mesmo `memory` herda tudo sozinho ([Subagentes](https://code.claude.com/docs/en/sub-agents)).
4. **Aposentadoria.** Líder: `$.session.compact` com instruções, ou você roda `/clear` e abre uma sessão nova que lê o `HANDOFF.md` (não está documentado se um mod consegue rodar `/clear` sozinho). NPC: `$.agent.spawn` do aprendiz com o testamento no prompt.
5. **Posse.** Um hook `SessionStart` com origem `compact` reinjeta a carta do aprendiz; a saída desse hook sobrevive à compactação ([Janela de contexto](https://code.claude.com/docs/en/context-window)).

É o mesmo padrão que a Anthropic recomenda para projetos longos: cada sessão nova começa lendo o arquivo de progresso e o log do git ([Harness de longa duração](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)).

### Ordem sugerida de construção

Comece pelo que é só leitura e não gasta nada; depois, pelo que economiza; por último, pelo que gasta.

1. **HUD de energia, idade e lareira** — `session.measure` e `$.session.usage()`; custo zero e valor imediato. O exemplo `token-weather`, do repositório de testes da Anthropic (sem suporte oficial), já faz uma previsão do contexto acima do prompt ([Mods](https://code.claude.com/docs/en/plugins/mods/overview)).
2. **Registro de guildas e Guild Hall** — batimento a cada 15–30 s no `$.store`, uma chave por guilda; sem batimento há ~2 min, a guilda aparece "dormindo".
3. **Cartas** — `classic.Notification` vira envelope e `$.ui.notify`.
4. **Organograma** — `$.agent.list()` + `agent.spawn`, desenhado em `Svg`.
5. **Freelancers em Haiku** — o `agent.spawn` força o modelo; é o recurso do jogo que mais economiza.
6. **Quadro de missões e Pergaminho** — lista de tarefas, mini-spec e Selo do Inspetor.
7. **Ceifador e aprendiz** — passagem de bastão automática.
8. **Mega Brain** — Graphify só de código, regenerado com `--update`.
9. **Diplomacia** — `$.session.send` atrás de um botão, com aviso de custo.
10. **Área de treinamento** — avaliações antes de promover NPCs.

### Regras de ouro para o mod não gastar o seu limite

- **Desenhar e ler o uso é grátis;** o gasto vem de `$.model.*`, `$.agent.spawn`, `$.prompt.submit` e mensagens entregues ([API de mods](https://code.claude.com/docs/en/plugins/mods/api)).
- **Nunca injete números que mudam** (energia, idade, relógio) em `prompt.section` ou `prompt.context`: texto que muda entre pedidos invalida o cache a cada pedido ([Eventos](https://code.claude.com/docs/en/plugins/mods/events)). Deixe esses números no painel.
- **Não troque o modelo do líder a cada passo** via `turn.step`: cada troca reconstrói o cache. Escolha os modelos no `agent.spawn` ([Cache](https://code.claude.com/docs/en/prompt-caching)).
- **Nunca chame `$.model.*` num timer;** narração de NPC só com Haiku, `maxTokens` baixo e o texto fixo marcado com `cache: true` ([API de mods](https://code.claude.com/docs/en/plugins/mods/api)).
- **`$.store` tem 4 MiB no total** e "um get seguido de um set não é atômico": use uma chave por guilda ([Interface de mods](https://code.claude.com/docs/en/plugins/mods/interface)).
- **Descrições curtas** para as skills e os agentes do plugin, que entram em todo turno; meça com `claude plugin details` ([Medir plugins](https://code.claude.com/docs/en/plugins/measure)).
- **Não aprove chamadas pelo `tool.check`:** num PC pessoal, o mod passa por cima até das regras de negação ([Permissões](https://code.claude.com/docs/en/permissions)).
- **Mensagem para uma guilda parada abre um turno com o contexto inteiro:** agrupe os recados e use o `session.receive` do mod para guardar mensagens não pedidas como cartas, em vez de acordar o líder ([Mensagens](https://code.claude.com/docs/en/cross-session-messaging); [API de mods](https://code.claude.com/docs/en/plugins/mods/api)).

### Checklist do Windows e da nuvem

- **Sessões nativas, nunca WSL:** no WSL o mod não roda, e as sessões de lá não conversam com as nativas ([Mods](https://code.claude.com/docs/en/plugins/mods/overview); [Mensagens](https://code.claude.com/docs/en/cross-session-messaging)).
- **Instalação:** pelo terminal, no escopo de usuário, ou pelo menu **+ → Plugins** do desktop ([Instalar plugins](https://code.claude.com/docs/en/plugins/install)). Para desenvolver, aponte `CLAUDE_CODE_PLUGIN_DIRS` (caminhos separados por `;`) no `env` do `~/.claude/settings.json` e ligue `CLAUDE_CODE_PLUGIN_DIR_WATCH=1` para recarregar ao salvar ([Referência](https://code.claude.com/docs/en/plugins/mods/reference)).
- **Guarde o código:** o mod que o Claude cria fica em `~/.claude/dev-mods/<sessão>/` e é apagado depois de um tempo; copie para uma pasta sua. Editar a cópia instalada não tem efeito ([Criar mod](https://code.claude.com/docs/en/plugins/mods/create); [Problemas](https://code.claude.com/docs/en/plugins/mods/troubleshoot)).
- **Desenho:** `Svg` só no desktop; `Raster` e `Image` só no terminal; o som do `$.audio` não toca no Windows ([Referência](https://code.claude.com/docs/en/plugins/mods/reference)).
- **Scripts:** hooks com `"shell": "powershell"` ou `powershell.exe -File`; skills com `shell: powershell`; o Monitor exige Git Bash; a status line usa Git Bash ou PowerShell, com barras `/` nos caminhos ([Hooks](https://code.claude.com/docs/en/hooks); [Skills](https://code.claude.com/docs/en/skills); [Status line](https://code.claude.com/docs/en/statusline)).
- **Variáveis de ambiente:** o app desktop herda as variáveis do Windows, mas não os perfis do PowerShell; prefira o bloco `env` do settings ([Desktop](https://code.claude.com/docs/en/desktop)).
- **Nuvem:** os hooks do mod podem rodar, mas nada é desenhado; tenha uma saída em texto (`$.ui.log`, comandos) ([Mods](https://code.claude.com/docs/en/plugins/mods/overview)).
- **Versões:** Claude Code v2.1.296 ou mais nova para a vida útil por subagente, e v2.1.234 ou mais nova para mensagens entre sessões no Windows ([Changelog](https://code.claude.com/docs/en/changelog); [Mensagens](https://code.claude.com/docs/en/cross-session-messaging)).

## Conclusão

Economia e precisão não disputam espaço no Claude Code de 2026: são a mesma disciplina vista de dois lados. Um contexto pequeno e limpo é mais barato a cada pedido **e** é onde o modelo erra menos; uma especificação escrita evita o retrabalho caro **e** a invenção; uma verificação objetiva troca a sua atenção — o recurso mais escasso — por um teste. O que mudou entre setembro e outubro é que os padrões ficaram mais generosos e, por isso, mais caros para quem está no Pro: Opus por padrão, janela de 1 milhão, subagentes em segundo plano e paralelismo a um comando de distância. Quem não ajusta nada paga por capacidade que não pediu — e ainda recebe respostas piores no fim de sessões inchadas.

O seu RPG tem uma vantagem rara: a metáfora certa. "Envelhecer conforme o contexto enche e passar o conhecimento a um aprendiz" é exatamente o que a Anthropic, a HumanLayer e o GSD recomendam com outros nomes — compactação intencional, arquivos de passagem, sessões novas. Se o jogo transformar esses hábitos em regras visíveis (energia da conta inteira, idade em tokens, pergaminho obrigatório antes da missão, selo de prova antes da entrega), ele deixa de ser só uma interface e passa a ser o próprio método — algo que nenhuma ferramenta de visualização atual oferece. Como os mods ainda são "early access", construa primeiro sobre os eventos mais estáveis (uso, criação de agentes, notificações) e trate o resto como experimento a revalidar a cada versão.
