FROM node

RUN mkdir -p /app

WORKDIR /app
COPY package.json /app

RUN npm config set registry https://registry.npmmirror.com && npm install

COPY . /app/
RUN npm run build

EXPOSE 80
VOLUME [ "/data" ]
CMD ["npm", "start"]