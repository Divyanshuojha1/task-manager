const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompleted");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");
const emptyState = document.getElementById("emptyState");

// Edit Modal
const editModal = document.getElementById("editModal");
const editInput = document.getElementById("editInput");
const cancelEdit = document.getElementById("cancelEdit");
const saveEdit = document.getElementById("saveEdit");

// STATE
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let editingTaskId = null;

// INIT
renderTasks();
updateCounter();
toggleEmptyState();


// ADD TASK
taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const text = taskInput.value.trim();
    if (text === "") return;

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveToLocalStorage();
    renderTasks();
    updateCounter();
    toggleEmptyState();

    taskInput.value = "";
});


// RENDER TASKS
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "completed") return task.completed;
        if (currentFilter === "pending") return !task.completed;
        return true;
    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div class="task-row">
                <div class="task-left">
                    <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}">
                    <span class="${task.completed ? "completed-text" : ""}">
                        ${task.text}
                    </span>
                </div>
                <div class="task-actions">
                    <button class="edit-btn" data-id="${task.id}">Edit</button>
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </div>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// TASK ACTIONS
taskList.addEventListener("click", function (e) {

    const id = Number(e.target.dataset.id);

    // DELETE
    if (e.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(task => task.id !== id);
        saveToLocalStorage();
        renderTasks();
        updateCounter();
        toggleEmptyState();
    }

    // EDIT
    if (e.target.classList.contains("edit-btn")) {

        const task = tasks.find(task => task.id === id);

        editingTaskId = id;
        editInput.value = task.text;

        editModal.classList.add("active");
        editInput.focus();
    }
});

// SAVE EDIT
saveEdit.addEventListener("click", function () {

    const updatedText = editInput.value.trim();
    if (updatedText === "") return;

    const task = tasks.find(task => task.id === editingTaskId);
    task.text = updatedText;

    saveToLocalStorage();
    renderTasks();
    updateCounter();

    closeModal();
});

// CANCEL EDIT
cancelEdit.addEventListener("click", closeModal);

// Close modal function
function closeModal() {
    editModal.classList.remove("active");
    editingTaskId = null;
    editInput.value = "";
}

// COMPLETE TOGGLE
taskList.addEventListener("change", function (e) {

    if (e.target.type === "checkbox") {

        const id = Number(e.target.dataset.id);
        const task = tasks.find(task => task.id === id);

        task.completed = e.target.checked;

        saveToLocalStorage();
        renderTasks();
        updateCounter();
    }
});


// FILTER
filterButtons.forEach(button => {
    button.addEventListener("click", function () {

        document.querySelector(".filter-btn.active").classList.remove("active");
        button.classList.add("active");

        currentFilter = button.dataset.filter;
        renderTasks();
    });
});


// CLEAR COMPLETED
clearCompletedBtn.addEventListener("click", function () {

    tasks = tasks.filter(task => !task.completed);
    saveToLocalStorage();
    renderTasks();
    updateCounter();
    toggleEmptyState();
});

// COUNTER
function updateCounter() {
    totalCount.textContent = tasks.length;
    completedCount.textContent = tasks.filter(t => t.completed).length;
    remainingCount.textContent = tasks.filter(t => !t.completed).length;
}

// LOCAL STORAGE
function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// EMPTY STATE
function toggleEmptyState() {
    emptyState.style.display = tasks.length === 0 ? "block" : "none";
}