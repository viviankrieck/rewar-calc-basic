/**
 * RewaCalc - Calculadora de Pontos de Recompensa
 * @author RewaCalc
 * @version 1.0.0
 */

// Constantes
const CONVERSION_RATE = 163.5; // pontos por R$1
const ANIMATION_DELAY = 500; // ms

// Elementos do DOM
const calculatorForm = document.getElementById("calculator-form");
const pointsInput = document.getElementById("points");
const calculateBtn = document.getElementById("calculate-btn");
const btnText = document.getElementById("btn-text");
const btnLoading = document.getElementById("btn-loading");
const resultDiv = document.getElementById("result");

const contactForm = document.getElementById("contact-form");
const contactBtn = document.getElementById("contact-btn");
const contactBtnText = document.getElementById("contact-btn-text");
const contactBtnLoading = document.getElementById("contact-btn-loading");
const contactSuccess = document.getElementById("contact-success");

/**
 * Formata um número para o padrão brasileiro de moeda
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado em R$
 */
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Formata um número para o padrão brasileiro
 * @param {number} value - Valor a ser formatado
 * @returns {string} Valor formatado
 */
function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

/**
 * Exibe mensagem de resultado com animação
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da mensagem (success ou error)
 */
function showResult(message, type = "success") {
  resultDiv.className = `text-white text-center text-lg min-h-[3rem] flex items-center justify-center ${
    type === "error" ? "text-red-400" : ""
  }`;
  resultDiv.innerHTML = message;
}

/**
 * Alterna o estado de loading do botão
 * @param {boolean} isLoading - Se está carregando
 */
function toggleCalculateLoading(isLoading) {
  calculateBtn.disabled = isLoading;
  btnText.classList.toggle("hidden", isLoading);
  btnLoading.classList.toggle("hidden", !isLoading);
}

/**
 * Valida e calcula o valor dos pontos
 * @param {number} points - Quantidade de pontos
 * @returns {object} Resultado do cálculo
 */
function calculatePoints(points) {
  if (isNaN(points) || points <= 0) {
    return {
      success: false,
      message: "Por favor, insira um número válido de pontos maior que zero.",
    };
  }

  const value = points / CONVERSION_RATE;
  const formattedValue = formatCurrency(value);
  const formattedPoints = formatNumber(points);

  return {
    success: true,
    value: value,
    message: `Você pode resgatar até <em class="italic not-italic">aproximadamente</em> ${formattedValue} em prêmios!`,
  };
}

/**
 * Handler do formulário de cálculo
 */
function handleCalculate(event) {
  event.preventDefault();

  const points = parseFloat(pointsInput.value);

  // Mostra loading
  toggleCalculateLoading(true);

  // Simula processamento (para melhor UX)
  setTimeout(() => {
    const result = calculatePoints(points);
    showResult(result.message, result.success ? "success" : "error");
    toggleCalculateLoading(false);

    // Adiciona efeito de foco no resultado
    if (result.success) {
      resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, ANIMATION_DELAY);
}

/**
 * Valida um campo de formulário
 * @param {HTMLInputElement} field - Campo a ser validado
 * @returns {boolean} Se o campo é válido
 */
function validateField(field) {
  const errorSpan = document.getElementById(`${field.id}-error`);
  let errorMessage = "";

  if (field.validity.valueMissing) {
    errorMessage = "Este campo é obrigatório.";
  } else if (field.validity.typeMismatch && field.type === "email") {
    errorMessage = "Por favor, insira um e-mail válido.";
  } else if (field.validity.tooShort) {
    errorMessage = `Mínimo de ${field.minLength} caracteres.`;
  }

  if (errorMessage) {
    field.classList.add("border-red-500");
    errorSpan.textContent = errorMessage;
    errorSpan.classList.remove("hidden");
    return false;
  } else {
    field.classList.remove("border-red-500");
    field.classList.add("border-green-500");
    errorSpan.classList.add("hidden");
    return true;
  }
}

/**
 * Alterna o estado de loading do botão de contato
 * @param {boolean} isLoading - Se está carregando
 */
function toggleContactLoading(isLoading) {
  contactBtn.disabled = isLoading;
  contactBtnText.classList.toggle("hidden", isLoading);
  contactBtnLoading.classList.toggle("hidden", !isLoading);
}

/**
 * Handler do formulário de contato
 */
function handleContactSubmit(event) {
  event.preventDefault();

  // Valida todos os campos
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const message = document.getElementById("message");

  const isNameValid = validateField(name);
  const isEmailValid = validateField(email);
  const isMessageValid = validateField(message);

  if (!isNameValid || !isEmailValid || !isMessageValid) {
    return;
  }

  // Mostra loading
  toggleContactLoading(true);
  contactSuccess.classList.add("hidden");

  // Simula envio (aqui você implementaria o envio real)
  setTimeout(() => {
    toggleContactLoading(false);
    contactSuccess.classList.remove("hidden");
    contactForm.reset();

    // Remove bordas verdes de validação
    [name, email, message].forEach((field) => {
      field.classList.remove("border-green-500");
    });

    // Scroll para a mensagem de sucesso
    contactSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });

    // Oculta mensagem de sucesso após 5 segundos
    setTimeout(() => {
      contactSuccess.classList.add("hidden");
    }, 5000);
  }, 1500);
}

/**
 * Adiciona validação em tempo real nos campos
 */
function setupRealtimeValidation() {
  ["name", "email", "message"].forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.classList.contains("border-red-500")) {
          validateField(field);
        }
      });
    }
  });
}

/**
 * Adiciona suporte para Enter no campo de pontos
 */
function setupKeyboardSupport() {
  if (pointsInput) {
    pointsInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleCalculate(event);
      }
    });
  }
}

/**
 * Inicialização
 */
function init() {
  // Event listeners
  if (calculatorForm) {
    calculatorForm.addEventListener("submit", handleCalculate);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
    setupRealtimeValidation();
  }

  setupKeyboardSupport();

  console.log("✅ RewaCalc inicializado com sucesso!");
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
