# Address Book

A web application to manage a phone address book — create, edit, and delete contacts stored in a PostgreSQL database.

---

## Tech Stack

| Layer    | Technology                                                   |
| -------- | ------------------------------------------------------------ |
| Backend  | Python 3.13, FastAPI, SQLAlchemy (async), asyncpg            |
| Frontend | React 18, TypeScript (strict), Vite, shadcn/ui, Tailwind CSS |
| Database | PostgreSQL 16                                                |

---

## Run locally with Docker Compose

The quickest way — no Python or Node.js required.

```bash
docker compose up --build
```

The app will be available at `http://localhost`. To stop:

```bash
docker compose down        # stop
docker compose down -v     # stop and delete the database volume
```

---

## Manual local development

### Backend

First, start a PostgreSQL container:

```bash
docker run -d --name addressbook-postgres \
  -e POSTGRES_DB=addressbook \
  -e POSTGRES_USER=addressbook \
  -e POSTGRES_PASSWORD=addressbook123 \
  -p 5432:5432 \
  postgres:16-alpine
```

Then start the API:

```bash
cd backend

python3.13 -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

export POSTGRES_USER=addressbook
export POSTGRES_PASSWORD=addressbook123
export POSTGRES_HOST=localhost
export POSTGRES_DB=addressbook

uvicorn main:app --reload
```

API available at `http://localhost:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

UI available at `http://localhost:5173`. The dev server proxies `/api` to `http://localhost:8000`.

---

## Environment Variables

### Backend

All four are required — the app crashes on startup if any is missing.

| Variable            | Description       |
| ------------------- | ----------------- |
| `POSTGRES_USER`     | Database user     |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_HOST`     | Database hostname |
| `POSTGRES_DB`       | Database name     |

### Frontend

| Variable       | Default | Description                    |
| -------------- | ------- | ------------------------------ |
| `VITE_API_URL` | `/api`  | Base URL used for API requests |

---

## Project Structure

```
addressbook/
├── README.md
├── DEPLOY.md                  ← k3s / ArgoCD deploy instructions
├── docker-compose.yml
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
│   ├── vite.config.ts
│   ├── index.html
│   └── src/
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
│   ├── middleware.yaml
│   └── ingress.yaml
└── argocd/
    └── app.yaml
```
