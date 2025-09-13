/**
 * Icons Module
 * Handles Feather Icons initialization and management
 */

export class IconsManager {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize Feather Icons
   */
  init() {
    if (typeof feather !== "undefined") {
      feather.replace();
      this.isInitialized = true;
      console.log("Feather Icons initialized successfully");
    } else {
      console.warn("Feather Icons library not loaded");
    }
  }

  /**
   * Refresh icons (useful after dynamic content changes)
   */
  refresh() {
    if (typeof feather !== "undefined") {
      feather.replace();
    }
  }

  /**
   * Replace icons in a specific container
   * @param {HTMLElement} container - Container element to search for icons
   */
  replaceInContainer(container) {
    if (typeof feather !== "undefined" && container) {
      feather.replace({ scope: container });
    }
  }

  /**
   * Create an icon element
   * @param {string} iconName - Name of the Feather icon
   * @param {Object} attributes - Additional attributes for the icon
   * @returns {HTMLElement} Icon element
   */
  createIcon(iconName, attributes = {}) {
    const icon = document.createElement("i");
    icon.setAttribute("data-feather", iconName);

    // Apply additional attributes
    Object.keys(attributes).forEach((attr) => {
      if (attr === "className") {
        icon.className = attributes[attr];
      } else {
        icon.setAttribute(attr, attributes[attr]);
      }
    });

    return icon;
  }

  /**
   * Get icon SVG as string
   * @param {string} iconName - Name of the Feather icon
   * @param {Object} attributes - Icon attributes
   * @returns {string} SVG string
   */
  getIconSVG(iconName, attributes = {}) {
    // This would require accessing Feather's internal icon data
    // For now, return a placeholder
    return `<i data-feather="${iconName}" ${Object.entries(attributes)
      .map(([k, v]) => `${k}="${v}"`)
      .join(" ")}></i>`;
  }
}

// Create singleton instance
export const iconsManager = new IconsManager();
