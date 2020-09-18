FROM node:14-alpine

ARG APP_PATH="/app"

WORKDIR ${APP_PATH}

COPY ./app/package*.json ./

RUN npm install

COPY ./app/ ${APP_PATH}

EXPOSE 3000 5858 9229

CMD npm run dev
