import axios from 'axios';

const routes = {
  tasksPath: () => '/api/tasks',
};

// BEGIN
export default async () => {
  const form = document.querySelector('form');
  const taskNameInput = document.querySelector('input[name="name"]');
  const taskListContainer = document.getElementById('tasks');

  const appState = {
    todoItems: [],
    isLoading: null,
    errorMessage: [],
  };

  const displayTasks = (tasksToShow) => {
    taskListContainer.innerHTML = '';
    tasksToShow.forEach((task) => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.textContent = task;
      taskListContainer.prepend(listItem);
    });
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get(routes.tasksPath());
      const tasksData = response.data.items;
      appState.todoItems = [];
      tasksData.forEach(task => (appState.todoItems.unshift(task.name)));
    }
    catch(e){
    }
  };

  const addNewTask = async (taskTitle) => {
      try {
        const response = await axios.post(routes.tasksPath(), { name: taskTitle });
        if (response.status === 201) {
            appState.isLoading = true;
          }
          else {
              appState.isLoading = false;
              appState.errorMessage = 'Не удалось добавить задачу.';
          }
      }
      catch (e){
      }
    };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const taskTitle = taskNameInput.value;
    await addNewTask(taskTitle);
    if (appState.isLoading === true) {
      await fetchTasks();
      displayTasks(appState.todoItems);
    }
  })

  await fetchTasks();
  displayTasks(appState.todoItems);
  
}
// END
