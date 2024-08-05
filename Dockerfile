FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Bundle app source
COPY . .

EXPOSE 80
CMD [ "nodemon", "server.js" ]

# docker run -p 8000:80 -v C:\Users\user\Desktop\Projects\store_registration_module:/usr/src/app sha256:f7de53cbcbe1b9fb3c459673649cf92f4349ff094a60c55c3444c4afa0a33f41
# docker build .
