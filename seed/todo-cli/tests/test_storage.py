"""시드 코드의 최소 테스트. 지금은 통과하지 않는다."""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import storage  # noqa: E402


def test_add_appends_a_todo():
    todos = storage.add("첫 번째 할 일", [])
    assert len(todos) == 1
    assert todos[0]["title"] == "첫 번째 할 일"
    assert todos[0]["done"] is False


def test_add_does_not_leak_between_calls():
    """add() 를 인자 없이 두 번 부르면 서로 영향을 주면 안 된다."""
    first = storage.add("A")
    second = storage.add("B")
    assert len(first) == 1
    assert len(second) == 1


def test_list_numbering_matches_done_command():
    """`list` 가 1번으로 보여준 항목은 `done 1` 로 완료되어야 한다."""
    todos = [{"title": "A", "done": False}, {"title": "B", "done": False}]
    line = storage.format_line(1, todos[0])
    assert line.startswith("[ ] 1.")
    storage.complete(todos, 1)
    assert todos[0]["done"] is True, "list 의 1번과 done 1 이 가리키는 항목이 다르다"
