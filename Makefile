start:
	docker compose up -d

stop:
	docker compose down

lint:
	docker exec pigeonhole-backend flake8 .
	docker exec pigeonhole-frontend npm run lint