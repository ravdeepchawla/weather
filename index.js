async function get_weather() {
    let appid = 'e8ae1b0970701fd6b1dda15b8abd7a0b';
    let city = 'Berlin';
    let unit = 'metric';
    let count = 2;
    let url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + "&appid=" + appid + "&units=" + unit + "&cnt=" + count;
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function render_weather() {
    let weather = await get_weather();
    // console.log(weather);
    
    let city = document.getElementById('city');
    city.innerHTML = weather.city.name;

    let temperature = document.getElementById('temperature');
    temperature.innerHTML = Math.round(weather.list[0].main.temp);

    let current_weather = document.getElementById('current_weather');
    current_weather.innerHTML = weather.list[0].weather[0].description;
    let icon_url = 	"https://openweathermap.org/img/wn/" + weather.list[0].weather[0].icon + "@2x.png"
    let icon = document.createElement('img');
    icon.src = icon_url;
    icon.alt = weather.list[0].weather[0].description + " icon";
    icon.classList.add("icon");
    current_weather.appendChild(icon);

    let current_feels_like = document.getElementById('current_feels_like');
    current_feels_like.innerHTML = Math.round(weather.list[0].main.feels_like);

    let future_temp = document.getElementById('future_temp');
    future_temp.innerHTML = Math.round(weather.list[1].main.temp);

    let future_time = document.getElementById('future_time');
    let ftime = new Date(weather.list[1].dt_txt);
    let options = {
        hour: 'numeric',
        hour12: true
      };
    future_time.innerHTML = ftime.toLocaleString('en-US', options);
    
    let future_weather = document.getElementById('future_weather');
    future_weather.innerHTML = weather.list[1].weather[0].description;

}

window.onload = render_weather();
window.onload = loadTasks();

// On form submit add task
document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();
  addTask();
});

function loadTasks() {
  // check if localStorage has any tasks
  // if not then return
  if (localStorage.getItem("tasks") == null) return;

  // Get the tasks from localStorage and convert it to an array
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));

  // Loop through the tasks and add them to the list
  tasks.forEach(task => {
    const list = document.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? 'checked' : ''}>
          <input type="text" value="${task.task}" class="task ${task.completed ? 'completed' : ''}" onfocus="getCurrentTask(this)" onblur="editTask(this)">
          <i class="trash" onclick="removeTask(this)"></i>`;
    list.insertBefore(li, list.children[0]);
  });
}

function addTask() {
  const task = document.querySelector("form input");
  const list = document.querySelector("ul");
  // return if task is empty
  if (task.value === "") {
    alert("Please add some task!");
    return false;
  }

  // add task to local storage
  localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { task: task.value, completed: false }]));

  // create list item, add innerHTML and append to ul
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
      <input type="text" value="${task.value}" class="task" onfocus="getCurrentTask(this)" onblur="editTask(this)">
      <i class="trash" onclick="removeTask(this)"></i>`;
  list.insertBefore(li, list.children[0]);
  // clear input
  task.value = "";
}

function taskComplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.nextElementSibling.value) {
      task.completed = !task.completed;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.nextElementSibling.classList.toggle("completed");
}

function removeTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.parentNode.children[1].value) {
      // delete task
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.parentElement.remove();
}

// store current task to track changes
var currentTask = null;

// get current task
function getCurrentTask(event) {
  currentTask = event.value;
}

// edit the task and update local storage
function editTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  // check if task is empty
  if (event.value === "") {
    alert("Task is empty!");
    event.value = currentTask;
    return;
  }
  // update task
  tasks.forEach(task => {
    if (task.task === currentTask) {
      task.task = event.value;
    }
  });
  // update local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}