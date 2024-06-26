start:
	docker compose up -d --build

stop:
	docker compose down

lint:
	docker exec pigeonhole-backend flake8 .
	docker exec pigeonhole-frontend npm run lint

superuser:
	docker exec -it pigeonhole-backend python manage.py createsuperuser

mockdata:
	docker exec -it pigeonhole-backend python manage.py runscript mockdata

registry:
	docker build examples/advanced-evaluation/always-succeed -t test-always-succeed
	docker tag test-always-succeed localhost:5000/test-always-succeed
	docker push localhost:5000/test-always-succeed
	docker build examples/advanced-evaluation/helloworld -t test-helloworld
	docker tag test-helloworld localhost:5000/test-helloworld
	docker push localhost:5000/test-helloworld
	docker build examples/advanced-evaluation/fibonacci-python -t fibonacci-python
	docker tag fibonacci-python localhost:5000/fibonacci-python
	docker push localhost:5000/fibonacci-python

evaltest:
	docker exec -it pigeonhole-backend python manage.py runscript eval_test

submit:
	docker exec -it pigeonhole-backend python manage.py runscript submit

reset:
	docker image prune -af
	docker system prune

backendtest:
	docker exec -it pigeonhole-backend sh /usr/src/app/backend/runtests.sh

backendshell:
	docker exec -it pigeonhole-backend sh

frontshell:
	docker exec -it pigeonhole-frontend sh

componenttest:
	docker exec -it pigeonhole-frontend npx jest

coveragecomponenttest:
	docker exec -it pigeonhole-frontend npx jest --coverage --silent

silentcomponenttest:
	docker exec -it pigeonhole-frontend npx jest --silent

resetdb:
	docker exec pigeonhole-backend python manage.py flush --noinput
	docker exec -it pigeonhole-backend python manage.py runscript mockdata

prodregistry:
	docker build examples/advanced-evaluation/always-succeed -t test-always-succeed
	docker tag test-always-succeed sel2-1.ugent.be:2002/test-always-succeed
	docker push sel2-1.ugent.be:2002/test-always-succeed
	docker build examples/advanced-evaluation/helloworld -t test-helloworld
	docker tag test-helloworld sel2-1.ugent.be:2002/test-helloworld
	docker push sel2-1.ugent.be:2002/test-helloworld
	docker build examples/advanced-evaluation/fibonacci-python -t fibonacci-python
	docker tag fibonacci-python sel2-1.ugent.be:2002/fibonacci-python
	docker push sel2-1.ugent.be:2002/fibonacci-python