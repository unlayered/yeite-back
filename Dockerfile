FROM node:21.0-alpine3.18
RUN addgroup -S app && adduser -S app -G app
USER app
WORKDIR /app
COPY --chown=app:node package*.json .
RUN npm install
COPY --chown=app:node . .
EXPOSE 3000
ENTRYPOINT ["npm","start"]