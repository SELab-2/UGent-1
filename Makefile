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

backendtest:
	docker exec -it pigeonhole-backend sh /usr/src/app/backend/runtests.sh

backendshell:
	docker exec -it pigeonhole-backend sh

frontshell:
	docker exec -it pigeonhole-frontend sh