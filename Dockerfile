# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application's dependencies
RUN npm install

# Bundle your app source
COPY . .

# Expose the port your application will run on
EXPOSE 3000

# Define the command to start your application
CMD [ "node", "index.js" ]
