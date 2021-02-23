FROM node:14.15-alpine as build

WORKDIR /app

ENV CI=true

COPY . .

RUN npm install
RUN npm run build

FROM node:14.15-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist/src ./dist/src

RUN npm install --only=production

EXPOSE 3000
CMD [ "npm", "start" ]
