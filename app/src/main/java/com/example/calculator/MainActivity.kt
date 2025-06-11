package com.example.calculator

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity // Required for AppCompatActivity

// Placeholder for actual view binding if used, e.g.:
// import com.example.calculator.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() { // Extend AppCompatActivity

    private lateinit var resultTextView: TextView
    private val calculator = Calculator()
    private var currentInput = StringBuilder()
    private var currentOperator: String? = null
    private var operand1: Double? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // In a real app, you would inflate the layout:
        // setContentView(R.layout.activity_main)
        // Or use view binding:
        // val binding = ActivityMainBinding.inflate(layoutInflater)
        // setContentView(binding.root)
        // resultTextView = binding.resultTextView

        // --- The following is a conceptual setup ---
        // resultTextView = findViewById(R.id.resultTextView) // Example initialization

        // Conceptual: Initialize buttons and set listeners
        // val button0: Button = findViewById(R.id.button0)
        // button0.setOnClickListener { onNumberClicked("0") }
        // ... (similar for other number buttons 1-9 and dot) ...

        // val buttonAdd: Button = findViewById(R.id.buttonAdd)
        // buttonAdd.setOnClickListener { onOperatorClicked("+") }
        // ... (similar for subtract, multiply, divide) ...

        // val buttonEquals: Button = findViewById(R.id.buttonEquals)
        // buttonEquals.setOnClickListener { onEqualsClicked() }

        // val buttonClear: Button = findViewById(R.id.buttonClear)
        // buttonClear.setOnClickListener { onClearClicked() }

        // Conceptual: Initial display update
        updateDisplay()
    }

    private fun onNumberClicked(number: String) {
        currentInput.append(number)
        updateDisplay()
    }

    private fun onOperatorClicked(operator: String) {
        if (currentInput.isNotEmpty()) {
            if (operand1 == null) {
                operand1 = currentInput.toString().toDoubleOrNull()
                currentInput.clear()
            } else {
                // Handle chained operations if operand1 and currentInput are present
                onEqualsClicked() // Calculate previous operation first
                // operand1 should now be the result of the previous operation
            }
        }
        currentOperator = operator
        // Display operator or wait for next number
        // For simplicity, we'll just store it and update display on next number or equals
         resultTextView.text = currentOperator // Show operator indication
    }

    private fun onEqualsClicked() {
        if (operand1 != null && currentOperator != null && currentInput.isNotEmpty()) {
            val operand2 = currentInput.toString().toDoubleOrNull()
            if (operand2 != null) {
                try {
                    val result = when (currentOperator) {
                        "+" -> calculator.add(operand1!!, operand2)
                        "-" -> calculator.subtract(operand1!!, operand2)
                        "*" -> calculator.multiply(operand1!!, operand2)
                        "/" -> calculator.divide(operand1!!, operand2)
                        else -> null
                    }
                    if (result != null) {
                        currentInput.clear()
                        currentInput.append(result.toString())
                        operand1 = result // Store result for chained operations
                        currentOperator = null
                    } else {
                        currentInput.clear()
                        currentInput.append("Error")
                    }
                } catch (e: IllegalArgumentException) {
                    currentInput.clear()
                    currentInput.append("Error: Div by 0")
                }
            } else {
                currentInput.clear()
                currentInput.append("Error: Invalid input")
            }
        } else if (currentOperator != null && currentInput.isEmpty()){
            // Handle case like "5 + =" -> should likely do nothing or show error
             currentInput.clear()
             currentInput.append("Error: Incomplete")
        }
        // else: do nothing if not enough info for an operation

        updateDisplay()
        // Reset for next operation if it was a full calculation
        if(!currentInput.toString().startsWith("Error")) {
             // If a successful calculation happened and result is in currentInput
             // operand1 is already set for chaining. currentOperator is null.
        } else {
            // If there was an error, reset more thoroughly
            operand1 = null
            currentOperator = null
        }
    }

    private fun onClearClicked() {
        currentInput.clear()
        operand1 = null
        currentOperator = null
        updateDisplay()
    }

    private fun updateDisplay() {
        // In a real app, this would be:
        // resultTextView.text = currentInput.toString()
        // For now, this is conceptual.
        // Log.d("Calculator", "Display: ${currentInput.toString()}")
        if (::resultTextView.isInitialized) { // Check if initialized
            resultTextView.text = currentInput.toString().ifEmpty { "0" }
        }
    }
}
