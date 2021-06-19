FROM node:14
ENV NODE_ENV=production
ENV NR_NATIVE_METRICS_NO_DOWNLOAD=true
ENV NR_NATIVE_METRICS_NO_BUILD=true
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY .env .
COPY . .
EXPOSE 3002
# build client
RUN npx webpack --config ./webpack.production.config.js
# run production version of node
CMD ["node", "./server/index.js"]
