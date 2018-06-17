// HELPER FUNCTIONS

function generateId () {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

// LIBRARY CODE

function createStore (reducer) {
    // The store should have four parts
    // 1. The state
    // 2. Get the state
    // 3. Listen to changes on the state
    // 4. Update the state

    let state;
    let listeners = [];

    const getState = () => state;

    const subscribe = (listener) => {
        listeners.push(listener);

        return () => {
            listeners = listeners.filter(l => l !== listener);
        }
    };

    const dispatch = (action) => {
        state = reducer(state, action);
        listeners.forEach(listener => listener());
    }

    return {
        getState,
        subscribe,
        dispatch,
    }
}



// APP CODE

// Action Types
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';

// Action Creators
function addTodoAction(todo) {
    return {
        type: ADD_TODO,
        todo,
    }
}

function removeTodoAction(id) {
    return {
        type: REMOVE_TODO,
        id,
    }
}

function toggleTodoAction(id) {
    return {
        type: TOGGLE_TODO,
        id,
    }
}

function addGoalAction(goal) {
    return {
        type: ADD_GOAL,
        goal,
    }
}

function removeGoalAction(id) {
    return {
        type: REMOVE_GOAL,
        id,
    }
}

// Reducers
function todos (state = [], action) {
    switch(action.type) {
        case ADD_TODO :
            return state.concat([action.todo]);
        case REMOVE_TODO :
            return state.filter(todo => todo.id !== action.id);
        case TOGGLE_TODO :
            return state.map(todo => todo.id !== action.id ? todo :
                Object.assign({}, todo, {completed: !todo.completed})
            );
        default :
            return state;
    }
}

function goals (state = [], action) {
    switch(action.type) {
        case ADD_GOAL :
            return state.concat([action.goal]);
        case REMOVE_GOAL :
            return state.filter(goal => goal.id !== action.id);
        default :
            return state;
    }
}

function app (state = {}, action) {
    return {
        todos: todos(state.todos, action),
        goals: goals(state.goals, action),
    }
}

// Create Store
const store = createStore(app);

// Add Listener
store.subscribe(() => {
    const {todos, goals} = store.getState();

    document.getElementById('todos').innerHTML = '';
    document.getElementById('goals').innerHTML = '';

    todos.forEach(addTodoToDOM);
    goals.forEach(addGoalToDOM);
});



// DOM CODE

function addTodo() {
    const input = document.getElementById('todo');
    const name = input.value;
    input.value = '';

    store.dispatch(addTodoAction({
        id: generateId(),
        name,
        completed: false,
    }));
}

function addGoal() {
    const input = document.getElementById('goal');
    const name = input.value;
    input.value = '';

    store.dispatch(addGoalAction({
        id: generateId(),
        name,
    }));
}

document.getElementById('todoBtn').addEventListener('click', addTodo);

document.getElementById('goalBtn').addEventListener('click', addGoal);

function createRemoveButton (onClick) {
    const removeButton = document.createElement('button');
    removeButton.innerHTML = 'X';
    removeButton.addEventListener('click', onClick);
    return removeButton;
}

function addTodoToDOM (todo) {
    const node = document.createElement('li');
    const text = document.createTextNode(todo.name);
    const removeButton = createRemoveButton(() => {
        store.dispatch(removeTodoAction(todo.id))
    });

    node.appendChild(text);
    node.appendChild(removeButton);
    node.style.textDecoration = todo.completed ? 'line-through' : 'none';
    node.addEventListener('click', () => store.dispatch(toggleTodoAction(todo.id)));

    document.getElementById('todos').appendChild(node);
}

function addGoalToDOM (goal) {
    const node = document.createElement('li');
    const text = document.createTextNode(goal.name);
    const removeButton = createRemoveButton(() => {
        store.dispatch(removeGoalAction(goal.id))
    });

    node.appendChild(text);
    node.appendChild(removeButton);

    document.getElementById('goals').appendChild(node);
}
