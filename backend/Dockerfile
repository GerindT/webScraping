FROM ghcr.io/puppeteer/puppeteer:20.9.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci
RUN npm install -g bun
COPY . .
CMD [ "bun", "app.js" ]