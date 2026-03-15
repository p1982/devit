up:
	docker compose up --build

down:
	docker compose down

dev: start

start:
	docker compose up -d redis
	npx nx run-many --target=serve --projects=frontend,backend --parallel=2
