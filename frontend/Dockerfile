# Use the official Node.js image as the base image
FROM node:latest as build-stage

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Use Nginx to serve the React app
FROM nginx:stable-alpine

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the build stage
COPY --from=build-stage /app/build /usr/share/nginx/html

# Expose the port the app will run on
EXPOSE 3000

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]