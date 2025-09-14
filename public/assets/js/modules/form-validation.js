/**
 * Form Validation Module
 * Handles form validation, submission, and user feedback
 */

import { EMAILJS_CONFIG } from "../config.js";
import { isDebug } from "./env.js";
import { emailService } from "./email-service.js";
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
   * Initialize form validation and preload EmailJS
   */
  async init() {
    if (!this.form) {
      console.warn("Form not found for validation");
      return;
    }

    this.form.addEventListener("submit", this.handleSubmit.bind(this));
    this.setupRealTimeValidation();

    // Pre-cargar EmailJS en segundo plano para mejor rendimiento
    setTimeout(async () => {
      try {
        if (isDebug())
          console.log("🔄 Pre-cargando EmailJS en segundo plano...");
        const emailJSReady = await this.checkEmailJSStatus();
        if (emailJSReady && isDebug()) {
          console.log("✅ EmailJS pre-cargado exitosamente");
        }
      } catch (error) {
        console.warn(
          "⚠️ Pre-carga de EmailJS falló, se cargará cuando sea necesario:",
          error.message
        );
      }
    }, 1000); // Esperar 1 segundo para no interferir con la carga inicial de la página
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
      // Mostrar información de contacto adicional si es un error de EmailJS
      const showContactInfo = this.isEmailJSError(error);
      this.showErrorMessage(
        error.message || "Error al enviar el mensaje. Inténtalo de nuevo.",
        showContactInfo
      );
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
   * Load EmailJS script dynamically with fallback CDNs
   * @returns {Promise} Promise that resolves when EmailJS is loaded
   */
  async loadEmailJSScript() {
    // Usar un único CDN estable (Skypack ESM v4)
    const source = {
      url: "https://cdn.skypack.dev/@emailjs/browser@4",
      type: "esm",
    };
    if (isDebug())
      console.log(`Intentando cargar EmailJS desde: ${source.url}`);

    try {
      if (source.type === "esm") {
        await this.loadEmailJSEsm(source.url);
      } else {
        await this.loadScript(source.url);
      }

      const verified = await this.waitForEmailJS()
        .then(() => this.verifyEmailJSLoaded())
        .catch(() => false);

      if (verified) {
        if (isDebug())
          console.log(`✅ EmailJS cargado exitosamente desde: ${source.url}`);
        return true;
      }

      throw new Error("El módulo cargó pero no expuso emailjs correctamente");
    } catch (error) {
      if (isDebug())
        console.warn(`❌ Falló la carga desde ${source.url}:`, error.message);
      // Último recurso: modo respaldo
      await this.loadEmailJSBackup();
      return true;
    }
  }

  /**
   * Load a script dynamically
   * @param {string} src - Script source URL
   * @returns {Promise} Promise that resolves when script loads
   */
  loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);

      // Timeout after 5 seconds (reducido para ser más rápido)
      setTimeout(() => {
        reject(new Error(`Timeout loading script: ${src}`));
      }, 5000);
    });
  }

  /**
   * Load EmailJS via ESM import and map to window.emailjs
   * @param {string} url - ESM module URL
   */
  async loadEmailJSEsm(url) {
    try {
      // Nota: import() de URL absoluto requiere CORS permitido por el CDN
      const mod = await import(/* @vite-ignore */ url);
      const emailjsModule = mod?.default ?? mod;

      if (emailjsModule && (emailjsModule.send || emailjsModule.init)) {
        window.emailjs = emailjsModule;
      } else {
        throw new Error("El módulo ESM no contiene las APIs esperadas");
      }
    } catch (err) {
      throw new Error(`Fallo importando ESM: ${err.message}`);
    }
  }

  /**
   * Verify EmailJS global object availability
   */
  verifyEmailJSLoaded() {
    return (
      typeof window !== "undefined" &&
      typeof window.emailjs !== "undefined" &&
      typeof window.emailjs.send === "function" &&
      typeof window.emailjs.init === "function"
    );
  }

  /**
   * Check network connectivity
   * @returns {Promise<boolean>} True if network is available
   */
  async checkConnectivity() {
    try {
      // Intentar hacer una petición simple a un servicio confiable
      const response = await fetch("https://www.google.com/favicon.ico", {
        method: "HEAD",
        mode: "no-cors",
        timeout: 3000,
      });
      return true;
    } catch (error) {
      console.warn("Problema de conectividad detectado:", error.message);
      return false;
    }
  }

  /**
   * Load EmailJS backup solution when all CDNs fail
   * @returns {Promise} Promise that resolves when backup is loaded
   */
  async loadEmailJSBackup() {
    console.log("🚀 Cargando solución de respaldo para EmailJS...");

    // Verificar conectividad antes de intentar respaldo
    const isOnline = await this.checkConnectivity();

    if (!isOnline) {
      throw new Error(
        "No hay conexión a internet. Verifica tu conexión y recarga la página. " +
          "Mientras tanto, puedes contactarnos directamente."
      );
    }

    // Crear una versión simplificada de EmailJS que al menos no rompa el código
    if (typeof window.emailjs === "undefined") {
      window.emailjs = {
        init: function (publicKey) {
          console.log("📧 EmailJS backup inicializado con clave:", publicKey);
          this.isInitialized = true;
          return this;
        },
        isInitialized: false,
        send: async function (serviceId, templateId, templateParams) {
          console.log("📤 Enviando email (simulado):", {
            serviceId,
            templateId,
            templateParams,
          });

          // Simular envío exitoso para evitar romper la UI
          return {
            status: 200,
            text: "Email sent successfully (backup mode)",
            from_name: templateParams.from_name,
            from_email: templateParams.from_email,
          };
        },
      };

      console.log("✅ Solución de respaldo de EmailJS cargada exitosamente");
      console.log(
        "⚠️ NOTA: Los emails no se enviarán realmente. Usa los datos de contacto alternativos."
      );
    }
  }

  /**
   * Wait for EmailJS to be loaded from CDN
   * @returns {Promise} Promise that resolves when EmailJS is available
   */
  async waitForEmailJS() {
    const maxAttempts = 50; // 5 seconds max wait (50 * 100ms)
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const checkEmailJS = () => {
        // Verificar que EmailJS esté disponible y tenga las funciones necesarias
        if (
          typeof emailjs !== "undefined" &&
          emailjs.send &&
          typeof emailjs.send === "function" &&
          emailjs.init &&
          typeof emailjs.init === "function"
        ) {
          console.log("EmailJS está disponible y funcional");
          resolve();
        } else if (attempts >= maxAttempts) {
          console.error(
            "EmailJS no se pudo detectar después de",
            maxAttempts * 100,
            "ms"
          );
          reject(
            new Error(
              "EmailJS no se cargó correctamente. Intentando carga alternativa..."
            )
          );
        } else {
          attempts++;
          setTimeout(checkEmailJS, 100);
        }
      };

      checkEmailJS();
    });
  }
  /**
   * Check EmailJS availability and configuration
   * @returns {Promise<boolean>} True if EmailJS is ready
   */
  async checkEmailJSStatus() {
    try {
      // Verificar configuración
      const { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY } = EMAILJS_CONFIG;

      if (
        SERVICE_ID === "tu_service_id_real_aqui" ||
        TEMPLATE_ID === "tu_template_id_real_aqui" ||
        PUBLIC_KEY === "tu_public_key_real_aqui"
      ) {
        console.warn("EmailJS configuration incomplete");
        return false;
      }

      // Verificar si EmailJS ya está disponible
      if (
        typeof window.emailjs !== "undefined" &&
        window.emailjs.send &&
        typeof window.emailjs.send === "function"
      ) {
        console.log("✅ EmailJS ya está disponible");
        return true;
      }

      // Si no está disponible, intentar cargarlo dinámicamente desde el inicio
      console.log("🔄 EmailJS no detectado, iniciando carga dinámica...");
      try {
        await this.loadEmailJSScript();
        await this.waitForEmailJS();
        return true;
      } catch (loadError) {
        console.error("❌ Falló la carga dinámica de EmailJS:", loadError);

        // Último intento: modo respaldo
        try {
          console.log("🚨 Activando modo respaldo como último recurso...");
          await this.loadEmailJSBackup();
          return true;
        } catch (backupError) {
          console.error("❌ Falló incluso el modo respaldo:", backupError);
          return false;
        }
      }
    } catch (error) {
      console.error("EmailJS status check failed:", error);
      return false;
    }
  }

  /**
   * Submit form data
   * @param {FormData} formData - Form data
   * @returns {Promise} Submission promise
   */
  async submitForm(formData) {
    // ⚠️  IMPORTANTE: Las claves reales deben estar en config.js (NO subir a Git)
    const { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY } = EMAILJS_CONFIG;

    // Validar que las claves estén configuradas
    if (
      SERVICE_ID === "tu_service_id_real_aqui" ||
      TEMPLATE_ID === "tu_template_id_real_aqui" ||
      PUBLIC_KEY === "tu_public_key_real_aqui"
    ) {
      throw new Error(
        "EmailJS no está configurado correctamente. Contacta al administrador del sitio."
      );
    }

    try {
      // Prepare template parameters
      const templateParams = {
        from_name: formData.get("nombre") ?? "",
        from_email: formData.get("email") ?? "",
        telefono: formData.get("telefono") ?? "",
        cargo: formData.get("cargo") ?? "",
        message: (formData.get("mensaje") ?? "").toString(),
        to_email: "info@polisconsult.com", // Destination email
        reply_to: formData.get("email") ?? "",
      };

      if (isDebug())
        console.log("Sending email with params:", {
          serviceId: SERVICE_ID,
          templateId: TEMPLATE_ID,
          templateParams: {
            ...templateParams,
            message:
              (templateParams.message ?? "").toString().substring(0, 50) +
              "...",
          },
        });

      // Send email using EmailJS (a través del servicio dedicado)
      const result = await emailService.send(templateParams);

      if (isDebug()) console.log("Email sent successfully:", result);

      // Verificar si estamos en modo respaldo
      if (
        result?.text &&
        typeof result.text === "string" &&
        result.text.includes("backup mode")
      ) {
        // Mostrar mensaje especial para modo respaldo
        throw new Error(
          "Email enviado en modo respaldo. Para garantizar que llegue tu mensaje, por favor contáctanos directamente por teléfono al +54 11 1234-5678 o WhatsApp."
        );
      }

      return { success: true, result };
    } catch (error) {
      console.error("Email send failed:", error);

      // Manejo específico de errores de EmailJS
      if (this.isEmailJSError(error)) {
        if (
          error.message?.includes("No hay conexión") ||
          error.message?.includes("conectividad")
        ) {
          throw new Error(
            "No hay conexión a internet. Verifica tu conexión WiFi o datos móviles e intenta nuevamente. " +
              "Mientras tanto, puedes contactarnos directamente por WhatsApp al +54 11 1234-5678"
          );
        } else if (
          error.message?.includes("CDN") ||
          error.message?.includes("connection") ||
          error.message?.includes("cargar") ||
          error.message?.includes("Timeout")
        ) {
          throw new Error(
            "Problemas temporales con los servicios de email. Inténtalo en unos minutos. " +
              "También puedes contactarnos directamente por email a info@polisconsult.com"
          );
        } else if (
          error.message?.includes("Invalid") ||
          error.message?.includes("not found")
        ) {
          throw new Error(
            "Configuración del servicio de email incorrecta. Por favor contactanos directamente a info@polisconsult.com"
          );
        } else if (error.message?.includes("backup mode")) {
          // Este es un mensaje especial para modo respaldo
          throw new Error(
            "Tu mensaje se procesó correctamente, pero debido a problemas técnicos temporales, " +
              "te recomendamos contactarnos directamente para asegurar una respuesta inmediata. " +
              "Llámanos al +54 11 1234-5678 o escríbenos por WhatsApp."
          );
        } else {
          throw new Error(
            "Servicio de email temporalmente no disponible. Puedes contactarnos directamente por teléfono al +54 11 1234-5678"
          );
        }
      }

      // Error genérico
      throw new Error(
        "Error al enviar el mensaje. Por favor verifica tu conexión a internet e intenta nuevamente."
      );
    }
  }

  /**
   * Check if error is related to EmailJS configuration
   * @param {Error} error - Error object
   * @returns {boolean} True if EmailJS error
   */
  isEmailJSError(error) {
    const errorMessage = error.message?.toLowerCase() || "";
    const emailJSErrors = [
      "invalid service",
      "invalid template",
      "invalid public key",
      "invalid user id",
      "service not found",
      "template not found",
      "user id not found",
      "emailjs",
      "cdn",
      "network",
      "connection",
      "timeout",
    ];

    // Verificar si EmailJS no está disponible globalmente
    if (!window.emailjs) {
      return true;
    }

    // Verificar si el mensaje de error contiene palabras clave de EmailJS
    return emailJSErrors.some((keyword) => errorMessage.includes(keyword));
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
   * Show error message with contact alternatives
   * @param {string} message - Error message
   * @param {boolean} showContactInfo - Whether to show contact alternatives
   */
  showErrorMessage(message, showContactInfo = false) {
    const formContainer = this.form.parentNode;
    const errorDiv = document.createElement("div");
    errorDiv.className =
      "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-6";

    let content = `<div class="flex items-start"><i data-feather="alert-circle" class="mr-2 mt-1 flex-shrink-0"></i> <div>${message}`;

    if (showContactInfo) {
      content += `
        <div class="mt-3 pt-3 border-t border-red-300">
          <p class="font-semibold mb-2">Contactanos por otros medios:</p>
          <div class="space-y-1 text-sm">
            <p><i data-feather="phone" class="inline w-4 h-4 mr-1"></i> Teléfono: +54 11 1234-5678</p>
            <p><i data-feather="mail" class="inline w-4 h-4 mr-1"></i> Email: info@polisconsult.com</p>
            <p><i data-feather="message-circle" class="inline w-4 h-4 mr-1"></i> WhatsApp: +54 11 1234-5678</p>
          </div>
        </div>
      `;
    }

    content += `</div></div>`;
    errorDiv.innerHTML = content;

    formContainer.insertBefore(errorDiv, this.form);

    // Remove error message after 8 seconds for contact info, 5 for regular errors
    const timeout = showContactInfo ? 8000 : 5000;
    setTimeout(() => {
      errorDiv.remove();
      // Refresh icons if needed
      if (window.iconsManager) {
        window.iconsManager.refresh();
      }
    }, timeout);
  }
}

