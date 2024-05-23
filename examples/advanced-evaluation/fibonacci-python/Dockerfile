FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

VOLUME /usr/src/submission
VOLUME /usr/out/artifacts

WORKDIR /usr/

COPY eval.py ./eval.py

ENTRYPOINT ["python", "eval.py"]