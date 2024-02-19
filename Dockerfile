FROM node:21.0-alpine3.18
RUN addgroup app && adduser -S -G app app
USER app
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
