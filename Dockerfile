# --- Build stage ---
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm ci

# Build
COPY . .
# Optionnel : passer l’URL de l’API au build
# ex: docker build --build-arg VITE_API_URL=https://api.example.com .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# --- Runtime stage ---
FROM nginx:alpine
# Copier le build Vite
COPY --from=build /app/dist /usr/share/nginx/html
# Config Nginx (cache basique + fallback SPA)
RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri /index.html;\n\
  }\n\
  location /assets/ {\n\
    add_header Cache-Control "public, max-age=31536000, immutable";\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]