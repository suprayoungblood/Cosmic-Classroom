# Cosmic Classroom Docker Commands

.PHONY: help
help:
	@echo "Cosmic Classroom Docker Commands"
	@echo "================================"
	@echo "Development:"
	@echo "  make up              - Start all services"
	@echo "  make down            - Stop all services"
	@echo "  make restart         - Restart all services"
	@echo "  make logs            - Show logs for all services"
	@echo "  make build           - Build all images"
	@echo ""
	@echo "Testing:"
	@echo "  make test            - Run all tests"
	@echo "  make test-server     - Run server tests"
	@echo "  make test-client     - Run client tests"
	@echo "  make test-watch      - Run tests in watch mode"
	@echo "  make test-coverage   - Run tests with coverage"
	@echo "  make test-ui         - Run client tests with UI"
	@echo ""
	@echo "Individual Services:"
	@echo "  make server-shell    - Access server container shell"
	@echo "  make client-shell    - Access client container shell"
	@echo "  make db-shell        - Access database shell"
	@echo ""
	@echo "Database:"
	@echo "  make db-reset        - Reset database"
	@echo "  make db-seed         - Seed database"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean           - Remove all containers and volumes"
	@echo "  make clean-tests     - Remove test containers"

# Development Commands
.PHONY: up
up:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down

.PHONY: restart
restart: down up

.PHONY: logs
logs:
	docker-compose logs -f

.PHONY: build
build:
	docker-compose build

# Testing Commands
.PHONY: test
test:
	@echo "Running all tests..."
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit server-test client-test
	docker-compose -f docker-compose.test.yml down

.PHONY: test-server
test-server:
	@echo "Running server tests..."
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit server-test
	docker-compose -f docker-compose.test.yml down

.PHONY: test-client
test-client:
	@echo "Running client tests..."
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit client-test
	docker-compose -f docker-compose.test.yml down

.PHONY: test-watch
test-watch:
	@echo "Running tests in watch mode..."
	@echo "Server tests: http://localhost:3000"
	@echo "Client tests UI: http://localhost:51204"
	docker-compose -f docker-compose.test.yml up server-test-watch client-test-ui

.PHONY: test-coverage
test-coverage:
	@echo "Running tests with coverage..."
	docker-compose -f docker-compose.test.yml up --abort-on-container-exit server-coverage client-coverage
	docker-compose -f docker-compose.test.yml down
	@echo "Coverage reports generated in ./server/coverage and ./client/coverage"

.PHONY: test-ui
test-ui:
	@echo "Starting Vitest UI on http://localhost:51204..."
	docker-compose -f docker-compose.test.yml up client-test-ui

# Shell Access
.PHONY: server-shell
server-shell:
	docker-compose exec server sh

.PHONY: client-shell
client-shell:
	docker-compose exec client sh

.PHONY: db-shell
db-shell:
	docker-compose exec db psql -U postgres -d cosmic_classroom

# Database Commands
.PHONY: db-reset
db-reset:
	docker-compose exec server npm run db:reset || echo "Create db:reset script in server package.json"
	
.PHONY: db-seed
db-seed:
	docker-compose exec server npm run db:seed || echo "Create db:seed script in server package.json"

# Cleanup Commands
.PHONY: clean
clean:
	docker-compose down -v --remove-orphans
	docker-compose -f docker-compose.test.yml down -v --remove-orphans

.PHONY: clean-tests
clean-tests:
	docker-compose -f docker-compose.test.yml down -v --remove-orphans

# CI Commands (for GitHub Actions)
.PHONY: ci-test
ci-test:
	docker-compose -f docker-compose.test.yml build
	docker-compose -f docker-compose.test.yml run --rm server-test
	docker-compose -f docker-compose.test.yml run --rm client-test
	docker-compose -f docker-compose.test.yml down -v