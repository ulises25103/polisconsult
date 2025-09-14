#!/bin/bash
mkdir -p public/assets/js
cat > public/assets/js/config.js << EOF
export const EMAILJS_CONFIG = {
    SERVICE_ID: "${SERVICE_ID}",
    TEMPLATE_ID: "${TEMPLATE_ID}",
    PUBLIC_KEY: "${PUBLIC_KEY}"
};

export const SITE_CONFIG = {
    DEBUG: ${SITE_DEBUG:-false}
};
EOF
