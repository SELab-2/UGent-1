start:
	docker compose up -d --build

stop:
	docker compose down

lint:
	docker exec pigeonhole-backend flake8 .
	docker exec pigeonhole-frontend npm run lint

superuser:
    docker exec -it pigeonhole-backend python manage.py createsuperuser

reset:
    docker image prune -af
    docker system prune