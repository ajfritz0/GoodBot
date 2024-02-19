FROM --platform=linux/arm/v7 node:slim
WORKDIR /usr/src/alabastor
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]