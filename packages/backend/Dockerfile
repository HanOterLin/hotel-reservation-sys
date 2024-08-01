# Build stage
FROM node:20-alpine as build

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN npm install -g pnpm
COPY . .
RUN pnpm install
RUN pnpm -r run build

# Production stage
FROM node:20-alpine as production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/packages/backend ./

# Install only production dependencies
# RUN npm install --prod

CMD ["npm", "start"]