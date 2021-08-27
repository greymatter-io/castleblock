FROM docker-di2e.di2e.net/adx-base-images/adx-image-alpine-3-base-ccp:latest
USER root
RUN mv /etc/apk/repositories /tmp/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/main" >> /etc/apk/repositories && \
    echo "http://dl-cdn.alpinelinux.org/alpine/latest-stable/community" >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache nodejs npm yarn && \
    apk upgrade && \
    rm -f /etc/apk/repositories && \
    mv /tmp/repositories /etc/apk/repositories && \
    apk update
#Verify that the binaries are accessible.
RUN echo "node: $(node --version)"
RUN echo "npm: $(npm --version)"

RUN mkdir /service && chown -R 1000:1000 /service


WORKDIR /service

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY . .
ARG NPM_TOKEN
COPY .docker-npmrc .npmrc

RUN npm install && rm -f .npmrc

# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source

RUN chown -R 1000:1000 /service
USER 1000
EXPOSE 3000
CMD ["npm", "run", "start"]
