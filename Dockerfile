FROM node:20
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --force --omit=dev
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build
CMD ["node", "dist/server.js"]
