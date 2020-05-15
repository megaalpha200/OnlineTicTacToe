FROM node
WORKDIR /app
COPY . /app
RUN npm install -g yarn
RUN yarn global add nodemon
RUN yarn install
CMD ["yarn", "dev"]