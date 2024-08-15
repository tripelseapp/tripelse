# Stage 1: Development
FROM node:20 AS development

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencia
COPY package*.json ./

# Instala las dependencias necesarias globalmente
RUN npm install -g @nestjs/cli

# Instala todas las dependencias del proyecto
RUN npm install

# Copia todo el código de la aplicación
COPY . .

# Expone el puerto que usará la aplicación
EXPOSE 4000

# Comando por defecto para desarrollo
CMD ["npm", "run", "start:dev"]

# Stage 2: Production
FROM node:20 AS production

# Establece un argumento para definir el entorno
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de dependencia (solo los necesarios para producción)
COPY package*.json ./

# Instala solo las dependencias necesarias para producción
RUN npm install --only=production

# Copia el resto del código y artefactos de la construcción
COPY . .

# Copia los artefactos de la construcción desde la etapa de desarrollo
COPY --from=development /usr/src/app/dist ./dist

# Expone el puerto que usará la aplicación en producción
EXPOSE 4000

# Comando para ejecutar la aplicación en producción
CMD ["node", "dist/main.js"]
