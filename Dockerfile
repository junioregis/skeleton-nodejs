ARG IMAGE

FROM ${IMAGE}

ARG APP_PATH="/app"

RUN apk add --update-cache \
    openssh 

RUN npm install -g sequelize-cli

WORKDIR ${APP_PATH}

COPY src/package*.json ./
RUN npm install

COPY src/ ./

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

EXPOSE 3000 9229

ENTRYPOINT [ "entrypoint.sh" ]