/**
 * Animations Module
 * Handles AOS (Animate On Scroll) initialization and custom animations
 */

export class AnimationsManager {
  constructor() {
    this.aosConfig = {
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    };
  }

  /**
   * Initialize AOS library
   */
  init() {
    if (typeof AOS !== "undefined") {
      AOS.init(this.aosConfig);
      console.log("Animations initialized successfully");
    } else {
      console.warn("AOS library not loaded");
    }
  }

  /**
   * Refresh AOS animations (useful after dynamic content changes)
   */
  refresh() {
    if (typeof AOS !== "undefined") {
      AOS.refresh();
    }
  }

  /**
   * Custom fade-in animation for elements
   * @param {HTMLElement} element - Element to animate
   * @param {number} delay - Delay in milliseconds
   */
  fadeInElement(element, delay = 0) {
    if (!element) return;

    setTimeout(() => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";
      element.style.transition = "opacity 0.6s ease, transform 0.6s ease";

      // Force reflow
      element.offsetHeight;

      element.style.opacity = "1";
      element.style.transform = "translateY(0)";
    }, delay);
  }

  /**
   * Animate counter numbers
   * @param {HTMLElement} element - Element containing number to animate
   * @param {number} target - Target number
   * @param {number} duration - Animation duration in milliseconds
   */
  animateCounter(element, target, duration = 2000) {
    if (!element) return;

    const start = parseInt(element.textContent) || 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }
}

// Create singleton instance
export const animationsManager = new AnimationsManager();
