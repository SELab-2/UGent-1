start:
	docker compose up -d --build

stop:
	docker compose down

lint:
	docker exec pigeonhole-backend flake8 .
	docker exec pigeonhole-frontend npm run lint

backendtest:
	docker exec -it pigeonhole-backend sh /usr/src/app/backend/runtests.sh