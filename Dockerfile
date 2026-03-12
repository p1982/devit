FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json nx.json tsconfig.json tsconfig.base.json ./
COPY backend ./backend
COPY frontend ./frontend
COPY packages ./packages

RUN npm install

EXPOSE 3000 4200

CMD ["sh", "-c", "npx nx serve backend --port=3000 --host=0.0.0.0 & npx nx serve frontend --port=4200 --host=0.0.0.0 && wait"]

