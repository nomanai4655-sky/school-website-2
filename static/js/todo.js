// ---------- Student To-Do List ----------
// Saved in the browser's localStorage, so it's per-device/per-browser —
// not synced across devices and not stored on the server.

const TODO_KEY = "student_todo_list";

function loadTodos() {
    const data = localStorage.getItem(TODO_KEY);
    return data ? JSON.parse(data) : [];
}

function saveTodos(todos) {
    localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

function renderTodos() {
    const list = document.getElementById("todo-list");
    if (!list) return;

    const todos = loadTodos();
    list.innerHTML = "";

    if (todos.length === 0) {
        const empty = document.createElement("li");
        empty.className = "todo-empty";
        empty.textContent = "No tasks yet. Add one above!";
        list.appendChild(empty);
        return;
    }

    todos.forEach(function (todo, index) {
        const item = document.createElement("li");
        item.className = "todo-item" + (todo.done ? " todo-done" : "");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.done;
        checkbox.onchange = function () { toggleTodo(index); };

        const span = document.createElement("span");
        span.textContent = todo.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "✕";
        deleteBtn.className = "todo-delete";
        deleteBtn.onclick = function () { deleteTodo(index); };

        item.appendChild(checkbox);
        item.appendChild(span);
        item.appendChild(deleteBtn);
        list.appendChild(item);
    });
}

function addTodo() {
    const input = document.getElementById("todo-input");
    const text = input.value.trim();
    if (!text) return;

    const todos = loadTodos();
    todos.push({ text: text, done: false });
    saveTodos(todos);
    input.value = "";
    renderTodos();
}

function toggleTodo(index) {
    const todos = loadTodos();
    todos[index].done = !todos[index].done;
    saveTodos(todos);
    renderTodos();
}

function deleteTodo(index) {
    const todos = loadTodos();
    todos.splice(index, 1);
    saveTodos(todos);
    renderTodos();
}

document.addEventListener("DOMContentLoaded", function () {
    renderTodos();
    const input = document.getElementById("todo-input");
    if (input) {
        input.addEventListener("keypress", function (e) {
            if (e.key === "Enter") addTodo();
        });
    }
});
