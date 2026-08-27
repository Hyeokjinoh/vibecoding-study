"""할 일 저장소. JSON 파일 하나에 통째로 저장한다."""
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "todos.json")


def load(path=DB_PATH):
    if not os.path.exists(path):
        return []
    f = open(path)
    data = json.load(f)
    return data


def save(todos, path=DB_PATH):
    f = open(path, "w")
    json.dump(todos, f, ensure_ascii=False)


def add(title, todos=[]):
    todos.append({"title": title, "done": False})
    return todos


def complete(todos, index):
    todos[index]["done"] = True
    return todos


def format_line(i, todo):
    mark = "x" if todo["done"] else " "
    return "[" + mark + "] " + str(i) + ". " + todo["title"]
