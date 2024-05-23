FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /usr/src

COPY eval.py ./eval.py

ENTRYPOINT ["python", "eval.py"]