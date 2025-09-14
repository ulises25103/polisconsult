/**
 * Email Service
 * Carga el SDK de EmailJS, lo inicializa y envía correos
 */

import { EMAILJS_CONFIG } from "../config.js";
import { isDebug } from "./env.js";

class EmailService {
  constructor() {
    this.loaded = false;
    this.initing = false;
  }

  async ensureReady() {
    // Validar configuración (solo que no estén vacías)
    const { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY } = EMAILJS_CONFIG;
    const serviceId = (SERVICE_ID ?? "").toString().trim();
    const templateId = (TEMPLATE_ID ?? "").toString().trim();
    const publicKey = (PUBLIC_KEY ?? "").toString().trim();

    if (!serviceId || !templateId || !publicKey) {
      throw new Error(
        "EmailJS no está configurado. Configura tus claves en config.js"
      );
    }

    // Si ya está disponible, salir
    if (window.emailjs && window.emailjs.send && window.emailjs.init) {
      if (!window.emailjs.isInitialized) {
        window.emailjs.init(publicKey);
      }
      this.loaded = true;
      return true;
    }

    // Cargar SDK desde UMD con fallback
    await this.loadSdkWithFallback();

    if (!window.emailjs || !window.emailjs.send || !window.emailjs.init) {
      throw new Error("No se pudo cargar EmailJS desde los CDNs disponibles");
    }

    // Inicializar
    if (!window.emailjs.isInitialized) {
      window.emailjs.init(publicKey);
    }

    this.loaded = true;
    return true;
  }

  async send(templateParams) {
    await this.ensureReady();
    const { SERVICE_ID, TEMPLATE_ID } = EMAILJS_CONFIG;
    return window.emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
  }

  async loadSdkWithFallback() {
    const urls = [
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/emailjs.min.js",
      "https://unpkg.com/@emailjs/browser@4/dist/emailjs.min.js",
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/emailjs.min.js",
      "https://unpkg.com/@emailjs/browser@3/dist/emailjs.min.js",
    ];

    for (const url of urls) {
      try {
        await this.injectScript(url, 8000);
        if (window.emailjs && window.emailjs.send && window.emailjs.init) {
          if (isDebug()) console.log(`EmailJS SDK cargado: ${url}`);
          return true;
        }
      } catch (e) {
        // Probar siguiente
      }
    }
    throw new Error("Fallo carga SDK EmailJS");
  }

  injectScript(src, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`No se pudo cargar: ${src}`));
      document.head.appendChild(script);

      const t = setTimeout(() => {
        reject(new Error(`Timeout cargando: ${src}`));
      }, timeoutMs);

      script.addEventListener("load", () => clearTimeout(t));
      script.addEventListener("error", () => clearTimeout(t));
    });
  }
}

export const emailService = new EmailService();
