// operations

const add = (x, y) => x + y;
const sub = (x, y) => x - y;
const mul = (x, y) => x * y;
const div = (x, y) => x / y;

// command

class Command {
    constructor(execute, undo, value) {
        this.execute = execute;
        this.undo = undo;
        this.value = value;
    }
}

function addCommand (value) { return new Command(add, sub, value); } 
function subCommand (value) { return new Command(sub, add, value); }
function mulCommand (value) { return new Command(mul, div, value); }
function divCommand (value) { return new Command(div, mul, value); }

// receiver

class Calculator {
    constructor() {
        this._current = 0;
        console.log(typeof this._current);
        this.commands = [];
    }

    execute(command) {
        console.log(typeof this._current);
        console.log(typeof command.value);
        this.current = command.execute(this._current, command.value).toFixed(2);
        this.commands.push(command);

        console.log(command.execute.toString() + ': ' + this._current);
    }

    undo() {
        const command = this.commands.pop();

        if (command !== undefined) {
            console.log(typeof command.undo(this._current, command.value));
            console.log(typeof this._current);
            console.log(typeof command.value);
            this.current = command.undo(+this._current, +command.value).toFixed(2);

            console.log('undo' + command.undo.toString() + ': ' + this.current);
        } else {
            this.current = 0;
        }
        
    }

    get current() {
        return this._current;
    }

    set current(value) {
        this._current = value;
    }

    clearCommands() {
        this.commands = [];
    }
}

// handlers

const calculator = new Calculator();

function setCurrentInputValue(current) {
    if (current.endsWith('00')) {
        current = current.replace('.00', '');
    } else if (current.endsWith('0') && current.includes('.')) {
        current = current.substring(0, current.length - 1);
    }
    
    currentInputValue = document.getElementById('calc').value = current;
}

let currentInputValue = '0';
let previousInputValue = '';
let operation = '';

[].forEach.call(document.getElementsByClassName('number'), (element) => {
    element?.addEventListener('click', (event) => {
        let value = event.target.value;

        if (currentInputValue === 'Cannot divide by zero') {
            currentInputValue = value;
            setCurrentInputValue(currentInputValue);

            return;
        }

        if ((currentInputValue === '0' && value !== '0') || (currentInputValue !== '0')) {
            currentInputValue = currentInputValue === '0' && value !== '.' ? value : currentInputValue + value;
            setCurrentInputValue(currentInputValue);
            console.log(currentInputValue);
        }
    });
});

[].forEach.call(document.getElementsByClassName('operation'), (element) => {
    element?.addEventListener('click', (event) => {
        operation = event.target.value;
        console.log(operation);

        if (previousInputValue === '') {
            previousInputValue = currentInputValue;
            setCurrentInputValue('0');
        }

        if (previousInputValue !== '' && currentInputValue !== '0') {
            executeOperation();
        }
        

        calculator.current = +previousInputValue;
        console.log(operation);
    });
});

function executeOperation () {
    console.log('1');
    if (previousInputValue !== '' && currentInputValue !== '0') {
        console.log('2');
        switch(operation) {
            case '+':
                calculator.execute(addCommand(+currentInputValue));
                break;
            case '-':
                calculator.execute(subCommand(+currentInputValue));
                break;
            case '*':
                calculator.execute(mulCommand(+currentInputValue));
                break;
            case '/':
                calculator.execute(divCommand(+currentInputValue));
                break;
        }
        
        setCurrentInputValue(calculator.current.toString());
        previousInputValue = '';
        operation = '';
    } else if (previousInputValue !== '' && currentInputValue === '0' && operation === '/') {
        setCurrentInputValue('Cannot divide by zero');
        calculator.current = 0;
        calculator.clearCommands();
        operation = '';
        previousInputValue = '';
    }
}

document.getElementById('=').addEventListener('click', () => {
    executeOperation();
});

document.getElementById('clear').addEventListener('click', () => {
    setCurrentInputValue('0');
    calculator.current = 0;
    calculator.clearCommands();
    operation = '';
});

document.getElementById('undo').addEventListener('click', () => {
    calculator.undo();
    setCurrentInputValue(calculator.current.toString());
});

document.getElementById('+/-').addEventListener('click', () => {
    setCurrentInputValue((0 - +currentInputValue).toString());
});

