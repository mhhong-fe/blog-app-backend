# 使用官方 Node.js 镜像作为构建基础镜像
FROM node:18-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm@8.7.0

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml（如果有的话）到工作目录
COPY package*.json pnpm-lock.yaml* ./

# 安装应用依赖
RUN pnpm install

# 复制应用源代码到工作目录
COPY . .

# 暴露端口 4000
EXPOSE 4000

# 启动应用程序
CMD ["npm", "run", "start"]

