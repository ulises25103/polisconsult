/**
 * Main JavaScript Entry Point
 * Initializes all modules and core functionality
 */

import { AnimationsManager } from "./modules/animations.js";
import { IconsManager } from "./modules/icons.js";
import { FormValidator } from "./modules/form-validation.js";
import { muteConsoleLogsInProd, isDebug } from "./modules/env.js";

// Initialize global managers
window.animationsManager = new AnimationsManager();
window.iconsManager = new IconsManager();
window.formValidator = new FormValidator();

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Silenciar logs en producción
  muteConsoleLogsInProd();
  if (isDebug()) console.log("PolisConsult website initializing...");

  // Initialize animations
  window.animationsManager.init();

  // Initialize icons
  window.iconsManager.init();

  // Initialize form validation
  window.formValidator.init();

  // Initialize navigation
  initNavigation();

  // Initialize smooth scrolling
  initSmoothScrolling();

  if (isDebug()) console.log("PolisConsult website ready!");
});

/**
 * Initialize mobile navigation
 */
function initNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      navToggle.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!navToggle?.contains(e.target) && !navMenu?.contains(e.target)) {
      navMenu?.classList.remove("active");
      navToggle?.classList.remove("active");
    }
  });
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();

        const headerHeight = document.querySelector("nav")?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Close mobile menu if open
        document.querySelector(".nav-menu")?.classList.remove("active");
        document.querySelector(".nav-toggle")?.classList.remove("active");
      }
    });
  });
}

/**
 * Utility function to check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is visible
 */
function isElementInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export for potential use by other scripts
export { debounce, isElementInViewport };
