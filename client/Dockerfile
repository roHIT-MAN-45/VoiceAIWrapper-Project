# base node image
FROM node:20-alpine

# set working directory
WORKDIR /app

# copy package files
COPY package.json package-lock.json ./

# install dependencies
RUN npm ci --no-audit --no-fund

# copy application source
COPY . .

# expose vite dev server port
EXPOSE 5173

# start vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
