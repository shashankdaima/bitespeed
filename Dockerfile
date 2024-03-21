FROM ubuntu

WORKDIR /app

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get update -y
RUN apt-get install -y nodejs

COPY . /app

RUN npm install
RUN npm run build
CMD [ "npm", "start" ]
