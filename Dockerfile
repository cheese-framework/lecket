FROM node:lts as dependencies
WORKDIR /admin-dashboard
COPY package.json ./
RUN npm install --frozen-lockfile

FROM node:lts as builder
WORKDIR /admin-dashboard
COPY . .
COPY --from=dependencies /admin-dashboard/node_modules ./node_modules
RUN npm run build

FROM node:lts as runner
WORKDIR /admin-dashboard
ENV NODE_ENV production
# If you are using a custom next.config.js file, uncomment this line.
COPY --from=builder /admin-dashboard/next.config.js ./
COPY --from=builder /admin-dashboard/public ./public
COPY --from=builder /admin-dashboard/.next ./.next
COPY --from=builder /admin-dashboard/node_modules ./node_modules
COPY --from=builder /admin-dashboard/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]