FROM node:18-alpine as deps
WORKDIR /app

COPY package.json yarn.lock