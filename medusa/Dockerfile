FROM node:20-alpine

WORKDIR /server

COPY package.json ./
RUN npm install --legacy-peer-deps --prefer-offline || npm install --legacy-peer-deps

ENV PATH=/server/node_modules/.bin:$PATH

COPY . .

EXPOSE 9000

CMD ["sh", "start.sh"]
