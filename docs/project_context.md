# Project Beacon — Architecture & Implementation Context Document

> **Purpose**: Use this document as context when prompting an AI to understand what was built, how it was built, and why.

---

## 1. What Is This Project?

**Project Beacon** is a cloud-native Emergency Response Coordination Platform built as **Case Study 47** for a Semester 4 DevOps assignment. It is designed for a fictional national disaster management agency that coordinates hospitals, police, fire services, rescue teams, and government agencies.

The goal was to demonstrate a **complete DevOps lifecycle** on a real working application — not just configuration files.

---

## 2. Application (What Was Built)

### Stack
- **Runtime**: Node.js v24 + Express.js
- **Database**: MongoDB Atlas (cloud-hosted, free tier)
- **Frontend**: Vanilla HTML/CSS/JS (no framework)
- **Font**: Google Fonts — Source Sans 3

### Architecture Pattern
The backend follows a strict **Layered Architecture**:
```
Routes → Controllers → Services → Models → MongoDB
```
Each layer has a single responsibility. The Service layer holds all business logic; Controllers only handle HTTP request/response.

### Backend: Key Files

| File | Role |
|---|---|
| `src/server.js` | Entry point. Calls db.js then starts Express on port 3000 |
| `src/app.js` | Registers middleware (CORS, Morgan logging, JSON parser) and mounts routes |
| `src/config/db.js` | Mongoose connection using `MONGODB_URI` from `.env` |
| `src/models/Incident.js` | Mongoose schema for incidents (title, type, severity, status, location, agencies) |
| `src/models/Resource.js` | Mongoose schema for resources (name, type, status, agency) |
| `src/services/incidentService.js` | All DB queries for incidents (filter, create, update, delete) |
| `src/services/resourceService.js` | All DB queries for resources |
| `src/controllers/incidentController.js` | HTTP handlers that call service methods |
| `src/controllers/resourceController.js` | HTTP handlers that call service methods |
| `src/routes/incidentRoutes.js` | Express router: `/api/incidents` → CRUD |
| `src/routes/resourceRoutes.js` | Express router: `/api/resources` → CRUD |
| `src/middleware/errorHandler.js` | Global error handler with `success: false` JSON format |
| `src/middleware/logger.js` | Morgan HTTP request logger |

### REST API Endpoints

```
GET    /api/health           → System health check
GET    /api/incidents        → List (supports ?status=&severity=&type=)
POST   /api/incidents        → Create
PUT    /api/incidents/:id    → Update
DELETE /api/incidents/:id    → Delete

GET    /api/resources        → List (supports ?status=&type=)
POST   /api/resources        → Create
PUT    /api/resources/:id    → Update
DELETE /api/resources/:id    → Delete
```

### API Response Format (consistent across all endpoints)
```json
{ "success": true, "count": 1, "data": [...] }
{ "success": false, "message": "Error description" }
```

### Frontend: File Structure
```
src/public/
  index.html                   ← Single-page app shell
  assets/
    css/
      variables.css            ← All CSS design tokens / custom properties
      main.css                 ← Full UI stylesheet (imports variables.css)
    js/
      api.js                   ← All fetch() calls to the backend (API module)
      ui.js                    ← Pure rendering helpers (badges, toasts, icons, dates)
      app.js                   ← Main controller (navigation, state, form handlers)
```

