# TREND SCOUT — AI 코딩 에이전트 엔지니어링 트렌드 (조사일 2026-08-28)

모든 문장은 자체 서술. 원문 인용 없음. 출처 URL만 기록.
대상 독자: 신입 CS 전공 엔지니어, Claude Code CLI 사용, 8장 구성 한국어 스터디 가이드.
기존 축: 하네스 엔지니어링(Guides/Sensors) + 루프 엔지니어링.

---

## 1. Context Engineering — 컨텍스트 엔지니어링

**정의(자체 서술):** 모델이 추론 시점에 실제로 보게 될 토큰 묶음을 의도적으로 설계·유지·정리하는 기술. 프롬프트 문구 고르기가 아니라 "무엇을 넣고 무엇을 빼고 언제 버릴지"의 예산 관리다.

**왜 지금 뜨는가 / 성숙도:** 확립된 실무. Anthropic이 프롬프트 엔지니어링의 다음 단계로 공식 정의했고, 2026년 내내 산업 표준 용어로 굳었다. 핵심 하위 개념 네 가지가 모두 현장 용어가 됨:
- context rot(컨텍스트 부패): 컨텍스트가 길어질수록 그 안의 정보를 정확히 꺼내 쓰는 능력이 떨어지는 현상. 정보가 "들어 있는데도" 성능이 내려간다는 점이 핵심.
- just-in-time retrieval(적시 검색): 미리 다 퍼담지 않고 가벼운 참조(파일 경로, ID)만 들고 있다가 필요할 때 도구로 꺼내오기. Claude Code의 기본 동작 철학.
- compaction(압축/요약 이월): 한계 근처에서 지금까지의 작업을 요약해 새 창으로 이어 가기. 2026년 주요 랩이 공통 채택.
- structured note-taking(외부 메모): 컨텍스트 밖 파일에 진행 상태를 적어두고 다시 읽기.
- sub-agent(서브에이전트): 깨끗한 컨텍스트로 좁은 일을 시키고 요약만 회수.

**과장 경계:** "context engineering이 프롬프트 엔지니어링을 대체했다"류의 마케팅 글이 범람. 실체는 위 5개 기법일 뿐이며, 나머지는 대부분 재포장. arXiv의 ACC/self-compaction류 논문은 아직 연구 단계 — 가이드에는 개념만.

**하네스/루프 연결:** 정확히 하네스 엔지니어링의 이론적 근거. Guides(CLAUDE.md/Skills)는 "무엇을 항상 컨텍스트에 둘까"의 답이고, Sensors(테스트·린트·타입체커 출력)는 "매 루프마다 어떤 토큰을 되먹일까"의 답이다. context rot은 루프 엔지니어링에서 "왜 긴 세션을 끊고 새로 시작해야 하는가"의 근거.

**Claude Code 예:** `/compact` (수동 압축), `/clear` (세션 리셋), 계획을 `plan.md`에 적고 매 턴 다시 읽히기, `@경로` 임포트로 필요한 것만 로드.

**출처:**
- https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- https://www.fundesk.io/context-engineering-techniques-ai-coding-agents-2026
- https://sourcegraph.com/blog/context-engineering

**추천: MUST-TEACH** — 하네스/루프의 "왜"를 설명하는 유일한 상위 개념. 이게 없으면 나머지가 그냥 팁 모음이 된다.

---

## 2. AGENTS.md — 에이전트 지침 파일 표준

**정의:** 도구 중립적으로 "이 저장소에서 에이전트가 알아야 할 것"(빌드/테스트 명령, 코드 컨벤션, 아키텍처 결정)을 적는 저장소 루트 마크다운 파일. 에이전트용 README.

**왜 지금 뜨는가 / 성숙도:** 확립됨. Linux Foundation 산하 Agentic AI Foundation이 관리하고, 6만 개 이상 오픈소스 저장소가 채택. Codex, Cursor, Copilot, Gemini CLI, Zed, Jules, Devin, Junie 등이 네이티브로 읽음.

**CLAUDE.md와의 관계 (중요, 오해 많음):** Claude Code는 AGENTS.md를 자동으로 읽지 **않는다**. CLAUDE.md만 읽는다. "폴백으로 읽는다"는 주장은 사실이 아님. 실무 해법 두 가지:
- CLAUDE.md 맨 위에 `@AGENTS.md` 한 줄 임포트 (권장, 최대 4단계 재귀 임포트 지원)
- `ln -s AGENTS.md CLAUDE.md` 심볼릭 링크
권장 구조: AGENTS.md = 팀 공용 단일 원본, CLAUDE.md = Claude 전용 얇은 레이어 + 임포트.

