const btn_create = document.querySelector("button#btn-create");
const ctn_create = document.querySelector("article#create-task");
const form_create = document.querySelector("article#create-task form");
const table_task = document.querySelector("table#table-task tbody");
const datalist_category = document.querySelector(
  "article#create-task form datalist#categories"
);

let status_func="criar"

let tasks = localStorage.getItem("data")
  ? JSON.parse(localStorage.getItem("data"))
  : [];

let categories = tasks.map((obj) => obj.category);
categories.forEach((category, key) => {
  let op = document.createElement("option");
  op.value = category;
  op.innerText = category;
  datalist_category.append(op);
});
tasks.forEach((task, key) => {
  createElmTask(task, key);
});

reloadTable();


btn_create.addEventListener("click", (event) => {
  ctn_create.className = btn_create.className == "close" ? "open" : "close";
  btn_create.className = btn_create.className == "close" ? "open" : "close";
  document.querySelector("article#create-task form h1").innerText = "Criar Tarefa"
  document.querySelector("article#create-task form input[type=submit]").value = "Criar"
  form_create.reset()
});

function createElmTask(task, key) {
  let tr = document.createElement("tr");
  let td_name = document.createElement("td");
  let td_description = document.createElement("td");
  let td_category = document.createElement("td");
  let td_priority = document.createElement("td");
  let td_status = document.createElement("td");
  let td_validity = document.createElement("td");
  let td_remove = document.createElement("td");
  let td_edit = document.createElement("td");
  let btn_remove = document.createElement("button");
  let btn_edit = document.createElement("button");

  btn_remove.addEventListener("click", function () {
    tasks.splice(key, 1);
    status_func=="criar"
    localStorage.setItem("data", JSON.stringify(tasks));
    reloadTable();
  });

  btn_edit.addEventListener('click', function(){
    console.log(task)
    status_func="alterar"
    ctn_create.className = "close";
    btn_create.className = "close";
    document.querySelector("article#create-task form input[name=name]").value=task.name
    document.querySelector("article#create-task form textarea[name=description]").value=task.description
    document.querySelector("article#create-task form input[name=category]").value=task.category
    document.querySelector("article#create-task form input[name=priority]").value=task.priority
    document.querySelector(`article#create-task form input[id=${task.status}]`).checked=true
    document.querySelector("article#create-task form input[name=validity]").value=task.validity
    document.querySelector("article#create-task form h1").innerText = "Alterar Tarefa"
    document.querySelector("article#create-task form input[type=submit]").value = "Alterar"
  })

  td_name.innerText = task.name;
  td_name.dataset.label = "Nome";

  td_description.innerText = task.description;
  td_description.dataset.label = "Descrição";

  td_category.innerText = task.category;
  td_category.dataset.label = "Categoria";

  td_priority.innerText = task.priority;
  td_priority.dataset.label = "Prioridade";

  td_status.innerText = task.status;
  td_status.dataset.label = "Status";

  td_validity.innerText = task.validity;
  td_validity.dataset.label = "Validade";

  btn_edit.innerHTML = `<ion-icon name="pencil-outline"></ion-icon>`;
  td_edit.dataset.label = "Editar";
  td_edit.appendChild(btn_edit);

  btn_remove.innerHTML = `<ion-icon name="trash-outline"></ion-icon>`;
  td_remove.dataset.label = "Remover";
  td_remove.appendChild(btn_remove);

  tr.appendChild(td_name);
  tr.appendChild(td_description);
  tr.appendChild(td_category);
  tr.appendChild(td_priority);
  tr.appendChild(td_status);
  tr.appendChild(td_validity);
  tr.appendChild(td_edit);
  tr.appendChild(td_remove);

  table_task.appendChild(tr);
}

form_create.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  let errors = []
  document.querySelectorAll("span.error").forEach(span => {
    span.innerHTML=""
  })
  try {
    if (!data.get("name")) {
      errors.push(["name","não preenchido corretamente"])
    }
    if (!data.get("description")) {
      errors.push(["description","não preenchido corretamente"])
    }
    if (!data.get("category")) {
      errors.push(["category","não preenchido corretamente"])
    }
    if (!data.get("status")) {
      errors.push(["status","não preenchido corretamente"])
    }
    if (!data.get("validity")) {
      errors.push(["validity","não preenchido corretamente"])
    }

    if (errors.length) {
      throw errors
    }

    let task = {
      name: data.get("name"),
      description: data.get("description"),
      category: data.get("category"),
      priority: data.get("priority"),
      status: data.get("status"),
      validity: data.get("validity")
    };
  
    if (status_func=="criar") {
      tasks.push(task);
    } else if(status_func=="alterar"){
      tasks[0]=task;
    }
    localStorage.setItem("data", JSON.stringify(tasks));
    datalist_category.innerHTML = "";
    reloadTable();
    form_create.reset()
    ctn_create.className = "open";
    btn_create.className = "open";
  } catch (errors) {
    errors.forEach(err => {
      document.getElementById(`${err[0]}-error`).innerHTML = err[1]
    })
  }
});
function reloadTable() {
  table_task.innerHTML = "";
  datalist_category.innerHTML = "";
  tasks = localStorage.getItem("data")
    ? JSON.parse(localStorage.getItem("data"))
    : [];
  categories = tasks.map((obj) => obj.category);
  categories.forEach((category, key) => {
    let op = document.createElement("option");
    op.value = category;
    op.innerText = category;
    datalist_category.append(op);
  });
  tasks.forEach((task, key) => {
    createElmTask(task, key);
  });
}
