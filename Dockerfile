FROM ubuntu:trusty
MAINTAINER "Niko Kurtti niko@salaliitto.com"
 
ENV NODE_VER v0.10.25
ENV PORT 9000

RUN apt-get update
RUN apt-get install -y git build-essential libssl-dev curl

RUN groupadd -r koodiklinikka-api && useradd --create-home -r -g koodiklinikka-api koodiklinikka-api

ADD . /home/koodiklinikka/koodiklinikka.fi-api

RUN chown -R koodiklinikka-api:koodiklinikka-api /home/koodiklinikka/koodiklinikka.fi-api

USER koodiklinikka-api

RUN git clone https://github.com/creationix/nvm ~/.nvm 
RUN cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
RUN /bin/bash -c "source ~/.nvm/nvm.sh \
    && nvm install ${NODE_VER} \
    && nvm alias koodiklinikka.fi-api ${NODE_VER}"

WORKDIR /home/koodiklinikka/koodiklinikka.fi-api

RUN /bin/bash -c "source ~/.nvm/nvm.sh \
    && nvm use koodiklinikka.fi-api \
    && npm install"

RUN cp node_modules/newrelic/newrelic.js .
RUN NR_KEY=$(cat config.json |grep newrelic_key|cut -d'"' -f4) && sed -i "s/license key here/$NR_KEY/g" newrelic.js
RUN sed -i "s/My Application/koodiklinikka.fi-api/g" newrelic.js

CMD NODE_ENV=$NODE_ENV PORT=$PORT /bin/bash -c "source ~/.nvm/nvm.sh \
                                                && nvm use koodiklinikka.fi-api \
                                                && node index.js >> ~/koodiklinikka.fi-api.log 2>&1"
EXPOSE $PORT