**과장 경계:** 파일만 놓는다고 동작이 바뀌진 않음. "무엇을 하지 말라"보다 "이 명령을 실행하라"처럼 검증 가능한 지시가 실제로 효과가 있다는 게 현장 보고.

**하네스/루프 연결:** Guides의 최소 단위이자 진입점. 하네스 엔지니어링 첫 실습 대상.

**Claude Code 예:** 프로젝트 루트 `CLAUDE.md` 첫 줄에 `@AGENTS.md`; 메모리 계층은 enterprise policy → 프로젝트 CLAUDE.md → `~/.claude/CLAUDE.md`.

**출처:**
- https://agents.md/
- https://code.claude.com/docs/en/memory
- https://www.iuriio.com/blog/posts/2026/05/agents-md-field-guide-2026
- https://gist.github.com/yurukusa/d36197848911f025add142abefcde685
- https://blakecrosley.com/blog/agents-md-patterns

**추천: MUST-TEACH** — 단, 독립 장이 아니라 Guides 장 안의 절로. 핵심 교육 포인트는 "이식성"과 "Claude Code는 자동으로 안 읽는다"는 함정.

---

## 3. Agent Skills / Progressive Disclosure — 에이전트 스킬 / 점진적 공개

**정의:** 절차적 지식을 `SKILL.md`(이름+설명 메타데이터 + 지침) 한 장을 중심으로 스크립트·참조자료·템플릿을 묶은 폴더로 포장하고, 필요할 때만 컨텍스트에 로드하는 형식.

**동작(3단계 점진적 공개):** ① 발견 — 시작 시 이름과 설명만(스킬당 수십~백 토큰) 로드 ② 활성화 — 작업이 설명과 맞으면 SKILL.md 전문을 읽음(권장 5,000토큰 미만) ③ 실행 — 필요 시 번들 파일/스크립트를 추가로 열거나 돌림.

**왜 지금 뜨는가 / 성숙도:** 크로스벤더 표준으로 실제 정착. Anthropic이 만들어 오픈 표준으로 공개(agentskills.io), 현재 Claude Code·Codex/ChatGPT·Cursor·GitHub Copilot·VS Code·Gemini CLI·Goose·OpenHands·Amp·Kiro·JetBrains Junie·Roo Code·Laravel Boost 등 40개 넘는 클라이언트가 지원. MCP가 "도구 연결" 표준이라면 Skills는 "노하우 배포" 표준이라는 구도가 굳었다.

**과장 경계:** 스킬을 많이 만들수록 좋다는 착각. 설명이 겹치는 스킬끼리 잘못 골리는 문제(동일 역량 모호성)가 연구 주제로 올라올 만큼 실재. 5개 잘 쓰는 편이 50개보다 낫다.

**하네스/루프 연결:** Guides의 확장 형태 — "항상 로드"(CLAUDE.md)와 "조건부 로드"(Skills)의 구분이 곧 컨텍스트 예산 설계. 점진적 공개는 context rot에 대한 구조적 대응.

**Claude Code 예:** `.claude/skills/<name>/SKILL.md` (프로젝트) 또는 `~/.claude/skills/` (개인). 프론트매터의 `description`이 곧 라우팅 신호이므로 "언제 쓰는지"를 명시.

**출처:**
- https://agentskills.io/
- https://code.claude.com/docs/en/skills
- https://aipositive.substack.com/p/progressive-disclosure-matters

**추천: MUST-TEACH** — 하네스 엔지니어링의 실전 배포 단위. AGENTS.md 다음 단계로 자연스럽게 이어짐.

---

## 4. Sandboxing & Permission Governance — 샌드박싱과 권한 거버넌스

**정의:** 에이전트가 실행하는 셸 명령의 파일 접근 범위와 네트워크 도착지를 OS 수준에서 미리 못 박아, 매 명령 승인 없이도 안전하게 자율 실행시키는 것.

**왜 지금 뜨는가 / 성숙도:** 확립됨이자 필수. 자율성이 올라갈수록 "매번 승인"은 붕괴하므로 경계를 사전 선언하는 쪽으로 이동. 2026년에는 에이전트 egress가 데이터 유출 경로가 된 사례와 CVE도 보고됨(CVE-2026-25725) — 즉 "켜면 끝"이 아니라 실제 공격면.

