# Use official Node.js LTS version
FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching npm install)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose the backend port
EXPOSE 5000

# Command to start the backend
CMD ["npm", "start"]
