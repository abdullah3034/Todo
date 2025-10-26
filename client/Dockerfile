FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose React dev server port
EXPOSE 3000

# Start React development server
CMD ["npm", "start"]