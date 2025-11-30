FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

ENV PORT=3001
EXPOSE 3001

CMD ["npm", "start"]
