FROM node AS builder
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/nginx/app.conf /etc/nginx/conf.d/default.conf

# FROM nginx:alpine
# COPY ./build /usr/share/nginx/html
# COPY ./nginx/app.conf /etc/nginx/conf.d/default.conf