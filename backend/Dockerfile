# Use Node 16 LTS which has better compatibility with the current TypeScript version
FROM node:16-alpine 

# Set the working directory
WORKDIR /app

# Install necessary dependencies including build tools for bcrypt
RUN apk update && apk add --no-cache postgresql-client python3 make g++

# Copy package files ONLY
COPY package.json package-lock.json* ./

# Install dependencies and ensure bcrypt is built properly
RUN npm ci --quiet --build-from-source

# Manually ensure correct typescript version
RUN npm uninstall typescript && npm install typescript@4.9.5 --save-dev

# Show typescript version for debugging
RUN npx tsc --version

# Copy the rest of the application code
COPY . .

# Copy wait script and make executable
COPY wait-for-db.sh ./
RUN chmod +x ./wait-for-db.sh

# Build the TypeScript code
RUN npx tsc --outDir dist

# Remove dev dependencies AFTER build
RUN npm prune --production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Expose the application port
EXPOSE 3001

# Run wait script, then migrations, then start the node app
# If seed data is needed, you can run: docker-compose exec api node /app/dist/db/seed.js
CMD ["sh", "-c", "./wait-for-db.sh db npm run migrate && node /app/dist/server.js"] 