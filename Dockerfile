# ─────────────────────────────────────────────────────────────────────────────
# MFA Frontend Template — OpenShift uyumlu multi-stage Docker imajı
# Runtime env: ConfigMap → docker-entrypoint.sh → window.__ENV__ (config.js)
# ─────────────────────────────────────────────────────────────────────────────

# ── Build aşaması ────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# Bağımlılıklar (lock dosyasıyla deterministik kurulum)
COPY package.json package-lock.json ./
RUN npm ci

# Kaynak + production build
COPY . .
RUN npm run build

# ── Runtime aşaması ──────────────────────────────────────────────────────────
# nginx-unprivileged: root olmayan kullanıcı (uid 101), port 8080 — OpenShift dostu
FROM nginxinc/nginx-unprivileged:1.27-alpine

# Angular application builder çıktısı: dist/<proje>/browser/
COPY --from=build /app/dist/sakai-ng/browser/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Runtime env enjeksiyonu: nginx imajının kendi /docker-entrypoint.d/ mekanizması
# bu script'i nginx başlamadan önce çalıştırır.
COPY docker-entrypoint.sh /docker-entrypoint.d/40-mfa-config.sh

USER root
RUN sed -i 's/\r$//' /docker-entrypoint.d/40-mfa-config.sh \
    && chmod +x /docker-entrypoint.d/40-mfa-config.sh \
    # OpenShift rastgele UID + gid 0 ile çalıştırır; config.js'i yazabilmek için
    # html dizinini group-root yazılabilir yap (chmod g=u).
    && chgrp -R 0 /usr/share/nginx/html \
    && chmod -R g=u /usr/share/nginx/html
USER 101

EXPOSE 8080

# CMD taban imajdan miras alınır: nginx -g "daemon off;"
