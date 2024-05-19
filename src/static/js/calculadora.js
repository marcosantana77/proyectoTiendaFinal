/**
 * Selector del elemento de visualización en la calculadora.
 * @type {HTMLElement}
 */
const display = document.querySelector(".display");

/**
 * NodeList que contiene todos los botones en la calculadora.
 * @type {NodeList}
 */
const buttons = document.querySelectorAll("button");

/**
 * Variable para almacenar el número actual en la pantalla de la calculadora.
 * @type {string}
 */
let currentInput = "";

/**
 * Variable para almacenar el operador actual seleccionado.
 * @type {string}
 */
let currentOperator = "";

/**
 * Variable que indica si se debe limpiar la pantalla después de la próxima entrada.
 * @type {boolean}
 */
let shouldClearDisplay = false;

/**
 * Añade un evento de click a cada botón de la calculadora.
 */
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonText = button.textContent;

    // Maneja los números
    if (buttonText.match(/[0-9]/)) {
      if (shouldClearDisplay) {
        display.textContent = "";
        shouldClearDisplay = false;
      }
      display.textContent += buttonText;
    } 
    // Maneja el botón "C" para limpiar la pantalla
    else if (buttonText === "C") {
      display.textContent = "0";
      currentInput = "";
      currentOperator = "";
    } 
    // Maneja el botón "=" para calcular el resultado
    else if (buttonText === "=") {
      if (currentOperator && currentInput) {
        const result = calculate(parseFloat(currentInput), currentOperator, parseFloat(display.textContent));
        display.textContent = result;
        currentInput = result;
        currentOperator = "";
        shouldClearDisplay = true;
      }
    } 
    // Maneja los operadores aritméticos
    else {
      currentOperator = buttonText;
      currentInput = display.textContent;
      shouldClearDisplay = true;
    }
  });
});

/**
 * Función para realizar cálculos aritméticos.
 * @param {number} num1 - Primer número en la operación.
 * @param {string} operator - Operador aritmético.
 * @param {number} num2 - Segundo número en la operación.
 * @returns {number|string} - Resultado de la operación o "Error" si hay una división por cero.
 */
function calculate(num1, operator, num2) {
  switch (operator) {
    case "+":
      return num1 + num2;
    case "-":
      return num1 - num2;
    case "*":
      return num1 * num2;
    case "/":
      if (num2 !== 0) {
        return num1 / num2;
      } else {
        return "Error";
      }
    default:
      return num2;
  }
}