**Claude Code 구체 사양(문서 확인):**
- `/sandbox` 슬래시 명령 → Mode / Overrides / Config 탭
- macOS는 Seatbelt 내장, Linux/WSL2는 `bubblewrap` + `socat` 필요(옵션 seccomp 필터는 `npm i -g @anthropic-ai/sandbox-runtime`), 네이티브 Windows 미지원
- settings.json 키: `sandbox.enabled`, `sandbox.failIfUnavailable`, `sandbox.allowUnsandboxedCommands`(false = strict 모드), `sandbox.excludedCommands`, `sandbox.filesystem.allowWrite / denyWrite / allowRead / denyRead / disabled`, `sandbox.network.*`
- 기본값: 작업 디렉터리 + 세션 임시 디렉터리에만 쓰기 가능, 네트워크는 도메인 승인제(프록시 경유)
- 탈출구: 샌드박스에서 실패한 명령을 `dangerouslyDisableSandbox`로 재시도 → 일반 권한 흐름으로 회귀. 이걸 항상 묻게 하려면 `Bash(dangerouslyDisableSandbox:true)` ask 규칙 추가
- deny 규칙은 샌드박스 안에서도 항상 우선. 조직 강제는 managed settings

**하네스/루프 연결:** 하네스의 "안전 경계"층. 루프 엔지니어링 관점에서는 승인 프롬프트가 곧 루프 정지점이므로, 샌드박스는 루프 처리량을 올리는 장치이기도 하다(안전 + 속도가 같은 방향).

**출처:**
- https://code.claude.com/docs/en/sandboxing
- https://code.claude.com/docs/en/permissions
- https://www.claudedirectory.org/blog/claude-code-permissions-guide
- https://www.penligent.ai/hackinglabs/claude-code-sandbox-bypass/

**추천: MUST-TEACH** — 신입 대상 가이드에서 가장 실수 비용이 큰 영역이고, Claude Code에 구체 설정이 다 있어 실습이 쉽다.

---

## 5. Evals for Agents — 에이전트 평가/회귀 스위트

**정의:** 에이전트 산출물과 궤적을 반복 측정 가능한 기준으로 채점해, 프롬프트·스킬·설정 변경이 개선인지 회귀인지 판정하는 체계.

**핵심 구분(가르칠 포인트):**
- objective gates(객관 게이트): 테스트 통과, 타입체크, 린트, 빌드, 정확 파일 diff — 가능하면 무조건 이쪽. 싸고 결정적.
- LLM-as-judge: 주관적 기준(설명 품질, 요구사항 충족)에만. 반드시 루브릭 + 기준 예시 + 인간 스팟체크와 함께.
- trajectory eval(궤적 평가): 결과뿐 아니라 어떤 도구를 어떤 순서로 호출했는지 채점. 2026년에 outcome/trajectory/system 3계층을 동등하게 보는 게 표준 관점.
- 회귀 스위트는 실제 실패 사례에서 만든다 — 합성 케이스보다 프로덕션 트레이스가 낫다는 게 공통 조언.

**성숙도:** 개념은 확립, 도구는 파편화. DeepEval, Braintrust(PR 코멘트로 회귀 리포트), Galileo, LangSmith 등 — 아직 승자 없음. 초심자 가이드에서 특정 벤더를 가르치면 수명이 짧다.

**과장 경계:** LLM-as-judge를 만능으로 쓰는 흐름은 명백한 과열. 판정자 자체가 편향되고 비용이 들며, 컴파일러가 답을 아는 문제에 LLM을 쓰는 건 낭비.

**하네스/루프 연결:** Sensors의 상위 개념 — 루프 안 센서가 "한 턴의 피드백"이라면 eval은 "하네스 전체의 피드백". 하네스를 고칠 때 개선 여부를 알 수 있는 유일한 수단.

**Claude Code 예:** `claude plugin eval`(플러그인/스킬 eval 스위트 실행, JSON 리포트, CI 연동), `/skill-doctor` 리포트. 가벼운 자작: 시나리오 프롬프트 N개를 `claude -p "..."` 헤드리스로 돌리고 종료코드·테스트 결과를 스코어로 집계하는 셸 스크립트.

