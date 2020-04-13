APP  := main

CMD := docker-compose --project-name=$(APP) --file docker-compose.yml

start:
	$(info Starting)
	$(CMD) up -d --remove-orphans

stop:
	$(info Stopping)
	$(CMD) down

restart:
	$(info Restarting)
	@make -s stop
	@make -s start

logs:
	$(CMD) logs -f