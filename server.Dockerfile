FROM node:15-alpine AS BUILD_IMAGE

# https://medium.com/trendyol-tech/how-we-reduce-node-docker-image-size-in-3-steps-ff2762b51d5a

WORKDIR /usr/src/app

COPY . .

# The rimraf node_modules is run before npm ci as otherwise NPM throws a WARN about it

RUN npm install rimraf -g && \
    npm run bootstrap-server:ci && \
    npm run build-common && \
    npm run build-server && \
    rimraf ['node_modules', 'apiclient/node_modules', 'cinema-api/node_modules']

# Install dependencies for production
RUN cd apiclient && \ 
    npm ci --only=production && \
    npm link && \
    cd ../cinema-api && \
    npm ci --only=production && \
    npm link @cinemaplanner/api-client

FROM node:15-alpine AS RUNTIME
RUN apk add --no-cache curl

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/apiclient ./apiclient
COPY --from=BUILD_IMAGE /usr/src/app/cinema-api ./cinema-api

EXPOSE 3000

WORKDIR /usr/src/app/cinema-api
CMD ["npm", "run", "start:prod"]