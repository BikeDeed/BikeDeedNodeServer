## Specifies the base image we're extending
FROM node:9

## Create base directory
RUN mkdir /src

## Specify the "working directory" for the rest of the Dockerfile
WORKDIR /src

## Install packages using NPM 5 (bundled with the node:9 image)
COPY ./package.json /src/package.json
COPY ./package-lock.json /src/package-lock.json
RUN npm install

## Add application code
COPY ./app.js /src/app.js
COPY ./bin /src/bin
COPY ./lib /src/lib
COPY ./public /src/public
COPY ./routes /src/routes
COPY ./views /src/views
COPY ./build /src/build
COPY ./bikemanufacturers.json /src/bikemanufacturers.json


## Set environment to "development" by default
ENV NODE_ENV development

## Allows port 3000 to be publicly available
EXPOSE 3000

CMD ["npm", "start"]

