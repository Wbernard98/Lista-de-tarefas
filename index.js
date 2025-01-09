const form = document.querySelector('#todo-form');
const taskTitleInput = document.querySelector('#task-title-input');
const todoListUl = document.querySelector('#todo-list');
let tasks = []; 

function updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTaskOnHTML(taskTitle, done = false) {
    const li = document.createElement('li');
    li.setAttribute('role', 'listitem');
    
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.checked = done;
    input.addEventListener('change', (event) => {
        const liToToggle = event.target.parentElement;
        const spanToToggle = liToToggle.querySelector('span');
        const done = event.target.checked;
        spanToToggle.style.textDecoration = done ? 'line-through' : 'none';

        tasks = tasks.map(t => t.title === spanToToggle.textContent ? { ...t, done } : t);
        updateLocalStorage();
    });

    const span = document.createElement('span');
    span.textContent = taskTitle;
    if (done) {
        span.style.textDecoration = 'line-through';
    }

    const button = document.createElement('button');
    button.textContent = 'Remover';
    button.addEventListener('click', (event) => {
        const liToRemove = event.target.parentElement;
        const spanToRemove = liToRemove.querySelector('span');

        if (!spanToRemove) {
            console.error('Erro: Não foi possível encontrar o span para remover.');
            return;
        }

        const titleToRemove = spanToRemove.textContent;
        tasks = tasks.filter(t => t.title !== titleToRemove);
        todoListUl.removeChild(liToRemove);
        updateLocalStorage();
    });

    li.appendChild(input);
    li.appendChild(span);
    li.appendChild(button);
    todoListUl.appendChild(li);
}

window.onload = () => {
    const tasksOnLocalStorage = localStorage.getItem('tasks');
    if (!tasksOnLocalStorage) return;

    tasks = JSON.parse(tasksOnLocalStorage);
    tasks.forEach(t => renderTaskOnHTML(t.title, t.done));
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskTitle = taskTitleInput.value.trim();
    if (taskTitle.length < 3) {
        alert('Sua tarefa precisa ter, pelo menos, 3 caracteres');
        return;
    }
    if (tasks.some(t => t.title === taskTitle)) {
        alert('Essa tarefa já existe!');
        return;
    }

    tasks.push({ title: taskTitle, done: false });
    updateLocalStorage();

    renderTaskOnHTML(taskTitle);
    taskTitleInput.value = '';
});
