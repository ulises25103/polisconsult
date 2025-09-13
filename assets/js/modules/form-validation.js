/**
 * Form Validation Module
 * Handles form validation, submission, and user feedback
 */

export class FormValidator {
  constructor(formSelector = "form") {
    this.form = document.querySelector(formSelector);
    this.submitBtn = this.form?.querySelector('button[type="submit"]');
    this.validationRules = {
      nombre: {
        required: true,
        message: "El nombre es obligatorio",
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Ingresa un email válido",
      },
      telefono: {
        required: true,
        message: "El teléfono es obligatorio",
      },
      cargo: {
        required: true,
        message: "El cargo/organización es obligatorio",
      },
      mensaje: {
        required: true,
        minLength: 10,
        message: "El mensaje debe tener al menos 10 caracteres",
      },
    };
  }

  /**
   * Initialize form validation
   */
  init() {
    if (!this.form) {
      console.warn("Form not found for validation");
      return;
    }

    this.form.addEventListener("submit", this.handleSubmit.bind(this));
    this.setupRealTimeValidation();
  }

  /**
   * Setup real-time validation for form fields
   */
  setupRealTimeValidation() {
    Object.keys(this.validationRules).forEach((fieldId) => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener("blur", () => this.validateField(fieldId));
        field.addEventListener("input", () => this.clearFieldError(fieldId));
      }
    });
  }

  /**
   * Handle form submission
   * @param {Event} e - Submit event
   */
  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setLoadingState(true);

    try {
      // Simulate API call - replace with actual submission
      await this.submitForm(new FormData(this.form));
      this.showSuccessMessage();
      this.form.reset();
    } catch (error) {
      this.showErrorMessage("Error al enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * Validate entire form
   * @returns {boolean} True if form is valid
   */
  validateForm() {
    let isValid = true;

    // Clear previous errors
    this.clearAllErrors();

    // Validate each field
    Object.keys(this.validationRules).forEach((fieldId) => {
      if (!this.validateField(fieldId)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate single field
   * @param {string} fieldId - Field ID to validate
   * @returns {boolean} True if field is valid
   */
  validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const rules = this.validationRules[fieldId];

    if (!field || !rules) return true;

    const value = field.value.trim();
    let isValid = true;
    let message = rules.message;

    // Required validation
    if (rules.required && !value) {
      isValid = false;
    }

    // Pattern validation
    if (rules.pattern && value && !rules.pattern.test(value)) {
      isValid = false;
    }

    // Min length validation
    if (rules.minLength && value && value.length < rules.minLength) {
      isValid = false;
    }

    if (!isValid) {
      this.showFieldError(fieldId, message);
    }

    return isValid;
  }

  /**
   * Show error for specific field
   * @param {string} fieldId - Field ID
   * @param {string} message - Error message
   */
  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add("border-red-500");

    // Remove existing error
    const existingError = field.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add new error
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message text-red-500 text-sm mt-1";
    errorDiv.textContent = message;

    field.parentNode.appendChild(errorDiv);
  }

  /**
   * Clear error for specific field
   * @param {string} fieldId - Field ID
   */
  clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.remove("border-red-500");

    const error = field.parentNode.querySelector(".error-message");
    if (error) {
      error.remove();
    }
  }

  /**
   * Clear all form errors
   */
  clearAllErrors() {
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    document
      .querySelectorAll(".border-red-500")
      .forEach((el) => el.classList.remove("border-red-500"));
  }

  /**
   * Set loading state for submit button
   * @param {boolean} loading - Loading state
   */
  setLoadingState(loading) {
    if (!this.submitBtn) return;

    this.submitBtn.disabled = loading;
    this.submitBtn.textContent = loading ? "Enviando..." : "Enviar Mensaje";
  }

  /**
   * Submit form data
   * @param {FormData} formData - Form data
   * @returns {Promise} Submission promise
   */
  async submitForm(formData) {
    // Simulate API call - replace with actual endpoint
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success (90% success rate)
        if (Math.random() > 0.1) {
          resolve({ success: true });
        } else {
          reject(new Error("Submission failed"));
        }
      }, 2000);
    });
  }

  /**
   * Show success message
   */
  showSuccessMessage() {
    const formContainer = this.form.parentNode;
    const successDiv = document.createElement("div");
    successDiv.className =
      "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-6";
    successDiv.innerHTML =
      '<div class="flex items-center"><i data-feather="check-circle" class="mr-2"></i> ¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.</div>';

    formContainer.insertBefore(successDiv, this.form);

    // Remove success message after 5 seconds
    setTimeout(() => {
      successDiv.remove();
      // Refresh icons if needed
      if (window.iconsManager) {
        window.iconsManager.refresh();
      }
    }, 5000);
  }

  /**
   * Show error message
   * @param {string} message - Error message
   */
  showErrorMessage(message) {
    const formContainer = this.form.parentNode;
    const errorDiv = document.createElement("div");
    errorDiv.className =
      "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-6";
    errorDiv.innerHTML = `<div class="flex items-center"><i data-feather="alert-circle" class="mr-2"></i> ${message}</div>`;

    formContainer.insertBefore(errorDiv, this.form);

    // Remove error message after 5 seconds
    setTimeout(() => {
      errorDiv.remove();
      // Refresh icons if needed
      if (window.iconsManager) {
        window.iconsManager.refresh();
      }
    }, 5000);
  }
}

// Create singleton instance
export const formValidator = new FormValidator();
