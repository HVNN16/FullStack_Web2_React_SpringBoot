##FROM ubuntu:latest
##LABEL authors="Admin"
##
##ENTRYPOINT ["top", "-b"]
## Stage 1: Build React app
#FROM node:20 AS build
#WORKDIR /app
#COPY package*.json ./
#RUN npm install
#COPY . .
#RUN npm run build
## => tạo thư mục dist/
## Stage 2: Serve bằng nginx
#FROM nginx:alpine
#COPY --from=build /app/dist /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Build React app
FROM node:20 AS build
WORKDIR /app

# Copy package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Nhận biến môi trường từ docker-compose
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build app với biến môi trường đã truyền
RUN npm run build

# Stage 2: Serve bằng nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy file build từ stage 1
COPY --from=build /app/dist .

# Copy config mặc định của nginx
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
