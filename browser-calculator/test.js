// Ensure performCalculation is accessible (e.g., defined globally in script.js or exposed)
// If script.js defines performCalculation globally, it can be used directly.

const testResultsContainer = document.getElementById('testResults');
let testId = 0;

function describe(suiteName, fn) {
    const suiteDiv = document.createElement('div');
    suiteDiv.className = 'suite';
    suiteDiv.innerHTML = `<h2>${suiteName}</h2>`;
    testResultsContainer.appendChild(suiteDiv);
    fn();
}

function it(testName, fn) {
    testId++;
    const testDiv = document.createElement('div');
    testDiv.className = 'test';
    const resultSpan = document.createElement('span');
    try {
        fn();
        resultSpan.className = 'pass';
        resultSpan.textContent = `PASS: ${testName}`;
    } catch (e) {
        resultSpan.className = 'fail';
        resultSpan.textContent = `FAIL: ${testName}`;
        const errorDetails = document.createElement('pre');
        errorDetails.textContent = e.stack || e.message;
        testDiv.appendChild(errorDetails);
    }
    testDiv.insertBefore(resultSpan, testDiv.firstChild);
    // Find the current suite div to append this test result
    const currentSuite = testResultsContainer.querySelector('.suite:last-child');
    if (currentSuite) {
        currentSuite.appendChild(testDiv);
    } else { // Should not happen if 'describe' is used
        testResultsContainer.appendChild(testDiv);
    }
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        const errorMsg = message || `Expected ${expected}, but got ${actual}`;
        throw new Error(errorMsg);
    }
}

function assertThrows(fn, expectedErrorMessage, message) {
    let thrown = false;
    try {
        fn();
    } catch (e) {
        thrown = true;
        if (expectedErrorMessage && e.message !== expectedErrorMessage) {
            throw new Error(message || `Expected error message "${expectedErrorMessage}" but got "${e.message}"`);
        }
    }
    if (!thrown) {
        throw new Error(message || "Expected function to throw an error, but it did not.");
    }
}

// --- Test Suites ---

// Wait for the main script to load and define performCalculation
// If performCalculation is global, this delay might not be strictly needed,
// but good for ensuring script.js has run.
window.addEventListener('DOMContentLoaded', () => {
    // Check if performCalculation is available
    if (typeof performCalculation !== 'function') {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fail';
        errorDiv.textContent = 'FAIL: performCalculation function is not defined globally in script.js. Tests cannot run.';
        testResultsContainer.appendChild(errorDiv);
        return;
    }

    describe('performCalculation', () => {
        it('should add two positive numbers', () => {
            assertEquals(performCalculation(2, 3, '+'), 5);
        });

        it('should add a positive and a negative number', () => {
            assertEquals(performCalculation(5, -2, '+'), 3);
        });

        it('should subtract two numbers', () => {
            assertEquals(performCalculation(10, 4, '-'), 6);
        });

        it('should subtract to a negative result', () => {
            assertEquals(performCalculation(3, 5, '-'), -2);
        });

        it('should multiply two positive numbers', () => {
            assertEquals(performCalculation(3, 4, '*'), 12);
        });

        it('should multiply by zero', () => {
            assertEquals(performCalculation(5, 0, '*'), 0);
        });

        it('should multiply two negative numbers', () => {
            assertEquals(performCalculation(-2, -3, '*'), 6);
        });

        it('should divide two positive numbers', () => {
            assertEquals(performCalculation(10, 2, '/'), 5);
        });

        it('should handle division resulting in a decimal', () => {
            assertEquals(performCalculation(5, 2, '/'), 2.5);
        });

        it('should return "Error" for division by zero', () => {
            assertEquals(performCalculation(5, 0, '/'), 'Error');
        });

        it('should calculate percentage correctly (X % Y = X * (Y/100))', () => {
            assertEquals(performCalculation(200, 10, '%'), 20); // 200 * (10/100) = 20
            assertEquals(performCalculation(100, 50, '%'), 50); // 100 * (50/100) = 50
        });

        it('should handle percentage with decimal results', () => {
            assertEquals(performCalculation(150, 7.5, '%'), 11.25); // 150 * (7.5/100) = 11.25
        });
    });

    // Add more describe/it blocks for other functions if they are made testable
    // For example, testing the state logic of the calculator would be more complex
    // and might require simulating clicks or calling handleNumber, handleOperator directly.
    // This would require more refactoring of script.js to expose those functions.
    // For now, focusing on performCalculation.
});