### Frontend: Design System
- **Theme**: Government-professional, dark navy (#0d1421 base, #1a2744 navy)
- **Accent**: Government blue (#1d4ed8)
- **Accessibility**: WCAG 2.1 AA compliant — ARIA roles, aria-labels, sr-only labels, focus-visible outlines
- **Features**:
  - Government top banner with classification badge and live IST clock
  - Critical incident alert strip (appears automatically when critical incidents exist)
  - System status pill (green/red based on `/api/health`)
  - Stats cards with color-coded top borders
  - Data tables with severity/status badges (colored + bordered)
  - Resource cards grid
  - Modal dialogs for create/edit (keyboard-closeable with Escape)
  - Toast notifications (success/error/info/warning)
  - Auto-refresh every 30 seconds

### Environment Variables (`.env`)
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/beacon?appName=Cluster0
```

---

## 3. DevOps Lifecycle (What Was Configured)

### Phase 4 — Docker (`docker/`)

| File | Description |
|---|---|
| `docker/Dockerfile` | Multi-stage build: Stage 1 = builder (npm ci), Stage 2 = production (minimal image, non-root user) |
| `docker/docker-compose.yml` | Single-service compose file; reads `.env` for MongoDB URI |

**Build Command:**
```bash
docker-compose -f docker/docker-compose.yml up --build -d
```

### Phase 5 — Jenkins (`jenkins/`)

| File | Description |
|---|---|
| `jenkins/Jenkinsfile` | Declarative pipeline with 5 stages: Checkout, Install Dependencies, Run Tests, Build Docker Image, Push to Registry, Deploy to Kubernetes |

**Key Fix Applied**: Jenkins runs as a Homebrew background service and does not inherit the user's `PATH`. The Jenkinsfile explicitly sets:
```groovy
environment {
    PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
}
```
This ensures `npm` and `docker` are found at `/opt/homebrew/bin/npm`.

**Jenkins Setup**: Installed via `brew install jenkins-lts`, started with `brew services start jenkins-lts`, available at `http://localhost:8080`.

**Pipeline Config in Jenkins UI**:
- Source: Git → `https://github.com/Mishrashivam-SKM/project-beacon`
- Branch: `*/master`
- Script Path: `jenkins/Jenkinsfile`

### Phase 6 — Terraform (`terraform/`)

| File | Description |
|---|---|
| `terraform/provider.tf` | AWS provider, region configurable via variable |
| `terraform/variables.tf` | Input vars: `aws_region`, `cluster_name`, `vpc_cidr`, `environment` |
| `terraform/main.tf` | Defines: VPC, 2 public subnets, Internet Gateway, EKS Cluster, EKS Node Group (t3.medium ×2), IAM Roles |
| `terraform/outputs.tf` | Outputs: cluster endpoint, cluster name, VPC ID |

**Commands:**
```bash
cd terraform/
terraform init     # Downloads AWS provider
terraform plan     # Dry-run: shows what would be created
terraform apply    # Actually provisions (requires AWS credentials)
```

### Phase 7 — Kubernetes (`k8s/`)

| File | Description |
|---|---|
| `k8s/namespace.yaml` | Creates `beacon` namespace |
| `k8s/configmap.yaml` | Stores `NODE_ENV`, `PORT`, `MONGODB_URI` as K8s config |
| `k8s/deployment.yaml` | 2 replicas, liveness + readiness probes on `/api/health`, resource limits |
| `k8s/service.yaml` | NodePort service on port 30000 |
| `k8s/hpa.yaml` | HorizontalPodAutoscaler: scales 2–5 replicas at 70% CPU |
| `k8s/ingress.yaml` | Maps `beacon.local` → service via NGINX Ingress |

**Deploy Commands (Minikube):**
```bash
minikube start --driver=docker
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
kubectl get all -n beacon
minikube service beacon-service -n beacon   # Opens in browser
```

### Phase 8 — Monitoring (`monitoring/`)

| File | Description |
|---|---|
| `monitoring/prometheus-config.yaml` | ConfigMap telling Prometheus to scrape `/api/health` on the app service |
| `monitoring/alerting-rules.yaml` | Fires `InstanceDown` alert if app is down for >1 minute |
| `monitoring/grafana-dashboard.json` | Dashboard JSON with uptime stat and request duration timeseries panels |

### Phase 9 — Logging (`logging/`)

| File | Description |
|---|---|
| `logging/filebeat.yaml` | DaemonSet ConfigMap: Filebeat collects all container logs from `/var/log/containers/` and ships to Elasticsearch at `elasticsearch-master:9200` |

### Phase 10 — Secret Management (`vault/`)

| File | Description |
|---|---|
| `vault/vault-config.yaml` | Vault server config: UI enabled, TCP listener on port 8200, file-based storage |
| `vault/policies/app-policy.hcl` | HCL policy granting `read` + `list` access to `secret/data/beacon/*` |

---

## 4. Repository Structure

```
project-beacon/                     ← Git repository root
├── .env                            ← Local secrets (gitignored)
├── .env.example                    ← Template for .env
├── .gitignore
├── package.json
├── package-lock.json
│
├── src/
│   ├── server.js
│   ├── app.js
│   ├── config/db.js
│   ├── models/
│   │   ├── Incident.js
│   │   └── Resource.js
│   ├── services/
│   │   ├── incidentService.js
│   │   └── resourceService.js
│   ├── controllers/
│   │   ├── incidentController.js
│   │   └── resourceController.js
│   ├── routes/
│   │   ├── incidentRoutes.js
│   │   └── resourceRoutes.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── utils/constants.js
│   └── public/
│       ├── index.html
│       └── assets/
│           ├── css/
│           │   ├── variables.css
│           │   └── main.css
│           └── js/
│               ├── api.js
│               ├── ui.js
│               └── app.js
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── jenkins/
│   └── Jenkinsfile
│
├── terraform/
│   ├── provider.tf
│   ├── variables.tf
│   ├── main.tf
│   └── outputs.tf
│
├── k8s/
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── hpa.yaml
│   └── ingress.yaml
│
├── monitoring/
│   ├── prometheus-config.yaml
│   ├── alerting-rules.yaml
│   └── grafana-dashboard.json
│
├── logging/
│   └── filebeat.yaml
│
├── vault/
│   ├── vault-config.yaml
│   └── policies/app-policy.hcl
│
└── docs/
    ├── commands.md
    ├── implementation_plan.md
    └── project_beacon_reference.md
```

---

## 5. GitHub Repository

- **URL**: `https://github.com/Mishrashivam-SKM/project-beacon`
- **Branches**: `master` (primary, Jenkins uses this), `main` (mirror)
- **Tracked Branches**: Both `master` and `main` are always kept in sync

---

## 6. What Still Needs To Be Done After Frontend Restructure

After the frontend files were moved from `src/public/css/` and `src/public/js/` to `src/public/assets/css/` and `src/public/assets/js/`, you need to:

1. **Commit and push the changes** to GitHub:
   ```bash
   cd /Users/shivammishra/Desktop/Sem04/DEVOPS/project-beacon
   git add .
   git commit -m "Redesign frontend: gov UI + restructure assets"
   git push origin master
   git push origin master:main
   ```
2. **Trigger a new Jenkins build** — click "Build Now" so the pipeline pulls the latest code.
3. **Rebuild the Docker image** if you want to test the new UI inside a container:
   ```bash
   docker-compose -f docker/docker-compose.yml up --build -d
   ```
4. **Verify the UI** in your browser at `http://localhost:3000` — you should see the new government-grade design.
