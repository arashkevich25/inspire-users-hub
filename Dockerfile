FROM mhart/alpine-node:10 AS builder
WORKDIR /app
ARG CODEARTIFACT_AUTH_TOKEN
ENV CODEARTIFACT_AUTH_TOKEN=${CODEARTIFACT_AUTH_TOKEN}
COPY .npmrc /app/
COPY ./package.json ./
RUN apk add --no-cache make gcc g++ python && \
  npm install
COPY . .
RUN npm run build && \
  apk del make gcc g++ python

FROM mhart/alpine-node:10
WORKDIR /app
ARG CODEARTIFACT_AUTH_TOKEN
ENV CODEARTIFACT_AUTH_TOKEN=${CODEARTIFACT_AUTH_TOKEN}
COPY --from=builder /app/ ./
EXPOSE 3001 5672 50051
CMD [ "npm", "run", "start:prod" ]
