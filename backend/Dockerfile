FROM node:20 AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

FROM node:20 AS backend-build
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend ./
COPY --from=frontend-build /frontend/dist ./public
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]