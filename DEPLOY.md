# Deploy — k3s + ArgoCD

## Architecture

```
Internet → Cloudflare Tunnel → Traefik Ingress (k3s)
                                    ├── /      → addressbook-frontend (nginx)
                                    └── /api/  → addressbook-backend (FastAPI)
                                                      └── addressbook-postgres
```

All resources run in the `addressbook` namespace.

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

## First-time Setup

### 1. Create secrets (never committed to git)

```bash
kubectl create namespace addressbook

# Database credentials
kubectl create secret generic addressbook-db-secret \
  --namespace=addressbook \
  --from-literal=POSTGRES_DB=addressbook \
  --from-literal=POSTGRES_USER=addressbook \
  --from-literal=POSTGRES_PASSWORD=<your-password>

# ghcr.io pull secret (images are private)
kubectl create secret docker-registry ghcr-secret \
  --namespace=addressbook \
  --docker-server=ghcr.io \
  --docker-username=vito-filo \
  --docker-password=<github-pat>
```

### 2. Apply the ArgoCD application

```bash
kubectl apply -f argocd/app.yaml
```

ArgoCD syncs automatically from `master`. It will create the namespace (if missing) and apply all manifests in `k8s/`.

> **Note**: the two secrets above must exist before the pods start — ArgoCD does not create them.

---

## Updating the Application

```bash
# Rebuild and push new images
docker build -t ghcr.io/vito-filo/addressbook/addressbook-backend:latest ./backend && \
docker push ghcr.io/vito-filo/addressbook/addressbook-backend:latest

# Force pod restart (ArgoCD uses :latest — pods must restart to pull new image)
kubectl rollout restart deployment/addressbook-backend deployment/addressbook-frontend -n addressbook
```

---

## Checking Status

```bash
kubectl get pods -n addressbook
kubectl logs -f deployment/addressbook-backend -n addressbook
kubectl logs -f deployment/addressbook-frontend -n addressbook
```
