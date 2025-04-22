FROM node:18-bullseye-slim

# Instala las dependencias que requiere Chromium.
# Nota: libglib2.0-0 provee libgobject-2.0.so.0
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgbm1 \
  libgcc1 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json ./
# If package-lock.json exists, it won't be copied, ensuring fresh install per package.json
RUN npm install
RUN npm install openai@4.4.0 --no-save
COPY . .
CMD ["node", "src/index.js"]
