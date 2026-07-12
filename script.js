// Load tasks from localStorage, or 
// start with an empty array if none exist.
let 
tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Current filter state: "all", "pending", or "completed".
let currentFilter = "all";

// Grab DOM elements from the page once so we can reuse them.
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const counter = document.getElementById("counter");
const emptyMessage = document.getElementById("emptyMessage");

// When the Add button is clicked, add a new task.
addBtn.addEventListener("click", addTask);

// When the user presses Enter inside the input, add the task too.
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Add a new task to the list.
function addTask() {
    const text = taskInput.value.trim();

    // Do not add empty tasks.
    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    /* Create a task object with a unique id, the task text, 
     and a done flag.*/
    const task = {
        id: Date.now(),
        text: text,
        done: false
    };

    /* Add the task, save to localStorage, 
    clear the input, and re-render. */
    tasks.push(task);
    saveTasks();
    taskInput.value = "";
    renderTasks();
}

// Render the visible task list based on the current filter.
function renderTasks() {
    taskList.innerHTML = ""; // Clear the current list.

    let filteredTasks = tasks;

    // Only show pending tasks when the filter is "pending".
    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.done);
    }

    // Only show completed tasks when the filter is "completed".
    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.done);
    }

    // Show or hide the "no tasks" message.
    emptyMessage.style.display = filteredTasks.length === 0 ? "block" : "none";

    // Create DOM elements for each filtered task.
    filteredTasks.forEach(function(task) {
        const li = document.createElement("li");
        const left = document.createElement("div");
        left.className = "task";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.done;

        // Toggle the task's done state when the checkbox changes.
        checkbox.addEventListener("change", function() {
            task.done = !task.done;
            saveTasks();
            renderTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;

        // Apply a completed style if the task is done.
        if (task.done) {
            span.classList.add("completed");
        }

        // Also toggle done when the task text is clicked.
        span.addEventListener("click", function() {
            task.done = !task.done;
            saveTasks();
            renderTasks();
        });

        left.appendChild(checkbox);
        left.appendChild(span);

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        // Remove the task when the Delete button is clicked.
        deleteBtn.addEventListener("click", function() {
            tasks = tasks.filter(function(item) {
                return item.id !== task.id;
            });
            saveTasks();
            renderTasks();
        });

        li.appendChild(left);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    updateCounter();
}

// Update the completed tasks counter text.
function updateCounter() {
    const completed = tasks.filter(task => task.done).length;
    counter.textContent = completed + " of " + tasks.length + " tasks completed";
}

// Save the current tasks array to localStorage.
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Change the current filter and re-render.
function setFilter(filter) {
    currentFilter = filter;
    renderTasks();
}

// Render tasks on initial page load.
renderTasks();
