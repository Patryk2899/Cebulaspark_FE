include .env
export

all: | build up

.PHONY: build
build:
	docker-compose -f docker-compose.dev.yml build

.PHONY: up
up:
	docker-compose -f docker-compose.dev.yml up

.PHONY: down
down: | docker-down

.PHONY: restart
restart: | docker-restart