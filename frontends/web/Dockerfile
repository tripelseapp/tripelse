# Stage 1: Development
FROM node:20 AS development

WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the development port
EXPOSE 3000

# Start the Next.js development server with hot-reloading
CMD ["npm", "run", "docker-dev"]

# Stage 2: Production
FROM node:20 AS production

WORKDIR /usr/src/app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy all files (using a .dockerignore to exclude unnecessary files)
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port for the Next.js app
EXPOSE 3000

# Command to start the application in production
CMD ["npm", "run", "start"]
