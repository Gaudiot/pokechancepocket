.PHONY: run-backend

run-backend:
	cd backend && go run ./src

run-frontend:
	cd frontend/pokechancepocket && npm run dev
