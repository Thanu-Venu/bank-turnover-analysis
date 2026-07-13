FROM node:18

WORKDIR /app

# Copy package files first to leverage layer caching
COPY package.json package-lock.json* /app/

RUN npm ci --silent

# Copy source
COPY . /app

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
