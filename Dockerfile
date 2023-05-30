FROM node:20-alpine AS development
ENV NODE_ENV development
WORKDIR /front

COPY package.json .
COPY yarn.lock .
RUN yarn install

COPY . .

EXPOSE 8080

CMD ["yarn", "start"]