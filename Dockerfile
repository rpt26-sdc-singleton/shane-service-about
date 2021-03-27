FROM node:14
ENV NODE_ENV=production
ENV ABOUT_MONGODB_URI="mongodb://localhost:27017/about"
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3002
RUN pwd
CMD ["npm", "run", "start"]
