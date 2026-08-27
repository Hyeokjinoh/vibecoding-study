"""할 일 관리 CLI."""
import sys

import storage


def main(argv):
    cmd = argv[1]
    todos = storage.load()

    if cmd == "add":
        todos = storage.add(argv[2], todos)
        storage.save(todos)
        print("추가됨: " + argv[2])
    elif cmd == "list":
        for i, t in enumerate(todos):
            print(storage.format_line(i + 1, t))
    elif cmd == "done":
        n = int(argv[2])
        todos = storage.complete(todos, n)
        storage.save(todos)
        print("완료: " + str(n))
    else:
        print("알 수 없는 명령: " + cmd)


if __name__ == "__main__":
    main(sys.argv)
