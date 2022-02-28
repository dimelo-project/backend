FROM node:12-alpine3.11 As development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --global pm2
RUN apk add --no-cache --virtual .gyp python make g++ pkgconfig pixman-dev cairo-dev pango-dev
RUN npm install

COPY . .

RUN npm run build

FROM node:12-alpine3.11 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --global pm2
RUN apk add --no-cache --virtual .gyp python make g++ pkgconfig pixman-dev cairo-dev pango-dev
RUN npm install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]