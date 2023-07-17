FROM node:lts

RUN mkdir -p /app

WORKDIR /app
COPY package.json /app

RUN npm config set registry https://registry.npmmirror.com && npm i -g pnpm && pnpm install

COPY . /app/
RUN pnpm build

EXPOSE 80
VOLUME [ "/data" ]
CMD ["npm", "start"]