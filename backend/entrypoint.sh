#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

#python manage.py flush --no-input
#python manage.py makemigrations
python manage.py migrate

python manage.py runscript push_site

python manage.py createsuperuser --noinput --email $DJANGO_SUPERUSER_EMAIL

docker login $REGISTRY_URL -u $REGISTRY_USER -p $REGISTRY_PASSWORD

exec "$@"