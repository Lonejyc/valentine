# On utilise l'image officielle Bun (Debian) pour une meilleure compatibilité
FROM oven/bun:1.1 AS base
WORKDIR /app

# --- Étape 1 : Installation ---
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# --- Étape 2 : Build ---
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# On build l'app Vite (génère le dossier /dist)
ENV NODE_ENV production
RUN bun run build

# --- Étape 3 : Serveur de production ---
# Pour du React pur (SPA), on a besoin d'un petit serveur pour servir les fichiers statiques
FROM nginx:alpine AS release
# On copie le build de Vite vers le dossier nginx
COPY --from=prerelease /app/dist /usr/share/nginx/html
# On ajoute une config minimaliste pour gérer le routing React (React Router)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]