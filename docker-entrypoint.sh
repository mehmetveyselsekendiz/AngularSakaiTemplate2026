#!/bin/sh
# ─────────────────────────────────────────────────────────────────────────────
# Runtime env enjeksiyonu — OpenShift ConfigMap / ortam değişkenlerini
# window.__ENV__ olarak config.js'e yazar. nginx imajının /docker-entrypoint.d/
# mekanizması bu script'i nginx başlamadan ÖNCE çalıştırır.
# ─────────────────────────────────────────────────────────────────────────────
set -e

CONFIG_FILE=/usr/share/nginx/html/config.js

cat > "$CONFIG_FILE" <<EOF
window.__ENV__ = {
  SSO_URL: "${SSO_URL:-}",
  CLIENT_ID: "${CLIENT_ID:-}",
  REDIRECT_URI: "${REDIRECT_URI:-}",
  POST_LOGOUT_URI: "${POST_LOGOUT_URI:-}",
  API_URL: "${API_URL:-}",
  PORTAL_URL: "${PORTAL_URL:-https://www.mfa.gov.tr}"
};
EOF

echo "[mfa] config.js ortam değişkenlerinden üretildi."
