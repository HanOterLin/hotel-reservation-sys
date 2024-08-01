# Build stage
FROM node:20-alpine as build

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pnpm
COPY . .
RUN pnpm install
RUN pnpm -r run build

# Production stage
FROM node:20-alpine as production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/packages/backend ./
RUN npm config set registry https://registry.npmmirror.com

# Install only production dependencies
RUN npm install --omit=dev

CMD ["npm", "start"]