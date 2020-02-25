FROM node:12.16.1-stretch-slim
ENV DEBCONF_NOWARNINGS yes
RUN apt-get update
RUN apt-get install git -y
RUN git clone --depth 1 https://github.com/dev-protocol/event_explorer.git
WORKDIR event_explorer
RUN npm i
