FROM python:3.8-alpine

ENV WORK_DIR=/home/app/backend

RUN mkdir -p $WORK_DIR
RUN mkdir -p $WORK_DIR/static

WORKDIR $WORK_DIR

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev

RUN pip install --upgrade pip

COPY . $WORK_DIR
RUN pip install -r requirements/production.txt

CMD ["/bin/bash", "/home/app/backend/confs/entrypoint.sh"]
