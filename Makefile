APP := skeleton

ENV_FILE := deploy.env

ifndef STAGE
ifneq ("$(wildcard $(ENV_FILE))", "")
STAGE := $(shell sed -n 's/NODE_ENV=\(.*\)/\1/p' < $(ENV_FILE))
else
$(error STAGE is undefined)
endif
endif

ifndef DOMAIN
ifneq ("$(wildcard $(ENV_FILE))", "")
DOMAIN := $(shell sed -n 's/VIRTUAL_HOST=\(.*\)/\1/p' < $(ENV_FILE))
else
$(error DOMAIN is undefined)
endif
endif

CMD := docker-compose --project-name=$(APP) \
                      --file docker-compose.yml \
                      --file docker-compose.prd.yml

config:
	$(CMD) config

build:
	@echo "NODE_ENV=$(STAGE)\nVIRTUAL_HOST=$(DOMAIN)\nLETSENCRYPT_HOST=$(DOMAIN)\nLETSENCRYPT_EMAIL=webmaster@$(DOMAIN)" > $(ENV_FILE)

	$(CMD) build
	$(CMD) pull

start:
	$(CMD) up -d --remove-orphans

stop:
	$(CMD) down

restart:
	@make -s start
	@make -s stop

show-clients:
	${CMD} exec db psql -U postgres -d db -c "SELECT * FROM clients;"

logs:
	$(CMD) logs -f

help:
	echo "Usage: make DOMAIN=url \
	                  STAGE=<staging|production> \
                      config|first-deploy|deploy|build|start|stop|restart|show-clients|logs|help"