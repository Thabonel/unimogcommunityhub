# Dockerfile for Supabase Edge Function Deployment
FROM node:18-alpine

# Install Supabase CLI
RUN npm install -g supabase@latest

# Install curl for health checks
RUN apk add --no-cache curl

# Create working directory
WORKDIR /app

# Copy supabase config and functions
COPY supabase ./supabase
COPY package.json ./
COPY .env* ./

# Create deployment script
COPY deploy.sh ./deploy.sh
RUN chmod +x ./deploy.sh

# Set default command
CMD ["./deploy.sh"]