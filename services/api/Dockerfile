# Stage 1: Development
FROM node:16 AS development

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies including @nestjs/cli locally
RUN npm install -g @nestjs/cli
RUN npm install

COPY . .

COPY .env .env.development ./


# Build the NestJS application
RUN npm run build

# Expose the port on which the app will run
EXPOSE 3001



# Stage 2: Production
FROM node:16 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

COPY . .

COPY .env .env.production ./


# Copy build artifacts from development stage
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]
