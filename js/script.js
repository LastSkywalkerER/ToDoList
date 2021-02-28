'use strict';

class Todo {
  constructor(form, input, todoList, todoCompleted, todoEdit, todoRemove, todoComplete, todoItem) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    this.todoEdit = todoEdit;
    this.todoRemove = todoRemove;
    this.todoComplete = todoComplete;
    this.todoItem = todoItem;
  }

  addToStorage() {
    localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }

  createItem(todo) {
    const li = document.createElement('li');
    li.classList.add(this.todoItem.slice(1));
    li.classList.add(todo.key);
    li.insertAdjacentHTML('beforeend', `
    	<span class="text-todo">${todo.value}</span>
      <div class="todo-buttons">
    	  <button class="todo-edit"></button>
        <button class="todo-remove"></button>
        <button class="todo-complete"></button>
      </div>
    `);

    if (todo.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(e) {
    e.preventDefault();

    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      this.input.value = '';

      this.todoData.set(newTodo.key, newTodo);

      this.render();
    }
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  editItem(element) {
    let newValue = prompt('Введите новое дело').trim();
    while (!newValue) {
      newValue = prompt('Введите новое дело').trim();
    }
    const item = {
      value: newValue,
      completed: this.todoData.get(element).completed,
      key: this.todoData.get(element).key,
    };
    this.todoData.delete(element);
    this.todoData.set(element, item);
    this.render();
  }

  removeItem(element) {
    const currentLi = document.getElementsByClassName(element)[0];

    let positionX = 0;

    currentLi.style.position = 'relative';

    const removeAnimation = () => {
      positionX += 25;
      currentLi.style.right = `${positionX}px`;

      console.log(positionX);

      if (positionX < document.documentElement.clientWidth) {
        setTimeout(removeAnimation, 1);
      } else {
        this.todoData.delete(element);
        this.render();
      }

    };

    removeAnimation();

  }

  completeItem(element) {
    const currentLi = document.getElementsByClassName(element)[0];
    let currentY = currentLi.getBoundingClientRect().top + document.documentElement.scrollTop;

    console.log(currentY);

    if (this.todoData.get(element).completed) {
      this.todoList.insertAdjacentHTML('beforeend', '<li class="test-li"></li>');
      currentY -= this.todoList.clientHeight + 80;
    } else {
      this.todoCompleted.insertAdjacentHTML('beforeend', '<li class="test-li"></li>');
    }

    console.log(currentY);

    const targetLis = document.getElementsByClassName('test-li'),
      targetLi = targetLis[targetLis.length - 1],
      targetY = targetLi.getBoundingClientRect().top + document.documentElement.scrollTop - 60;

    const completeAnimation = () => {
      currentLi.classList.add('todo-item__abs');

      currentY += 10;

      currentLi.style.top = `${currentY}px`;

      console.log(currentY, targetY);

      if (currentY < targetY) {
        setTimeout(completeAnimation, 10);
      } else {
        this.todoData.delete(element);
        this.todoData.set(element, item);
        this.render();
      }
    };

    const uncompleteAnimation = () => {
      currentLi.style.position = 'absolute';

      currentY -= 10;

      currentLi.style.top = `${currentY}px`;

      console.log(currentY, targetY);

      if (currentY > targetY) {
        setTimeout(uncompleteAnimation, 10);
      } else {
        this.todoData.delete(element);
        this.todoData.set(element, item);
        this.render();
      }
    };

    if (this.todoData.get(element).completed) {
      uncompleteAnimation();
    } else {
      completeAnimation();
    }


    const item = {
      value: this.todoData.get(element).value,
      completed: !this.todoData.get(element).completed,
      key: this.todoData.get(element).key,
    };


  }

  handler() {
    this.todoList.parentNode.addEventListener('click', (event) => {
      if (event.target.matches(this.todoEdit)) {
        this.editItem(event.target.closest(this.todoItem).classList[1]);
      }
      if (event.target.matches(this.todoRemove)) {
        this.removeItem(event.target.closest(this.todoItem).classList[1]);
      }
      if (event.target.matches(this.todoComplete)) {
        this.completeItem(event.target.closest(this.todoItem).classList[1]);
      }
    })
  }

  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.handler();
    this.render();
  }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-edit', '.todo-remove', '.todo-complete', '.todo-item');

todo.init();