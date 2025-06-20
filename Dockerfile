# syntax=docker/dockerfile:experimental
# build environment
FROM node:16.17.0-alpine as build
WORKDIR /app
COPY package.json .
COPY .npmrc .
COPY . /app
RUN npm install
ENV ASSET_PATH=GATEWAY_URL/Mouksha1/build/
RUN npm run prod
RUN npm run doc

# production environment
FROM  pentab.azurecr.io/nginx:1.16.0-alpine
WORKDIR /app
RUN apk add --no-cache --upgrade bash
RUN apk --no-cache add zip
RUN apk add nano
COPY --from=build /app/dist /usr/share/nginx/html
COPY run.sh /app
EXPOSE 80
CMD ["bash", "run.sh"]
