FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the rest of the app
COPY . .

# Use non-root user for security
RUN addgroup -S app && adduser -S app -G app
USER app

# Expose the port
EXPOSE 5000

# Run the app
CMD ["npm", "start"]
