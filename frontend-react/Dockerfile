#FROM ubuntu:latest
#LABEL authors="Admin"
#
#ENTRYPOINT ["top", "-b"]
# Stage 1: Build React app
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# => tạo thư mục dist/
# Stage 2: Serve bằng nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]