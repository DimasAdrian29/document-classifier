# --- STAGE 1: Build React App ---
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- STAGE 2: Serve dengan Nginx ---
FROM nginx:alpine

# Copy hasil build React dari Stage 1 ke folder Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy konfigurasi custom Nginx proxy yang sudah kita buat tadi
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]