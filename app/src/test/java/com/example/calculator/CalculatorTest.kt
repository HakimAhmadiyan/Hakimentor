package com.example.calculator

import org.junit.Assert.* // Import JUnit assertions
import org.junit.Test // Import Test annotation
import org.junit.Before // Import Before annotation

class CalculatorTest {

    private lateinit var calculator: Calculator

    @Before
    fun setUp() {
        calculator = Calculator()
    }

    @Test
    fun testAddition() {
        assertEquals("Addition: 2 + 3 = 5", 5.0, calculator.add(2.0, 3.0), 0.001)
        assertEquals("Addition: -1 + 1 = 0", 0.0, calculator.add(-1.0, 1.0), 0.001)
        assertEquals("Addition: 0 + 0 = 0", 0.0, calculator.add(0.0, 0.0), 0.001)
        assertEquals("Addition: Large numbers", 200000.0, calculator.add(100000.0, 100000.0), 0.001)
        assertEquals("Addition: Decimal numbers", 5.5, calculator.add(2.2, 3.3), 0.001)
    }

    @Test
    fun testSubtraction() {
        assertEquals("Subtraction: 5 - 3 = 2", 2.0, calculator.subtract(5.0, 3.0), 0.001)
        assertEquals("Subtraction: 3 - 5 = -2", -2.0, calculator.subtract(3.0, 5.0), 0.001)
        assertEquals("Subtraction: 0 - 0 = 0", 0.0, calculator.subtract(0.0, 0.0), 0.001)
        assertEquals("Subtraction: Negative result", -5.0, calculator.subtract(0.0, 5.0), 0.001)
        assertEquals("Subtraction: Decimal numbers", 1.1, calculator.subtract(3.3, 2.2), 0.001)
    }

    @Test
    fun testMultiplication() {
        assertEquals("Multiplication: 2 * 3 = 6", 6.0, calculator.multiply(2.0, 3.0), 0.001)
        assertEquals("Multiplication: -2 * 3 = -6", -6.0, calculator.multiply(-2.0, 3.0), 0.001)
        assertEquals("Multiplication: 2 * -3 = -6", -6.0, calculator.multiply(2.0, -3.0), 0.001)
        assertEquals("Multiplication: 0 * 5 = 0", 0.0, calculator.multiply(0.0, 5.0), 0.001)
        assertEquals("Multiplication: Decimal numbers", 7.26, calculator.multiply(2.2, 3.3), 0.001)
    }

    @Test
    fun testDivision() {
        assertEquals("Division: 6 / 3 = 2", 2.0, calculator.divide(6.0, 3.0), 0.001)
        assertEquals("Division: 5 / 2 = 2.5", 2.5, calculator.divide(5.0, 2.0), 0.001)
        assertEquals("Division: -6 / 3 = -2", -2.0, calculator.divide(-6.0, 3.0), 0.001)
        assertEquals("Division: Decimal numbers", 2.0, calculator.divide(7.26, 3.63), 0.001)
    }

    @Test(expected = IllegalArgumentException::class)
    fun testDivisionByZero() {
        calculator.divide(5.0, 0.0)
    }

    @Test
    fun testChainedOperations() {
        // Example: 5 + 3 - 2 = 6
        var result = calculator.add(5.0, 3.0) // 8.0
        result = calculator.subtract(result, 2.0) // 6.0
        assertEquals("Chained: 5 + 3 - 2 = 6", 6.0, result, 0.001)

        // Example: 10 * 2 / 4 = 5
        result = calculator.multiply(10.0, 2.0) // 20.0
        result = calculator.divide(result, 4.0) // 5.0
        assertEquals("Chained: 10 * 2 / 4 = 5", 5.0, result, 0.001)
    }
}
