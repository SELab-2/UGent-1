# pull official base image
FROM python:3.11.7-alpine

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev docker-cli

# install dependencies
RUN pip install --upgrade pip
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY backend/entrypoint.sh .
RUN sed -i 's/\r$//g' /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# copy manage.py
COPY manage.py .

# copy scripts
COPY scripts ./scripts

# copy project
COPY backend ./backend

# run entrypoint.sh
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]