const KEYPAD_HTML = `
  <button class="key key--fn" data-action="clear">C</button>
  <button class="key key--fn" data-action="sign">+/&minus;</button>
  <button class="key key--fn" data-action="percent">%</button>
  <button class="key key--op" data-action="operator" data-op="÷">÷</button>

  <button class="key key--num" data-digit="7">7</button>
  <button class="key key--num" data-digit="8">8</button>
  <button class="key key--num" data-digit="9">9</button>
  <button class="key key--op" data-action="operator" data-op="×">×</button>

  <button class="key key--num" data-digit="4">4</button>
  <button class="key key--num" data-digit="5">5</button>
  <button class="key key--num" data-digit="6">6</button>
  <button class="key key--op" data-action="operator" data-op="−">−</button>

  <button class="key key--num" data-digit="1">1</button>
  <button class="key key--num" data-digit="2">2</button>
  <button class="key key--num" data-digit="3">3</button>
  <button class="key key--op" data-action="operator" data-op="+">+</button>

  <button class="key key--fn" data-action="backspace" aria-label="Backspace">&#9003;</button>
  <button class="key key--num" data-digit="0">0</button>
  <button class="key key--num" data-action="decimal">.</button>
  <button class="key key--equals" data-action="equals">=</button>
`;

function formatNumber(numStr) {
  if (numStr === "Error") return numStr;
  const num = Number(numStr);
  if (!isFinite(num)) return "Error";
  return Math.abs(num) < 1e15
    ? num.toPrecision(12).replace(/\.?0+$/, "").replace(/\.?0+e/, "e")
    : num.toExponential(6);
}

function compute(a, b, op) {
  const x = Number(a);
  const y = Number(b);
  switch (op) {
    case "+": return x + y;
    case "−": return x - y;
    case "×": return x * y;
    case "÷": return y === 0 ? NaN : x / y;
    default: return y;
  }
}

// Creates one fully independent calculator inside the given cell element.
function createCalculator(cell) {
  cell.innerHTML = `
    <div class="display">
      <div class="expression">&nbsp;</div>
      <div class="result">0</div>
    </div>
    <div class="keypad">${KEYPAD_HTML}</div>
  `;

  const expressionEl = cell.querySelector(".expression");
  const resultEl = cell.querySelector(".result");

  let current = "0";
  let previous = null;
  let operator = null;
  let expressionText = "";
  let chainText = ""; // accumulates the full multi-step expression, e.g. "22 + 44 + 66 +"
  let justEvaluated = false;
  let awaitingOperand = false; // true right after an operator is chosen

  function updateDisplay() {
    expressionEl.textContent = expressionText || "\u00a0";
    resultEl.textContent = current;
  }

  function highlightOperator(op) {
    cell.querySelectorAll(".key--op").forEach((btn) => {
      btn.classList.toggle("is-selected", btn.dataset.op === op);
    });
  }

  function inputDigit(d) {
    if (justEvaluated) {
      current = d;
      expressionText = "";
      justEvaluated = false;
      updateDisplay();
      return;
    }
    if (awaitingOperand) {
      current = d;
      awaitingOperand = false;
      updateDisplay();
      return;
    }
    if (current === "0") current = d;
    else if (current.length < 16) current += d;
    updateDisplay();
  }

  function inputDecimal() {
    if (justEvaluated) {
      current = "0.";
      expressionText = "";
      justEvaluated = false;
      updateDisplay();
      return;
    }
    if (awaitingOperand) {
      current = "0.";
      awaitingOperand = false;
      updateDisplay();
      return;
    }
    if (!current.includes(".")) {
      current += ".";
      updateDisplay();
    }
  }

  function clearAll() {
    current = "0";
    previous = null;
    operator = null;
    expressionText = "";
    chainText = "";
    justEvaluated = false;
    awaitingOperand = false;
    highlightOperator(null);
    updateDisplay();
  }

  function backspace() {
    if (justEvaluated) return;
    current = current.length > 1 ? current.slice(0, -1) : "0";
    updateDisplay();
  }

  function toggleSign() {
    if (current === "0") return;
    current = current.startsWith("-") ? current.slice(1) : "-" + current;
    updateDisplay();
  }

  function applyPercent() {
    current = String(Number(current) / 100);
    updateDisplay();
  }

  function chooseOperator(op) {
    if (operator && previous !== null && !justEvaluated) {
      const result = compute(previous, current, operator);
      const resultStr = isFinite(result) ? formatNumber(String(result)) : "Error";
      chainText += ` ${current} ${op}`;
      previous = resultStr;
      current = resultStr;
    } else {
      chainText = `${current} ${op}`;
      previous = current;
    }
    operator = op;
    expressionText = chainText;
    justEvaluated = false;
    awaitingOperand = true;
    updateDisplay();
    highlightOperator(op);
  }

  function evaluate() {
    if (operator === null || previous === null) return;
    const fullExpression = `${chainText} ${current} =`;
    const rawResult = compute(previous, current, operator);
    const resultStr = isFinite(rawResult) ? formatNumber(String(rawResult)) : "Error";

    current = resultStr;
    expressionText = fullExpression;
    previous = null;
    operator = null;
    chainText = "";
    justEvaluated = true;
    awaitingOperand = false;
    highlightOperator(null);
    updateDisplay();
  }

  cell.querySelectorAll(".key").forEach((btn) => {
    btn.addEventListener("click", () => {
      const digit = btn.dataset.digit;
      const action = btn.dataset.action;

      if (digit !== undefined) {
        inputDigit(digit);
        return;
      }
      switch (action) {
        case "clear": clearAll(); break;
        case "sign": toggleSign(); break;
        case "percent": applyPercent(); break;
        case "decimal": inputDecimal(); break;
        case "backspace": backspace(); break;
        case "operator": chooseOperator(btn.dataset.op); break;
        case "equals": evaluate(); break;
      }
    });
  });

  updateDisplay();
}

const gridEl = document.getElementById("grid");
for (let i = 0; i < 4; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  gridEl.appendChild(cell);
  createCalculator(cell);
}
