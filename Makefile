.PHONY: all help dev serve test docker-build docker-run clean

help:
	@echo "SPM PNG Studio — Developer Automation CLI"
	@echo "Maintained by SPManchester Private Limited (https://www.spmanchester.com)"
	@echo ""
	@echo "Commands:"
	@echo "  make dev          Start local development server"
	@echo "  make test         Execute automated test suite"
	@echo "  make docker-build Build production Docker container"
	@echo "  make docker-run   Run container on port 8080"
	@echo "  make clean        Clean build artifacts and caches"

dev:
	npm run dev

serve:
	npx serve -l 3000 .

test:
	node tests/converter.test.js

docker-build:
	docker build -t spmanchester/png-studio:latest .

docker-run:
	docker run -p 8080:80 spmanchester/png-studio:latest

clean:
	rm -rf dist build coverage
