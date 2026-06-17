# Address Book

A web application to manage a phone address book — create, edit, and delete contacts stored in a PostgreSQL database.

---

## Tech Stack

| Layer     | Technology                                           |
|-----------|------------------------------------------------------|
| Backend   | Python 3.11, FastAPI, SQLAlchemy (async), asyncpg   |
| Frontend  | React 18, TypeScript (strict), Vite, shadcn/ui, Tailwind CSS |
| Database  | PostgreSQL 16                                        |
| Container | Docker (multi-stage for frontend), nginx             |
| Orchestration | Kubernetes (k3s), ArgoCD, Traefik Ingress, Cloudflare Tunnel |

---

## Prerequisites

- Python 3.11+
- Node.js 20+
- Docker
- A running PostgreSQL 16 instance (for local development)
- `kubectl` + `helm` (for cluster deployment)
- ArgoCD installed in the cluster (for GitOps deploy)

---

## Local Development

### Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the API server (connects to localhost:5432 by default)
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server (proxies /api to http://localhost:8000)
npm run dev
```

The UI will be available at `http://localhost:5173`.

---

## Environment Variables

### Backend

| Variable        | Default                                                                        | Description                          |
|-----------------|--------------------------------------------------------------------------------|--------------------------------------|
| `DATABASE_URL`  | `postgresql+asyncpg://addressbook:addressbook123@localhost:5432/addressbook`   | SQLAlchemy async database URL        |
| `CORS_ORIGINS`  | `http://localhost:5173`                                                        | Comma-separated allowed CORS origins |

### Frontend

| Variable        | Default | Description                                     |
|-----------------|---------|-------------------------------------------------|
| `VITE_API_URL`  | `/api`  | Base URL for API calls (overridden by Vite proxy in dev) |

---

## Build and Push Docker Images

```bash
# Backend
docker build -t ghcr.io/vito-filo/addressbook/addressbook-backend:latest ./backend
docker push ghcr.io/vito-filo/addressbook/addressbook-backend:latest

# Frontend
docker build -t ghcr.io/vito-filo/addressbook/addressbook-frontend:latest ./frontend
docker push ghcr.io/vito-filo/addressbook/addressbook-frontend:latest
```

---

## Deploy on k3s with ArgoCD

### First-time setup

1. Build and push the Docker images (see section above).
5. Create the namespace and the database secret manually (never committed to git):

```bash
kubectl create namespace addressbook
kubectl create secret generic addressbook-db-secret \
  --namespace=addressbook \
  --from-literal=POSTGRES_DB=addressbook \
  --from-literal=POSTGRES_USER=addressbook \
  --from-literal=POSTGRES_PASSWORD=<your-password>
```

6. Push the code to git, then apply the ArgoCD application:

```bash
kubectl apply -f argocd/app.yaml
```

ArgoCD will apply all manifests in `k8s/` automatically. The backend and postgres pods will read credentials from the secret created in step 5.


### Updating the application

```bash
# Rebuild and push new images
docker build -t ghcr.io/vito-filo/addressbook/addressbook-backend:latest ./backend && \
docker push ghcr.io/vito-filo/addressbook/addressbook-backend:latest

# Force pod restart (ArgoCD uses :latest tag — must restart to pull new image)
kubectl rollout restart deployment/addressbook-backend -n addressbook
kubectl rollout restart deployment/addressbook-frontend -n addressbook
```

### Checking status

```bash
# Pod status
kubectl get pods -n addressbook

# Backend logs
kubectl logs -f deployment/addressbook-backend -n addressbook

# Frontend logs
kubectl logs -f deployment/addressbook-frontend -n addressbook
```

---

## Project Structure

```
addressbook/
├── CLAUDE.md                  ← autonomous implementation instructions
├── README.md                  ← this file
├── decisions.md               ← log of all autonomous decisions
├── docs/
│   ├── requirements.md        ← functional requirements
│   ├── style-guide            ← UI style guide
│   └── deploy.md              ← deployment guide
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py                ← FastAPI app init
│   ├── models.py              ← SQLAlchemy ORM model
│   ├── schemas.py             ← Pydantic v2 schemas
│   ├── database.py            ← engine, session, get_db
│   └── routers/
│       └── contacts.py        ← CRUD endpoints
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── api/contacts.ts
│       ├── components/
│       │   ├── ContactTable.tsx
│       │   ├── ContactForm.tsx
│       │   ├── ConfirmDialog.tsx
│       │   └── ui/            ← shadcn/ui components
│       ├── hooks/useContacts.ts
│       └── types/contact.ts
├── k8s/
│   ├── namespace.yaml
│   ├── postgres.yaml
│   ├── backend.yaml
│   ├── frontend.yaml
│   └── ingress.yaml
└── argocd/
    └── app.yaml
```

---

## Decisions Log

All autonomous implementation decisions (library choices, error handling strategies, deviations from the requirements) are documented in [`decisions.md`](./decisions.md).
