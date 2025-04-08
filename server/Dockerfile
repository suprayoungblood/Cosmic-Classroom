FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies including Anthropic SDK
RUN npm install
RUN npm install @anthropic-ai/sdk

COPY . .

# Set environment variables
ENV OPENAI_API_KEY=dummy-key
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "dev"]