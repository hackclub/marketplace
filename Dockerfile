FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN apk add --no-cache openssl
RUN ln -s /usr/lib/libssl.so.3 /lib/libssl.so.3
EXPOSE 4173
EXPOSE 3000
RUN npm ci

COPY . .

CMD ["sh", "-c", "npm run db:deploy && npm run build && npm run preview"]