**출처:**
- https://www.confident-ai.com/blog/llm-agent-evaluation-complete-guide
- https://deepeval.com/blog/llm-as-a-judge
- https://www.augmentcode.com/tools/best-ai-agent-evaluation-tools

**추천: MUST-TEACH (원리만, 벤더 무관)** — 단 "객관 게이트 우선, LLM 판정은 보조"라는 규범을 못 박는 형태로.

---

## 6. Spec-Driven Development (SDD) — 명세 주도 개발

**정의:** 사람이 읽고 합의한 명세를 1차 산출물로 두고, 코드는 그 명세로부터 (에이전트가) 재생성 가능한 2차 산출물로 취급하는 방식. 전형적 파이프라인: constitution → spec → plan → tasks → implement.

**성숙도(2026):** 여전히 현행이며 오히려 확산. GitHub Spec Kit는 파이썬 CLI(`specify`)로 28개 이상 에이전트 플랫폼을 지원하며 stars 8만대. AWS Kiro, OpenSpec, BMAD, Tessl, Google Antigravity 등 각 벤더가 자기 버전을 출하.

**과장 경계 (중요):** "재작업 60~80% 감소" 같은 수치는 커뮤니티 자가보고이며 통제 실험이 아니다. 그대로 인용하지 말 것. 또한 소규모 변경에 4단계 파이프라인을 강제하면 순수 오버헤드다. 신입에게 가르칠 실질은 도구가 아니라 습관: **코드를 쓰기 전에 계획 문서를 만들고 사람이 승인한다.**

**하네스/루프 연결:** 루프 엔지니어링의 상류 통제. 계획 문서는 컨텍스트 밖 메모(structured note-taking) 역할도 하므로 긴 작업에서 context rot 방어에도 기여.

**Claude Code 예:** Plan Mode(Shift+Tab으로 진입, 읽기만 하고 계획 제시 → 승인 후 실행), 계획을 `docs/plan-xxx.md`로 커밋 후 매 세션 `@`로 로드. Spec Kit은 Claude Code 통합을 공식 지원.

**출처:**
- https://github.com/github/spec-kit
- https://developer.microsoft.com/blog/spec-driven-development-ai-native-engineering/
- https://dev.to/krlz/spec-driven-development-in-2026-what-it-is-the-tooling-and-how-teams-actually-use-it-2fk2

**추천: WORTH-A-SECTION** — Spec Kit 툴체인이 아니라 Plan Mode + 계획 문서 습관으로 축소해서 가르칠 것.

---

## 7. Parallel Agent Orchestration — 병렬 에이전트 오케스트레이션

**정의:** 여러 에이전트를 각자 격리된 작업 트리에서 동시에 돌리고, 결과를 사람이 검토·병합하는 실행 모델. 변형으로 maker/checker(작성자와 검증자 분리).

**성숙도:** 기법 자체는 실전, 툴 생태계는 격변 중. git worktree 기반 격리는 안정적이고 무료. GUI 오케스트레이터(Conductor, Emdash, Vibe Kanban, Claude Squad, Nimbalyst 등)는 부침이 심함 — Crystal은 2026년 2월 중단.

**과장 경계:** "에이전트 3개 = 3배 처리량"은 과장. worktree는 파일 격리만 해결하고 두 트리가 같은 파일을 고칠 때 경고해주는 장치가 없다 — 병합 충돌과 통합 비용이 사람에게 그대로 넘어온다. 신입에게 6개 병렬을 권하면 리뷰 부하로 손해.

**실질적으로 가치 높은 축소판:** maker/checker. 구현한 세션이 자기 코드를 리뷰하면 확증 편향이 생기므로, 깨끗한 컨텍스트의 서브에이전트/새 세션에 검증만 맡긴다. 이건 병렬성보다 품질 장치다.

**하네스/루프 연결:** 루프 엔지니어링의 확장 — 단일 루프를 넓히는 대신 루프를 복제하고 컨텍스트를 분리. 서브에이전트는 Anthropic의 컨텍스트 엔지니어링 권고와 직결(깨끗한 창 + 요약만 회수).

**Claude Code 예:** `git worktree add ../feat-x -b feat-x` 후 각 트리에서 `claude` 실행; Task/서브에이전트로 검증 전담 에이전트 분리; `/code-review`.

**출처:**
- https://addyosmani.com/blog/code-agent-orchestra/
- https://www.augmentcode.com/guides/git-worktrees-parallel-ai-agent-execution
- https://www.augmentcode.com/tools/open-source-agent-orchestrators

