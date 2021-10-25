FROM node:14
WORKDIR /castleblock
COPY package.json .
RUN npm install
COPY . .
ARG CONFIG
ENV CONFIG ${CONFIG}
EXPOSE 3000
CMD ["npm", "run", "start", "--", "-c", "${CONFIG}"]
