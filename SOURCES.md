# 출처와 라이선스 고지

## 이 문서의 목적

이 저장소는 외부 자료를 **참조**하되 **복제하지 않습니다.**
아래는 참고한 자료의 목록과, 각 자료에 대해 이 저장소가 무엇을 했고 무엇을 하지 않았는지에 대한 기록입니다.

## 집필 원칙

1. **본문은 100% 직접 집필했습니다.** 외부 자료를 번역하거나 옮겨 적지 않았습니다.
2. **인용은 15단어 미만의 정의구에 한합니다.** 인용부호와 출처 링크를 반드시 붙였습니다.
3. **외부 이미지를 사용하지 않았습니다.** 모든 도식은 Mermaid 로 직접 그렸습니다.
4. 명령어 문법·설정 파일 키 이름 등 **사실 정보(facts)** 는 저작권 보호 대상이 아니며, 예제는 이 저장소의 맥락에 맞게 새로 작성했습니다.
5. 검증 에이전트가 **원문과 연속 15단어 이상 일치하는 문장이 없는지** 를 별도 항목으로 검사합니다. 이 항목은 하나라도 걸리면 전체 검증 실패로 처리합니다.

## 참고 자료 목록

| 자료 | 저작권 / 라이선스 | 이 저장소가 한 일 |
|---|---|---|
| [Harness Engineering for Coding Agent Users](https://martinfowler.com/articles/harness-engineering.html) — Birgitta Böckeler | © Martin Fowler, All rights reserved. 단, 사이트 FAQ 는 **링크백을 조건으로 한국어 번역을 허용** | 개념(Guides/Sensors, Computational/Inferential)을 이해 후 한국어로 새로 서술. 짧은 정의구 인용 시 출처 명시 |
| [Loop Engineering](https://addyosmani.com/blog/loop-engineering/) — Addy Osmani | © 2026 Addy Osmani, 별도 공개 라이선스 없음 | 용어(cognitive surrender, comprehension debt, intent debt)를 출처 명시하여 언급. 본문 복제 없음 |
| [Agent Harness Engineering](https://addyosmani.com/blog/agent-harness-engineering/) — Addy Osmani | 동일 | 하네스와 루프의 층위 관계만 참조 |
| [Claude Code 공식 문서](https://code.claude.com/docs/en/overview) | © Anthropic PBC, All rights reserved | 명령어·설정 문법 등 사실 정보만 참조. 설명 문장은 복제하지 않음 |
| [Claude Code Best Practices](https://code.claude.com/docs/en/best-practices) | © Anthropic PBC | 동일 |
| [Anthropic Engineering 블로그](https://www.anthropic.com/engineering) | © Anthropic PBC | 컨텍스트 엔지니어링·에이전트 패턴 개념 참조 |
| [anthropics/courses](https://github.com/anthropics/courses) | **CC BY-NC 4.0** | 링크로만 안내. 본 저장소는 이 자료의 파생물이 아님 |
| [anthropics/anthropic-cookbook](https://github.com/anthropics/anthropic-cookbook) | **MIT** | 링크로만 안내 |
| [Anthropic Academy](https://anthropic.skilljar.com/) | © 2026 Anthropic PBC, 재사용 라이선스 없음 | 코스 존재 사실과 링크만 안내. 내용 복제 없음 |
| [breim/loop-harness](https://github.com/breim/loop-harness) | MIT | 안전한 루프의 판단 기준을 참조 |

> ⚠️ **URL 이전 주의**: `docs.claude.com/en/docs/claude-code/*` 는 `code.claude.com/docs/en/*` 로 이전되었습니다(301). 이 저장소는 신 URL 을 사용합니다.

## 상표 고지

Claude, Claude Code, Anthropic 은 Anthropic PBC 의 상표입니다.
이 저장소는 [Anthropic 상표 가이드라인](https://www.anthropic.com/legal/trademark-guidelines)에 따라
**평문으로 제품을 지칭하는 용도로만** 상표를 사용하며, 로고를 사용하지 않습니다.

**이 저장소는 Anthropic PBC 와 제휴 관계가 없으며, 공식 자료가 아닙니다.**
개인이 학습 목적으로 작성한 비공식 스터디 자료입니다.

## 이 저장소의 라이선스

- 문서(`docs/`): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ko)
- 코드(`seed/`, `.claude/`, `.github/`, `scripts/`): [MIT](./LICENSE)

## 오류 신고

사실 오류나 저작권 우려를 발견하시면 [이슈](https://github.com/Hyeokjinoh/vibecoding-study/issues)를 열어 주세요.
확인 후 신속히 수정하겠습니다.
