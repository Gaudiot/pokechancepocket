.PHONY: run-backend

run-backend:
	cd backend && go run ./src

run-frontend:
	cd frontend/pokechancepocket && npm run dev

prune-branches:
	@if [ "$$(git rev-parse --abbrev-ref HEAD)" != "development" ]; then \
		echo "Este comando só pode ser executado na branch 'development'"; \
		exit 1; \
	fi
	git fetch -p && git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D
