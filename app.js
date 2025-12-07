// app.js

// ----- Constants -----
const API_URL = 'https://jsonplaceholder.typicode.com/todos';
const STORAGE_KEY = 'todos_20';

// ----- Utility: Local Storage -----
function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function getTodos() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function clearTodos() {
    localStorage.removeItem(STORAGE_KEY);
}

// ----- API: Fetch -----
async function fetchTodos() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
    const data = await res.json();
    // Store only first 20
    const first20 = data.slice(0, 20);
    saveTodos(first20);
    return first20;
}

// ----- Rendering -----
function renderTodos() {
    const listEl = document.getElementById('todoList');
    const emptyMsgEl = document.getElementById('emptyMsg');

    const todos = getTodos();
    listEl.innerHTML = ''; // Clear existing

    if (todos.length === 0) {
        emptyMsgEl.style.display = 'block';
        return;
    } else {
        emptyMsgEl.style.display = 'none';
    }

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        const left = document.createElement('div');
        left.className = 'todo-left';

        const title = document.createElement('span');
        title.textContent = todo.title;

        const status = document.createElement('span');
        status.className = `status ${todo.completed ? 'complete' : 'incomplete'}`;
        status.textContent = todo.completed ? 'Completed' : 'Incomplete';

        left.appendChild(status);
        left.appendChild(title);

        const actions = document.createElement('div');
        actions.className = 'todo-actions';

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle';
        toggleBtn.textContent = 'Toggle';
        toggleBtn.addEventListener('click', () => toggleTodo(todo.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        actions.appendChild(toggleBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(left);
        li.appendChild(actions);

        listEl.appendChild(li);
    });
}

// ----- Actions: Delete -----
function deleteTodo(id) {
    const todos = getTodos();
    const updated = todos.filter(t => t.id !== id);
    saveTodos(updated);
    renderTodos(); // Re-render without page refresh
}

// ----- Actions: Toggle Completed (Bonus) -----
function toggleTodo(id) {
    const todos = getTodos();
    const updated = todos.map(t =>
        t.id === id ? {...t, completed: !t.completed } : t
    );
    saveTodos(updated);
    renderTodos(); // Re-render
}

// ----- Init & Event Listeners -----
async function init() {
    // If no todos saved yet, prompt user to load or auto-load:
    const existing = getTodos();
    if (existing.length > 0) {
        renderTodos();
    }
}

document.addEventListener('DOMContentLoaded', init);

document.getElementById('loadBtn').addEventListener('click', async() => {
    try {
        await fetchTodos();
        renderTodos();
    } catch (err) {
        alert('Error loading todos. Please try again.');
        console.error(err);
    }
});

document.getElementById('clearBtn').addEventListener('click', () => {
    clearTodos();
    renderTodos();
});