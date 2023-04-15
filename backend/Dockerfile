# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

RUN npx prisma generate

# Build the Nest.js application
RUN npm run build

# Expose the port the app will run on
EXPOSE 4242

# Start the application
CMD ["npm", "run", "start:prod"]