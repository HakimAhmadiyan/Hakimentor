// Moved to global scope for testability
function performCalculation(val1, val2, op) {
    // Ensure val1 is a number if previousInput was from a calculation
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);

    // Simplified error check for direct testing, actual app might have more validation before calling this
    if (isNaN(num1) || isNaN(num2) && op !== '/') {
        // For division by zero, num2 can be 0, which is fine.
        // But if other ops have NaN, it's an issue.
        // This check is basic, robust validation is complex.
        // Let's assume inputs are valid numbers or 'Error' is expected for div by zero.
    }


    switch (op) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/': return num2 === 0 ? 'Error' : num1 / num2;
        case '%':
            return num1 * (num2 / 100);
        default: return NaN; // Should indicate error or unexpected op for tests
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('resultDisplay');
    const buttonsContainer = document.querySelector('.buttons'); // Renamed for clarity

    let currentInput = '0';
    let operator = null;
    let previousInput = null;
    let waitingForSecondOperand = false;

    function updateDisplay() {
        display.value = currentInput;
    }

    updateDisplay();

    buttonsContainer.addEventListener('click', (event) => {
        const target = event.target;
        if (!target.matches('button')) return;

        const value = target.dataset.value;    // For numbers (0-9, .) and operators (+, -, *, /, %)
        const action = target.dataset.action;  // For special actions (clear, delete, calculate)

        if (value) {
            if (['+', '-', '*', '/', '%'].includes(value)) {
                handleOperator(value);
            } else { // Digit or decimal point
                handleNumber(value);
            }
        } else if (action) {
            handleAction(action);
        }
        updateDisplay();
    });

    function handleNumber(number) {
        if (number === '.' && currentInput.includes('.')) return; // Prevent multiple dots
        if (waitingForSecondOperand) {
            currentInput = number;
            waitingForSecondOperand = false;
        } else {
            currentInput = (currentInput === '0' && number !== '.') ? number : currentInput + number;
        }
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        if (operator && waitingForSecondOperand) { // Allows changing operator e.g. 5 * +
            operator = nextOperator;
            return;
        }

        if (previousInput === null && !isNaN(inputValue)) {
            previousInput = inputValue;
        } else if (operator && !isNaN(inputValue)) {
            const result = performCalculation(previousInput, inputValue, operator); // Uses global performCalculation
            if (result === 'Error' || isNaN(result)) { // Check for NaN too
                currentInput = 'Error';
                clearOnError(); // Defined below within DOMContentLoaded
                return;
            }
            currentInput = String(result);
            previousInput = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
    }

    function clearOnError() {
        // currentInput is already 'Error' or will be set by caller
        operator = null;
        previousInput = null;
        waitingForSecondOperand = false;
    }

    function handleAction(actionType) {
        switch (actionType) {
            case 'clear':
                clearAll();
                break;
            case 'delete':
                deleteLast();
                break;
            case 'calculate':
                calculate();
                break;
        }
    }

    function calculate() {
        if (operator === null || waitingForSecondOperand) {
            return;
        }

        const inputValue = parseFloat(currentInput);
        if (previousInput !== null && !isNaN(inputValue)) {
            const result = performCalculation(previousInput, inputValue, operator); // Uses global performCalculation
             if (result === 'Error' || isNaN(result)) { // Check for NaN
                currentInput = 'Error';
                clearOnError();
            } else {
                currentInput = String(result);
                previousInput = null;
                operator = null;
                waitingForSecondOperand = false;
            }
        }
    }

    function clearAll() {
        currentInput = '0';
        operator = null;
        previousInput = null;
        waitingForSecondOperand = false;
    }

    function deleteLast() {
        if (currentInput === 'Error' || waitingForSecondOperand) {
            return;
        }
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
    }

    // --- Theme Switcher Logic ---
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    function applyTheme(isDark) {
        if (isDark) {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
            themeToggle.checked = true;
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
            themeToggle.checked = false;
        }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme === 'dark');
    } else {
        applyTheme(false); // Default to light
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            applyTheme(true);
            localStorage.setItem('theme', 'dark');
        } else {
            applyTheme(false);
            localStorage.setItem('theme', 'light');
        }
    });

    // For testing purposes, to allow test.js to access functions if needed,
    // though performCalculation is now global.
    // This isn't strictly necessary if performCalculation is the only target and is global.
    if (window.Cypress || window.testEnvironment) {
        window.calculatorUI = {
            // Expose functions from the UI interaction part if needed for more complex tests
            // e.g. handleNumber, handleOperator, handleAction, clearAll, deleteLast, calculate
            // For now, tests only target performCalculation
        };
    }

}); // End DOMContentLoaded
