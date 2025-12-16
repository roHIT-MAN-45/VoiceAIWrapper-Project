FROM node:20-alpine

WORKDIR /app

# copy package files
COPY package*.json ./

# install dependencies
RUN npm ci

# copy source code
COPY . .

# expose vite dev server port
EXPOSE 5173

# start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

