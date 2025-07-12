const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const errorMsg = document.getElementById('errorMsg');
const showCompletedBtn = document.getElementById('showCompletedBtn');
const sortPrioritySelect = document.getElementById('sortPrioritySelect');
const themeBtn = document.getElementById('themeBtn');

let tasks = [];
let showCompletedOnly = false;

taskForm.addEventListener('submit', function (e) {
  e.preventDefault();

  try {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const priorityInput = document.querySelector('input[name="priority"]:checked');

    if (!title) {
      errorMsg.textContent = 'Başlık boş bırakılamaz.';
      return;
    }
    if (!priorityInput) {
      errorMsg.textContent = 'Lütfen öncelik seçin.';
      return;
    }

    const task = {
      id: Date.now(),
      title,
      description,
      priority: priorityInput.value,
      completed: false
    };

    tasks.push(task);
    errorMsg.textContent = '';
    taskForm.reset();
    renderTasks();
  } catch (error) {
    console.error('Beklenmedik bir hata oluştu:', error);
    errorMsg.textContent = 'Bir hata oluştu. Lütfen tekrar deneyin.';
  }
});

taskList.addEventListener('click', function (e) {
  e.stopPropagation();

  const target = e.target;

  const button = target.closest("button");
  if (!button) return;

  const id = button.dataset.id;

  if (button.classList.contains('complete')) {
    const task = tasks.find(t => t.id == id);
    if (task) {
      task.completed = !task.completed;
    }
    renderTasks();
  }

  if (button.classList.contains('delete')) {
    tasks = tasks.filter(t => t.id != id);
    renderTasks();
  }
});

showCompletedBtn.addEventListener('click', function () {
  showCompletedOnly = !showCompletedOnly;
  renderTasks();
});

sortPrioritySelect.addEventListener('change', function () {
  const order = this.value;
  const weight = { 'Yüksek': 3, 'Orta': 2, 'Düşük': 1 };

  if (order === 'asc') {
    tasks.sort((a, b) => weight[a.priority] - weight[b.priority]);
  } else if (order === 'desc') {
    tasks.sort((a, b) => weight[b.priority] - weight[a.priority]);
  }

  renderTasks();
});

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

function renderTasks() {
  taskList.innerHTML = '';

  const filtered = showCompletedOnly ? tasks.filter(t => t.completed) : tasks;

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task' + (task.completed ? ' completed' : '');

    li.innerHTML = `
      <strong>${task.title}</strong>
      <em>${task.priority}</em><br>
      <small>${task.description}</small>
      <div class="actions">
        <button class="complete" data-id="${task.id}">
          <i class="fas fa-check"></i> ${task.completed ? 'Geri Al' : 'Tamamla'}
        </button>
        <button class="delete" data-id="${task.id}">
          <i class="fas fa-trash"></i> Sil
        </button>
      </div>
    `;
    taskList.appendChild(li);
  });
}
