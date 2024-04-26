FROM node:20-alpine

WORKDIR /src

COPY ["package.json", "package.json"]
COPY ["package-lock.json", "package-lock.json"]

#RUN chown -R node:node /src
USER node

RUN npm ci --production

COPY . .


EXPOSE 3000
CMD ["npm", "start"]