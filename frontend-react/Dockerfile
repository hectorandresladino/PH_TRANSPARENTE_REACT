FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_URL=/api
COPY package*.json ./
RUN npm install
COPY . .
RUN VITE_API_URL=${VITE_API_URL} npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
