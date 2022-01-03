FROM python:3.8-alpine

ENV WORK_DIR=/home/apps/qwerty

RUN mkdir -p $WORK_DIR/static

WORKDIR $WORK_DIR

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update \
    && apk add --no-cache build-base postgresql-dev gcc python3-dev py-pip py3-pip \
    musl-dev jpeg-dev zlib-dev libffi-dev libpcap-dev libpq-dev cairo-dev pango-dev gdk-pixbuf nodejs npm

RUN pip install --upgrade pip

COPY . $WORK_DIR
RUN mv backend/qwerty/settings/.env.prod backend/qwerty/settings/.env

RUN pip install --no-cache-dir -r backend/requirements/production.txt
RUN npm update -g
RUN npm --prefix frontend install

CMD ["/bin/bash", "/home/apps/qwerty/confs/entrypoint.sh"]
