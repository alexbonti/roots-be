FROM node:10

WORKDIR /app
COPY . .

RUN sudo apt-get update 

RUN  sudo apt-get install graphicsmagick

RUN sudo apt-get install imagemagick

EXPOSE 8031

RUN cp .env.example .env

RUN PROJECT_FOLDER=refugee bash setup_upload.sh

RUN npm install

CMD ["npm","start"]
