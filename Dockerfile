FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build static assets
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:3000}
RUN npm run build

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Copy app build and nginx config
COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
