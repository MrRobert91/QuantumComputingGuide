# Frontend: build the Vite SPA, then serve it statically with nginx.
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# nginx config is a template: the entrypoint renders ${BACKEND_URL} at runtime.
COPY default.conf.template /etc/nginx/templates/default.conf.template

# Default backend address (overridden by the BACKEND_URL env var, e.g. on Sliplane).
ENV BACKEND_URL=http://backend:8000

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
