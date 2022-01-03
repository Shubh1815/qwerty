FROM python:3.8-alpine

ENV WORK_DIR=/home/apps/qwerty

RUN mkdir -p $WORK_DIR
RUN mkdir -p $WORK_DIR/static

WORKDIR $WORK_DIR

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev nodejs npm

RUN pip install --upgrade pip

COPY . $WORK_DIR
RUN pip install -r backend/requirements/production.txt
RUN npm --prefix /frontend install

CMD ["/bin/bash", "/home/apps/qwerty/confs/entrypoint.sh"]
