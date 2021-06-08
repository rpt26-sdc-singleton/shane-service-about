FROM node:14
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
# RUN npm install pm2 -g
CMD ["npm", "run", "start"]
