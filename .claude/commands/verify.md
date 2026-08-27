---
description: 문서 전체를 검증 에이전트와 스크립트로 점검한다
allowed-tools: Task, Bash(./scripts/check-docs.sh), Read, Grep, Glob
---

문서 전체를 검증한다.

1. `./scripts/check-docs.sh` 를 실행한다 (결정적 센서).
2. `verifier` 서브에이전트를 실행한다 (추론적 센서).
   특히 **인용 안전성**을 최우선으로 점검하게 한다.
3. 두 결과를 합쳐 심각도 순으로 보고한다.

**고치지 않는다. 판정만 보고한다.** 수정은 사람이 승인한 뒤에 한다.
