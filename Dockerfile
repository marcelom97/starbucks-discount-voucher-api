FROM node:current-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y dos2unix

COPY scripts/wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh

RUN dos2unix /usr/wait-for-it.sh && apt-get --purge remove -y dos2unix && rm -rf /var/lib/apt/lists/*

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 5000

CMD [ "yarn", "start" ]