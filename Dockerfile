FROM node:lts

RUN mkdir -p /app

WORKDIR /app
COPY package.json /app

RUN npm config set registry https://registry.npmmirror.com
RUN npm i -g pnpm
RUN pnpm install

COPY . /app/
RUN pnpm build

EXPOSE 80
CMD ["npm", "start"]