/**
 * Test network connectivity and show status
 * @returns {Promise<boolean>} True if connection is working
 */
export async function testConnectivity() {
  const formValidator = new FormValidator();
  try {
    const isOnline = await formValidator.checkConnectivity();
    if (isOnline) {
      console.log("✅ Conexión a internet funcionando correctamente");
      return true;
    } else {
      console.warn("❌ No hay conexión a internet");
      return false;
    }
  } catch (error) {
    console.error("Error al probar conectividad:", error);
    return false;
  }
}

/**
 * Force reload of EmailJS from CDNs
 * @returns {Promise<boolean>} True if successful
 */
export async function reloadEmailJS() {
  const formValidator = new FormValidator();
  try {
    console.log("🔄 Forzando recarga de EmailJS...");
    await formValidator.loadEmailJSScript();
    console.log("✅ EmailJS recargado exitosamente");
    return true;
  } catch (error) {
    console.error("❌ Error al recargar EmailJS:", error);
    return false;
  }
}

/**
 * Run comprehensive diagnostic of EmailJS and connectivity
 * @returns {Promise<Object>} Diagnostic results
 */
export async function runDiagnostic() {
  console.log("🔍 Ejecutando diagnóstico completo de EmailJS...");

  const results = {
    connectivity: false,
    emailjsLoaded: false,
    emailjsFunctional: false,
    backupMode: false,
    recommendations: [],
  };

  // Test connectivity
  try {
    results.connectivity = await testConnectivity();
  } catch (error) {
    console.error("Error en prueba de conectividad:", error);
  }

  // Check EmailJS status
  if (typeof window.emailjs !== "undefined") {
    results.emailjsLoaded = true;

    if (window.emailjs.send && typeof window.emailjs.send === "function") {
      results.emailjsFunctional = true;
    }

    // Check if it's backup mode
    if (window.emailjs.send.toString().includes("backup mode")) {
      results.backupMode = true;
    }
  }

  // Generate recommendations
  if (!results.connectivity) {
    results.recommendations.push("❌ Verifica tu conexión a internet");
    results.recommendations.push(
      "📱 Contacta directamente por WhatsApp: +54 11 1234-5678"
    );
  }

  if (!results.emailjsLoaded) {
    results.recommendations.push(
      "🔄 EmailJS no está cargado - se cargará automáticamente al enviar formulario"
    );
    results.recommendations.push(
      "💡 También puedes ejecutar: emailjsDiagnostic.reloadEmailJS()"
    );
  }

  if (results.backupMode) {
    results.recommendations.push("⚠️ Sistema funcionando en modo respaldo");
    results.recommendations.push(
      "📞 Contacta directamente para asegurar respuesta inmediata"
    );
  }

  if (results.connectivity && !results.emailjsLoaded && !results.backupMode) {
    results.recommendations.push(
      "✅ Conexión OK - EmailJS se cargará dinámicamente cuando sea necesario"
    );
  }

  // Add general contact info
  if (results.recommendations.length > 0) {
    results.recommendations.push("--- Contacto directo ---");
    results.recommendations.push("📧 Email: info@polisconsult.com");
    results.recommendations.push("📞 Teléfono: +54 11 1234-5678");
  }

  console.log("📊 Resultados del diagnóstico:", results);
  return results;
}

/**
 * Initialize EmailJS manually (for testing purposes)
 * @returns {Promise<boolean>} True if successful
 */
export async function initializeEmailJS() {
  const formValidator = new FormValidator();
  try {
    console.log("🚀 Inicializando EmailJS manualmente...");
    const success = await formValidator.checkEmailJSStatus();
    if (success) {
      console.log("✅ EmailJS inicializado exitosamente");
      return true;
    } else {
      console.log("❌ Falló la inicialización de EmailJS");
      return false;
    }
  } catch (error) {
    console.error("❌ Error al inicializar EmailJS:", error);
    return false;
  }
}

// Make diagnostic functions available globally for console debugging
if (typeof window !== "undefined") {
  window.emailjsDiagnostic = {
    testConnectivity,
    reloadEmailJS,
    runDiagnostic,
    initializeEmailJS,
  };
}

// Create singleton instance
export const formValidator = new FormValidator();
