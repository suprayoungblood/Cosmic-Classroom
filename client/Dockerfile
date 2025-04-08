FROM node:18-alpine

WORKDIR /app

# Copy the package files first for layer caching
COPY package*.json ./

# Standard install for better compatibility
RUN npm install --force
RUN npm install @tailwindcss/typography --save-dev

# Copy the rest of the application
COPY . .

# Make entrypoint script executable
RUN chmod +x /app/docker-entrypoint.sh

# Set up the right environment
ENV NODE_ENV=development
ENV VITE_API_URL=http://localhost:3000

EXPOSE 5173

# Use entrypoint script to ensure directories exist
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]