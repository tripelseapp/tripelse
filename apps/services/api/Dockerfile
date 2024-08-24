# Stage 1: Development
FROM node:20 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @nestjs/cli pnpm 

RUN pnpm install

COPY . .

# Run the build to generate the dist folder
RUN pnpm build

# Expose the port that the app will run on
EXPOSE 4000

# Default command for development
CMD ["npm","run", "start:dev"]

# Stage 2: Production
FROM node:20 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g pnpm 

RUN pnpm install --only=production


COPY . .

# Ensure that the dist folder is created and copied correctly
COPY --from=development /usr/src/app/dist ./dist

# Expose the port that the app will run on
EXPOSE 4000

# Command to run the application in production
CMD ["node", "dist/main.js"]
