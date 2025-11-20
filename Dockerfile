FROM node:25-alpine

# Install dependencies for Expo
RUN apk add --no-cache \
    git \
    bash

# Set working directory
WORKDIR /app

# Install Expo CLI globally
RUN npm install -g @expo/cli @expo/ngrok

# Expose Expo dev server port and Metro bundler port
EXPOSE 8081 19000 19001 19002

# Keep container running and start Expo
CMD ["sh", "-c", "npm install --legacy-peer-deps && npx expo start --tunnel"]