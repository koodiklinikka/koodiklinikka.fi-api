FROM ubuntu:trusty
MAINTAINER "Niko Kurtti niko@salaliitto.com"
 
ENV NODE_VER v0.10.25
ENV PORT 9000

RUN apt-get update
RUN apt-get install -y git build-essential libssl-dev curl

RUN git clone https://github.com/creationix/nvm ~/.nvm 
RUN cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
RUN /bin/bash -c "source ~/.nvm/nvm.sh \
    && nvm install ${NODE_VER} \
    && nvm alias koodiklinikka.fi-api ${NODE_VER}"

ADD . /koodiklinikka.fi-api
WORKDIR /koodiklinikka.fi-api

RUN /bin/bash -c "source ~/.nvm/nvm.sh \
    && nvm use koodiklinikka.fi-api \
    && npm install"

CMD NODE_ENV=$NODE_ENV PORT=$PORT /bin/bash -c "source ~/.nvm/nvm.sh \
                                                && nvm use koodiklinikka.fi-api \
                                                && node index.js >> /var/log/koodiklinikka.fi-api.log 2>&1"
EXPOSE $PORT
