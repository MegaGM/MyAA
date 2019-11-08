FROM node:lts-alpine

RUN mkdir -p /myaa
WORKDIR /myaa
EXPOSE 7700

CMD ["npm", "run", "start:docker"]
