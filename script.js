const STATE = {
    EDITING: 0,
    DELETING: 1,
    NORMAL: 2,
}

const defaultPlaceholder = "Escreva aqui a sua tarefa..."

const inputField = document.getElementById("input-field");
const taskList = document.getElementById("task-list");
const deleteModeButton = document.getElementById("delete-mode-button");
const editModeButton = document.getElementById("edit-mode-button");

const buttons = [editModeButton, deleteModeButton];
const tasks = [];

let currentState = STATE.NORMAL;
let currentTask = "";
updateState(currentState);

//#region listeners
inputField.addEventListener("keydown", inputField_keydown);
deleteModeButton.addEventListener("click", deleteModeButton_click);
editModeButton.addEventListener("click", editModeButton_click);
//#endregion

//#region callbacks
function inputField_keydown(event) {
    resetPlaceholder();

    if (event.key === "Enter") {
        sendInput();
    }
}

function deleteModeButton_click() {
    if (currentState === STATE.DELETING) {
        updateState(STATE.NORMAL);
    } else {
        updateState(STATE.DELETING);
    }
}

function editModeButton_click() {
    if (currentState === STATE.EDITING) {
        updateState(STATE.NORMAL);
    } else {
        updateState(STATE.EDITING);
    }
}

function task_click(element) {
    if (currentState === STATE.DELETING) {
        const index = tasks.indexOf(element.innerHTML);
        if (index !== -1) {
            tasks.splice(index, 1);  
            generateTaskList();    
        }
    }

    if (currentState === STATE.EDITING) {
        currentTask = element.innerHTML;
        inputField.value = element.innerHTML;
    }
}
//#endregion
 
function resetPlaceholder() {
    if (inputField.placeholder != defaultPlaceholder) {
        inputField.classList.remove("error");
        inputField.placeholder = defaultPlaceholder;
    }
}

function sendInput() {
    if (currentState === STATE.EDITING && tasks.indexOf(currentTask) !== -1) {
        editTask(inputField.value, tasks.indexOf(currentTask))
        currentTask = "";
    } else {
        addTask(inputField.value);
    }

    generateTaskList();
    inputField.value = "";
}

function updateState(newState) {
    currentState = newState;

    for (let i = 0; i < buttons.length; i++) {
        if (i == currentState) {
            buttons[i].classList.add("active");
            continue;
        }

        buttons[i].classList.remove("active");
    }
}

function editTask(task, i) {
    task = task.trim();
    if (task.length === 0) return; 

    if (tasks.includes(task)) {
        inputField.placeholder = "Essa tarefa já existe!";
        inputField.classList.add("error");
        return;
    }
    tasks[i] = task;
}

function addTask(task) {
    task = task.trim();
    if (task.length === 0) return; 

    if (tasks.includes(task)) {
        inputField.placeholder = "Essa tarefa já existe!";
        inputField.classList.add("error");
        return;
    }
    tasks.push(task);
}

function generateTaskList() {
    let innerHtml = "";
    tasks.forEach((value) => {
        innerHtml += `<div class="item subwindow centralized task">${value}</div>`;
    })

    taskList.innerHTML = innerHtml;

    document.querySelectorAll(".task").forEach((element) => {
         element.addEventListener("click", () => task_click(element));
    });
}