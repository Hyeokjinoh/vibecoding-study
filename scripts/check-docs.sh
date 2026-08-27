#!/usr/bin/env bash
# 문서 구조 검증 스크립트 — 결정적(computational) 센서.
# 사람이 아니라 CI 와 에이전트가 읽는 것을 전제로, 짧고 기계가 읽기 좋은 출력을 낸다.
set -uo pipefail

fail=0
note() { printf '%s\n' "$1"; }
err()  { printf 'FAIL %s\n' "$1"; fail=1; }

note "== 1. 챕터 필수 섹션 =="
for f in docs/*.md; do
  base=$(basename "$f")
  case "$base" in index.md) continue ;; esac
  for section in "## 한 줄 요약" "## 직접 해보기" "## ✅ 자가 점검" "## 📎 출처"; do
    grep -qF "$section" "$f" || err "$base: 누락된 섹션 '$section'"
  done
  grep -qF "**검증일**" "$f" || err "$base: 검증일 메타 누락"
done

# 근거 노트(_facts/)는 검사 대상이 아니다. 원자료이지 발행 문서가 아니며,
# Jekyll 빌드에서도 제외된다(docs/_config.yml 의 exclude).
note "== 2. 금지된 외부 이미지 =="
if grep -rEn --exclude-dir=_facts '!\[[^]]*\]\(https?://' docs/ 2>/dev/null; then
  err "docs/: 외부 이미지 참조 발견 (Mermaid 로 직접 그릴 것)"
fi

note "== 3. 이전된 문서 URL =="
if grep -rn --exclude-dir=_facts 'docs.claude.com/en/docs/claude-code' docs/ 2>/dev/null; then
  err "docs/: 구 URL 사용. code.claude.com/docs/en/ 로 교체할 것"
fi

note "== 4. 코드 블록 짝 맞춤 =="
for f in docs/*.md; do
  n=$(grep -c '^```' "$f")
  [ $((n % 2)) -eq 0 ] || err "$(basename "$f"): 코드 블록 백틱이 홀수 개 ($n)"
done

# 주의: "명령이 실패했다"와 "테스트가 실패했다"는 다르다.
# pytest 가 없어서 난 실패를 테스트 실패로 착각하면 센서가 거짓 안심을 준다.
# 그래서 도구 존재를 먼저 확인하고, 종료 코드를 구분해서 읽는다.
note "== 5. 시드 코드 테스트 (실패가 정상) =="
if ! python3 -m pytest --version >/dev/null 2>&1; then
  err "pytest 가 설치되어 있지 않아 시드 테스트를 검사할 수 없다 (pip install pytest)"
else
  python3 -m pytest seed/todo-cli/tests -q >/dev/null 2>&1
  case "$?" in
    0) err "seed/todo-cli: 테스트가 전부 통과함. 실습용 결함이 사라졌다" ;;
    1) note "OK  시드 테스트가 예상대로 실패한다" ;;
    *) err "seed/todo-cli: pytest 가 비정상 종료했다 (수집 오류 등). 종료 코드 $?" ;;
  esac
fi

note "== 6. 라이선스 고지 =="
for f in LICENSE LICENSE-docs SOURCES.md; do
  [ -f "$f" ] || err "$f 파일 없음"
done

if [ "$fail" -eq 0 ]; then note "VERDICT: PASS"; else note "VERDICT: FAIL"; fi
exit "$fail"
