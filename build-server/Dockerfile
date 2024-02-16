FROM ubuntu:focal

RUN apt-get update
RUN apt-get install -y curl

#install node on ubuntu
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y nodejs

#install git 
RUN apt-get install git -y

# working dir
WORKDIR /home/app

# copy the file
COPY main.sh main.sh
COPY script.js script.js
COPY package*.json .

RUN npm install

#GIVE PERMISSION TO EXEC
RUN chmod +x main.sh
RUN chmod +x script.js

ENTRYPOINT ["/home/app/main.sh"]