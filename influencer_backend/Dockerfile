# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Alpinedoes not include the crypto module
RUN apk add --no-cache libc6-compat bash curl

RUN mkdir -p /usr/local/share/ca-certificates && \
    curl -sSL -o /usr/local/share/ca-certificates/rds-ca-bundle.pem \
    https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem

ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/rds-ca-bundle.pem

EXPOSE 3000

CMD ["node", "dist/main.js"]
