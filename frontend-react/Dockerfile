FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_URL=/api
COPY package*.json ./
RUN npm ci || npm install
COPY . .
RUN VITE_API_URL=${VITE_API_URL} npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine
USER root
COPY --from=build /app/dist /usr/share/nginx/html
RUN printf '%s\n' \
    'server {' \
    '  listen 8080;' \
    '  server_name _;' \
    '  root /usr/share/nginx/html;' \
    '  index index.html;' \
    '  location = /api { return 308 /api/; }' \
    '  location /api/ {' \
    '    proxy_pass http://ph-backend:8081/api/;' \
    '    proxy_http_version 1.1;' \
    '    proxy_set_header Host $host;' \
    '    proxy_set_header X-Real-IP $remote_addr;' \
    '    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' \
    '    proxy_set_header X-Forwarded-Proto $scheme;' \
    '  }' \
    '  location / {' \
    '    try_files $uri $uri/ /index.html;' \
    '  }' \
    '}' \
    > /etc/nginx/conf.d/default.conf \
    && chgrp -R 0 /etc/nginx /var/cache/nginx /var/run /usr/share/nginx/html \
    && chmod -R g=u /etc/nginx /var/cache/nginx /var/run /usr/share/nginx/html
USER 101
EXPOSE 8080
