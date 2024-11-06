# Use an official and verified Docker image as a base image (this matches any IP on the system)
# Pin the version instead of using the latest tag
FROM node:18-alpine as build-stage

# Set working directory
WORKDIR /torstone-intelligence-react

# Use .dockerignore to skip copying node_modules, add only the files needed for building the app
# Copy package files and install dependencies first for better caching
COPY package*.json tsconfig.json ./
RUN npm install

# Copy only necessary directories/files (Use a .dockerignore file to exclude unnecessary files)
COPY public/ public/
COPY src/ src/

# Build the app
RUN npm run build

# Multi-stage build: Use a smaller base image to reduce final image size
FROM nginx:alpine as production-stage

# Copy build artifacts from the build stage
COPY --from=build-stage /torstone-intelligence-react/build /usr/share/nginx/html

# Optionally, copy Nginx configuration
# COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]