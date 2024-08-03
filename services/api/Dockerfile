# Stage 1: Development
FROM node:20 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g @nestjs/cli


RUN npm install

COPY . .

COPY .env ./


# Build the NestJS application
RUN npm run build

# Expose the port on which the app will run
EXPOSE 4000



# Stage 2: Production
FROM node:20 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

COPY . .

COPY .env ./


# Copy build artifacts from development stage
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]
