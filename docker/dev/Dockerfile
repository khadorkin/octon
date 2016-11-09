FROM node:7.0.0
# Setup working directory
WORKDIR /usr/src/app
# Copy package.json
COPY package.json /usr/src/app/package.json
# Install dependencies
RUN npm install
# Add code
COPY . /usr/src/app
# Expose express port
EXPOSE 3000
EXPOSE 3020
# Run project
CMD [ "npm", "run", "start:dev" ]
