"use strict";

// Variables
const STORAGE_KEY = "tasks";
let maxId = 0;
let editedText;

// DOM variables
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const filterInput = document.querySelector(".filter-input");
const taskList = document.querySelector(".collection");
const clearButton = document.querySelector(".clear-tasks");

// "storage" functions
const getTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return tasks;
};

const storeTaskInLocalStorage = (task) => {
  const tasks = getTasksFromLocalStorage();
  tasks.push(task);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const removeTaskFromLocalStorage = (idForRemoval) => {
  const tasks = getTasksFromLocalStorage();
  const deletedIndex = tasks.findIndex((task) => task.id === idForRemoval);
  tasks.splice(deletedIndex, 1);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const editTaskInLocalStorage = (idForEditing) => {
  const tasks = getTasksFromLocalStorage();

  const editingIndex = tasks.findIndex((task) => task.id === idForEditing);
  let lastTask = tasks.pop();
  tasks.splice(editingIndex, 1, lastTask);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const clearTasksFromLocalStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// "tasks" functions
const getTasks = () => {
  const tasks = getTasksFromLocalStorage();

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = "collection-item";
    li.dataset.taskId = task.id;
    li.textContent = task.value;

    const removeIcon = document.createElement("span");
    removeIcon.className = "delete-item";
    removeIcon.innerHTML = '<i class="fa fa-remove"></i>';
    li.append(removeIcon);

    const editIcon = document.createElement("span");
    editIcon.className = "edit-item";
    editIcon.innerHTML = '<i class="fa fa-edit"></i>';
    li.append(editIcon);

    taskList.append(li);

    if (+task.id > maxId) {
      maxId = +task.id;
    }
  });

  maxId++;
};

const addTask = (event) => {
  event.preventDefault();

  if (taskInput.value.trim() === "") {
    return;
  }

  let newElementId = maxId++;

  // Create and add LI element
  const li = document.createElement("li");
  li.className = "collection-item";
  li.textContent = taskInput.value; // значення яке ввів користувач
  li.dataset.taskId = newElementId;

  const removeIcon = document.createElement("span");
  removeIcon.className = "delete-item";
  removeIcon.innerHTML = '<i class="fa fa-remove"></i>';
  li.append(removeIcon);

  const editIcon = document.createElement("span");
  editIcon.className = "edit-item";
  editIcon.innerHTML = '<i class="fa fa-edit"></i>';
  li.append(editIcon);

  taskList.append(li);

  storeTaskInLocalStorage({ id: newElementId, value: taskInput.value });

  taskInput.value = "";
};

const removeTask = (event) => {
  const isDeleteIcon = event.target.classList.contains("fa-remove");

  if (isDeleteIcon) {
    const isApproved = confirm("Ви впевнені що хочете видалити це завдання?");

    if (isApproved) {
      const deletedLi = event.target.closest("li");
      let idForRemoval = +deletedLi.dataset.taskId;
      deletedLi.remove();

      removeTaskFromLocalStorage(idForRemoval);
    }
  }
};

const editTask = (event) => {
  const isEditIcon = event.target.classList.contains("fa-edit");

  if (isEditIcon) {
    editedText = prompt("Чим Ви хочете замінити це завдання?").trim();

    if (editedText) {
      const editedLi = event.target.closest("li");
      let idForEditing = +editedLi.dataset.taskId;
      editedLi.firstChild.textContent = editedText;

      storeTaskInLocalStorage({ id: idForEditing, value: editedText });
      editTaskInLocalStorage(idForEditing);
    }
  }
};

const clearTasks = () => {
  taskList.innerHTML = "";
  clearTasksFromLocalStorage();
  maxId = 0;
};

const filterTasks = (event) => {
  const text = event.target.value.toLowerCase();
  const list = document.querySelectorAll(".collection-item");

  list.forEach((task) => {
    const item = task.firstChild.textContent.toLowerCase();

    if (item.includes(text)) {
      task.style.display = "list-item";
    } else {
      task.style.display = "none";
    }
  });
};

// init
getTasks();

// Event listeners

form.addEventListener("submit", addTask);

taskList.addEventListener("click", removeTask);

taskList.addEventListener("click", editTask);

clearButton.addEventListener("click", clearTasks);

filterInput.addEventListener("input", filterTasks);
