FROM node:20-alpine AS deps
WORKDIR /app
# (opcjonalnie dla sharp; jeśli kiedyś sypnie błędem, uncomment)
# RUN apk add --no-cache libc6-compat
ENV PRISMA_SKIP_POSTINSTALL_GENERATE=true
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma client wygenerujemy po skopiowaniu schematu:
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm","run","start"]
