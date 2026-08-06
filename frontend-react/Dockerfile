FROM node:20-alpine AS build
WORKDIR /workspace
ARG VITE_API_URL=/api
ARG VITE_SELF_REGISTRATION_ENABLED=false
COPY package*.json ./
RUN npm ci
COPY . .
RUN VITE_API_URL=${VITE_API_URL} VITE_SELF_REGISTRATION_ENABLED=${VITE_SELF_REGISTRATION_ENABLED} npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine
USER root
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/dist /usr/share/nginx/html
RUN chgrp -R 0 /etc/nginx /var/cache/nginx /var/run /usr/share/nginx/html \
    && chmod -R g=u /etc/nginx /var/cache/nginx /var/run /usr/share/nginx/html
USER 101
EXPOSE 8080