**추천: WORTH-A-SECTION** — maker/checker와 worktree 격리 두 가지만. GUI 오케스트레이터 벤더 소개는 SKIP(수명 짧음).

---

## 8. Async / Long-Running & Scheduled Agents — 비동기·장시간·예약 에이전트

**정의:** 터미널을 붙잡지 않고 클라우드에서 스케줄·이벤트·API 트리거로 도는 에이전트.

**성숙도:** 신규, 부분적으로 프리뷰. Claude Code Routines(예약 클라우드 에이전트)는 2026년 4월 출시된 리서치 프리뷰. Managed Agents 쪽에는 cron + IANA 타임존 스케줄 배포가 있음. 즉 방향은 확실하지만 API/이름이 아직 움직인다.

**과장 경계:** 신입이 감독 없이 야간 자율 실행을 켜는 건 위험. 이 주제의 전제 조건은 6번(샌드박스)과 5번(eval 게이트)이다. 순서를 뒤집지 말 것.

**하네스/루프 연결:** 루프에서 사람을 제거했을 때 무엇이 남아야 하는가 — 답은 자동 센서와 하드 정지 조건. 좋은 마무리 장 소재.

**Claude Code 예:** `/schedule`(루틴 생성/조회), `claude -p "prompt"` 헤드리스 + cron/GitHub Actions(가장 이식성 높은 저비용 버전).

**출처:**
- https://makerkit.dev/blog/tutorials/claude-code-routines-guide
- https://www.developersdigest.tech/blog/claude-code-routines-vs-managed-agents-schedules

**추천: MENTION-ONLY** — 마지막 장 "다음 단계"에서 한 절. 프리뷰 기능에 지면 배분하면 가이드가 빨리 낡는다.

---

## 9. Self-Improving Harnesses — 자기개선 하네스

**정의:** 에이전트가 자기 실행 기록을 되돌아보고 재사용 가능한 규칙/스킬을 스스로 만들어 하네스에 축적하는 구조. 통상 관찰 → 반성 → 결정(반복 패턴만 스킬로 승격) 순환.

**성숙도:** 2026년 가장 뜨거운 연구 주제이자 가장 과열된 마케팅 용어. Lilian Weng의 harness 포스트, Prime Intellect의 Prime Agent(2026-08-05, 자기수정 하네스 + Continual Harness), SkillForge/MetaSkill-Evolve 등 논문 다수. 반면 프로덕션에서 검증된 신입용 실무는 거의 없음. 자동 승격은 노이즈를 영구 규칙으로 굳히는 실패 모드가 크다.

**신입에게 가치 있는 축소판(강력 추천):** 자동화 말고 **수동 회고 루프**. 세션 끝에 "이번에 내가 세 번 이상 고쳐준 지시가 뭐였지?"를 물어 CLAUDE.md나 스킬 한 줄로 승격시키기. 이게 하네스 엔지니어링을 "설정"이 아니라 "습관"으로 만드는 유일한 장치.

**하네스/루프 연결:** 하네스 엔지니어링의 메타 루프 자체. 가이드 전체를 닫는 논리적 결론.

**Claude Code 예:** 세션 말미 프롬프트 "이번 세션에서 반복 교정된 지시를 CLAUDE.md 규칙 후보로 3개 이하 제안해줘"; Stop 훅으로 회고 트리거; `/fewer-permission-prompts`(트랜스크립트에서 허용 규칙을 뽑아 settings.json에 반영 — 실제 동작하는 자기개선 사례).

**출처:**
- https://lilianweng.github.io/posts/2026-07-04-harness/
- https://bdtechtalks.com/2026/07/13/ai-agents-self-improving-harness/
- https://arxiv.org/html/2606.09498v1
- https://www.nextbigfuture.com/2026/08/self-improving-harness-self-improving-coding-and-research-agent.html

**추천: WORTH-A-SECTION (수동 회고 버전만)** — 자동 자기개선 프레임워크는 MENTION-ONLY. 하이프 경고를 명시할 것.

---

## 10. 기타 발견

