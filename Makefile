APP := skeleton_nodejs

APP_CMD := docker-compose --project-name=$(APP)
DB_CMD  := $(APP_CMD) exec db psql -U postgres -d db -c

build:
	$(APP_CMD) build
	$(APP_CMD) pull

start:
	$(APP_CMD) up -d --remove-orphans

stop:
	$(APP_CMD) down

api-clients:
	$(APP_CMD) exec db psql -U postgres -d db -c "SELECT * FROM clients;"

db-reset:
	$(DB_CMD) "DROP SCHEMA public CASCADE; CREATE SCHEMA public; CREATE EXTENSION postgis; CREATE EXTENSION postgis_topology;"
	$(APP_CMD) exec redis redis-cli FLUSHALL
	$(APP_CMD) exec app npm run prepare

geo-update:
	$(APP_CMD) exec app geo update

terminal:
	$(APP_CMD) exec app sh

logs:
	$(APP_CMD) logs -f app db

help:
	@echo "Usage: make build|start|stop|api-clients|db-reset|geo-update|terminal|logs|help"
