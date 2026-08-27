---
description: 근거 수집 → 집필 → 검증 순서로 새 챕터를 만든다
argument-hint: <챕터 번호> <주제>
allowed-tools: Task, Read, Write, Bash(./scripts/check-docs.sh)
---

새 챕터를 만든다: **$ARGUMENTS**

반드시 아래 순서를 지킨다. 순서를 건너뛰지 않는다.

1. `collector` 서브에이전트로 이 주제의 근거를 `docs/_facts/` 에 수집한다.
   공식 문서를 우선하고, 출처 URL 없는 사실은 버린다.
2. `writer` 서브에이전트로 챕터를 집필한다.
   **`docs/_facts/` 에 있는 내용만** 쓰게 한다.
3. `verifier` 서브에이전트로 검증한다. **집필한 에이전트가 검증하지 않는다.**
4. `./scripts/check-docs.sh` 를 실행한다.
5. `VERDICT: FAIL` 이면 결함을 `writer` 에게 되돌려 고치게 하고 3번으로 돌아간다.
   **최대 3회까지만 반복한다.** 3회 안에 통과하지 못하면 멈추고 사람에게 보고한다.

마지막에 무엇을 근거로 무엇을 썼는지 3줄로 요약한다.
