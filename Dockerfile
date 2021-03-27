FROM node:12.18-alpine
ENV NODE_ENV=production
RUN mkdir -p /app
WORKDIR /app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3002
CMD ["npm", "start"]