### 10a. "Harness Engineering"이 학술 용어가 되었다
2026년 arXiv에 harness engineering을 명시적 프레이밍으로 쓰는 논문이 다수(SemaClaw, Externalization in LLM Agents 리뷰, 터미널 코딩 에이전트 스캐폴딩 논문). 가이드의 축 자체가 시류에 맞다는 방어 근거로 서문에 인용할 만함.
- https://arxiv.org/pdf/2604.11548 , https://arxiv.org/pdf/2604.08224 , https://arxiv.org/pdf/2603.05344
**추천: MENTION-ONLY (서문 각주)**

### 10b. Tool output이 컨텍스트를 먹는다 — 도구 설계
ReAct 루프에서 도구 관측치가 토큰 예산의 70~80%를 차지한다는 보고. 대응은 도구가 요약된 결과만 돌려주게 하거나, 셸에서 `| head`, `--quiet`, 파일로 리다이렉트 후 grep. 신입이 즉시 체감하는 실전 팁.
- https://www.fundesk.io/context-engineering-techniques-ai-coding-agents-2026
**추천: MUST-TEACH (Sensors 장 안의 실습 절)** — 별도 기법이 아니라 Sensors 설계 규칙으로.

### 10c. Eval → 런타임 가드레일 전환
사전 평가 스코어를 그대로 프로덕션 가드레일로 승격시켜 도구 접근·에스컬레이션을 제어하는 패턴(2026 초 등장). 엔터프라이즈 문맥. 신입 가이드에는 이르다.
**추천: SKIP**

### 10d. MCP
여전히 도구 연결 표준으로 건재하지만 2026년 기준 "새 트렌드"가 아니라 배경 인프라. Skills(노하우)와 MCP(도구/데이터 접근)의 역할 구분만 한 문단.
**추천: MENTION-ONLY**

---

# RANKED SHORTLIST — 8장 가이드에 추가할 상위 4개

| 순위 | 기법 | 배치 | 이유 |
|---|---|---|---|
| **1** | **Context Engineering (컨텍스트 엔지니어링)** — context rot / 적시 검색 / compaction / 외부 메모 / 서브에이전트 | **2장 근처, 하네스·루프 정의 직후의 이론 장**. 이후 모든 장이 여기로 소급 설명됨 | 하네스와 루프가 "왜" 필요한지에 대한 유일한 1차 출처 기반 설명. Anthropic 공식 프레이밍이라 수명이 길다. 10b(도구 출력 다이어트)를 Sensors 절에 붙여 실습화 |
| **2** | **Guides 이식성 & 조건부 로드 = AGENTS.md + Agent Skills** | **Guides 장(하네스 엔지니어링 장) 안의 2개 절**로 통합 | 둘 다 크로스벤더 표준으로 확정(AGENTS.md 6만+ 저장소 / Skills 40+ 클라이언트). "항상 로드 vs 조건부 로드"라는 컨텍스트 예산 관점으로 묶으면 1번과 한 몸이 된다. Claude Code가 AGENTS.md를 자동으로 안 읽는다는 함정을 반드시 명시 |
| **3** | **Sandboxing & 권한 거버넌스** | **루프 엔지니어링 장 바로 뒤 독립 절 또는 짧은 장**. 자율성을 올리는 법을 가르친 직후 | 자율성 ↑ = 사고 비용 ↑. `/sandbox`, `sandbox.filesystem.*`, `allowUnsandboxedCommands:false`, `dangerouslyDisableSandbox` ask 규칙까지 전부 문서화된 구체 실습이 가능. 신입에게 가장 회수율 높은 안전 투자 |
| **4** | **Evals: 객관 게이트 우선 + 회귀 스위트 (LLM-as-judge는 보조)** | **마지막에서 두 번째 장 — Sensors 장의 확장/후속** | 하네스를 고쳤을 때 나아졌는지 알 방법이 없으면 하네스 엔지니어링은 미신이 된다. 벤더 중립으로: 테스트/타입체크 게이트 + 실패 사례에서 자란 시나리오 스위트 + `claude -p` 헤드리스 배치. 여기에 9번의 **수동 회고 루프**를 마지막 절로 붙여 "측정 → 규칙 승격"으로 가이드를 닫는다 |

**의도적으로 넣지 않은 것:** SDD 툴체인(Spec Kit)은 Plan Mode 한 절로 축소, 병렬 오케스트레이션은 maker/checker 한 절로 축소, 클라우드 루틴은 마지막 장 "다음 단계" 언급, 자동 자기개선 프레임워크와 런타임 eval 가드레일은 제외(프리뷰/엔터프라이즈/과열).
