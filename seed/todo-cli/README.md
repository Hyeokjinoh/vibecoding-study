# seed/todo-cli — 실습용 시드 코드

작은 할 일 관리 CLI 입니다. **의도적으로 결함이 심어져 있습니다.**

이 코드는 고쳐야 할 대상이 아니라 **하네스를 씌워 볼 대상**입니다.
Part 2 에서 여기에 Guides(CLAUDE.md)와 Sensors(테스트·린터)를 붙이고,
Part 3 에서 루프를 돌려 결함을 자동으로 갈아냅니다.

## 실행

```bash
cd seed/todo-cli
python todo.py add "우유 사기"
python todo.py list
python todo.py done 1
```

## 테스트

```bash
python -m pytest seed/todo-cli/tests -q
```

**현재 테스트는 실패합니다.** 이것이 여러분의 첫 번째 센서입니다.

## 알려진 결함 (일부러 남겨둔 것)

의도적으로 목록을 공개하지 않습니다.
Part 2 에서 에이전트에게 찾게 하는 것이 실습입니다.
