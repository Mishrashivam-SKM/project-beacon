# Project Beacon — Complete Implementation Plan

> **Goal**: Build an Emergency Incident Management Portal, then wrap the full DevOps lifecycle around it. Every deliverable from the checklist will be covered.

---

## What You'll Build (Big Picture)

```mermaid
graph TB
    subgraph "Phase 1-3: The Application"
        APP["Emergency Incident<br/>Management Portal"]
        BE["Backend API<br/>(Node.js + Express)"]
        FE["Frontend Dashboard<br/>(HTML/CSS/JS)"]
        DB["Database<br/>(MongoDB)"]
        APP --> BE
        APP --> FE
        BE --> DB
    end

    subgraph "Phase 4-10: The DevOps Lifecycle"
        DOCKER["Docker<br/>Containerization"]
        JENKINS["Jenkins<br/>CI/CD Pipeline"]
        TERRAFORM["Terraform<br/>Infrastructure"]
        K8S["Kubernetes<br/>Deployment"]
        PROM["Prometheus +<br/>Grafana Monitoring"]
        ELK["ELK Stack<br/>Logging"]
        VAULT["Vault<br/>Secrets"]
    end

    APP --> DOCKER --> JENKINS --> K8S
    TERRAFORM --> K8S
    K8S --> PROM
    K8S --> ELK
    VAULT --> K8S

    style APP fill:#4CAF50,color:#fff
    style DOCKER fill:#00BCD4,color:#fff
    style JENKINS fill:#FF9800,color:#fff
    style K8S fill:#9C27B0,color:#fff
    style PROM fill:#F44336,color:#fff
    style ELK fill:#795548,color:#fff
    style VAULT fill:#607D8B,color:#fff
    style TERRAFORM fill:#E91E63,color:#fff
```

---

## Final Project Folder Structure

This is what your project will look like when complete:

```
project-beacon/
├── src/                          # ── APPLICATION SOURCE CODE ──
│   ├── config/                   #   Database & app configuration
│   │   └── db.js
│   ├── controllers/              #   Request handlers (thin, call services)
│   │   ├── incidentController.js
│   │   └── resourceController.js
│   ├── middleware/                #   Auth, error handling, logging
│   │   ├── errorHandler.js
│   │   └── logger.js
│   ├── models/                   #   Database schemas (Mongoose)
│   │   ├── Incident.js
│   │   └── Resource.js
│   ├── routes/                   #   API route definitions
│   │   ├── incidentRoutes.js
│   │   └── resourceRoutes.js
│   ├── services/                 #   Business logic layer
│   │   ├── incidentService.js
│   │   └── resourceService.js
│   ├── utils/                    #   Helper functions & constants
│   │   └── constants.js
│   ├── public/                   #   Frontend (HTML/CSS/JS dashboard)
│   │   ├── index.html
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       └── app.js
│   ├── app.js                    #   Express app setup
│   └── server.js                 #   Entry point
│
├── tests/                        # ── TESTS ──
│   └── incident.test.js
│
├── docker/                       # ── DOCKER ──
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── jenkins/                      # ── CI/CD ──
│   └── Jenkinsfile
│
├── terraform/                    # ── INFRASTRUCTURE AS CODE ──
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── provider.tf
│
├── k8s/                          # ── KUBERNETES ──
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   └── configmap.yaml
│
├── monitoring/                   # ── PROMETHEUS + GRAFANA ──
│   ├── prometheus-config.yaml
│   ├── grafana-dashboard.json
│   └── alerting-rules.yaml
│
├── logging/                      # ── ELK STACK ──
│   ├── elasticsearch.yaml
│   ├── logstash.yaml
│   ├── kibana.yaml
│   └── filebeat.yaml
│
├── vault/                        # ── SECRET MANAGEMENT ──
│   ├── vault-config.yaml
│   └── policies/
│       └── app-policy.hcl
│
├── docs/                         # ── DOCUMENTATION ──
│   ├── architecture-diagram.png
│   ├── deployment-diagram.png
│   ├── disaster-recovery-plan.md
│   └── screenshots/
│
├── .env.example                  # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## Technology Choices (and Why)

| Tool | What It Does | Why We Use It |
|---|---|---|
| **Node.js + Express** | Backend API server | Simple, fast to learn, huge community |
| **MongoDB** | Database | Stores incidents, resources; flexible schema |
| **HTML/CSS/JS** | Frontend dashboard | No framework overhead, easy to understand |
| **Docker** | Packages app into containers | "Works on my machine" → works everywhere |
| **Jenkins** | Automates build/test/deploy | Industry-standard CI/CD tool |
| **Terraform** | Creates cloud infrastructure via code | Reproducible, version-controlled infra |
| **Kubernetes (K8s)** | Runs & manages containers at scale | Auto-healing, auto-scaling, load balancing |
| **Prometheus + Grafana** | Monitors app health & metrics | Real-time dashboards & alerts |
| **ELK Stack** | Collects & searches logs | Centralized log viewing & troubleshooting |
| **HashiCorp Vault** | Manages secrets (passwords, keys) | Secure, auditable secret storage |

---

## Phase-by-Phase Plan

> [!NOTE]
> Each phase is broken into **baby steps**. Steps marked with 🧑‍💻 require **your action/intervention**. Steps marked with 🤖 will be done by me (the AI). Steps marked with ✅ are **verification checkpoints**.

---

### Phase 1: Project Setup & Git Repository

**What this does**: Creates the project skeleton and connects it to GitHub.

| Step | Who | Action |
|---|---|---|
| 1.1 | 🤖 | Create the full folder structure shown above |
| 1.2 | 🤖 | Initialize `package.json` with all required dependencies |
| 1.3 | 🤖 | Create `.gitignore` and `.env.example` |
| 1.4 | 🧑‍💻 | **You**: Install Node.js on your Mac (if not installed) |
| 1.5 | 🧑‍💻 | **You**: Run `npm install` in the project folder to install dependencies |
| 1.6 | 🧑‍💻 | **You**: Create a GitHub repo named `project-beacon` |
| 1.7 | 🧑‍💻 | **You**: Push the code to GitHub |

> **🧑‍💻 Baby Steps for 1.4 — Install Node.js:**
> 1. Open Terminal
> 2. Type `node --version` — if you see a version number (e.g., `v20.x.x`), skip to 1.5
> 3. If not installed, go to https://nodejs.org and download the LTS version
> 4. Install it (just click Next through the installer)
> 5. Close and reopen Terminal, then type `node --version` again to confirm

> **🧑‍💻 Baby Steps for 1.6–1.7 — GitHub Setup:**
> 1. Go to https://github.com and log in (create account if needed)
> 2. Click the **"+"** button → **"New repository"**
> 3. Name it `project-beacon`, set to **Public**, click **Create**
> 4. Copy the repo URL (looks like `https://github.com/YOUR_USERNAME/project-beacon.git`)
> 5. In Terminal, inside the project folder, run:
>    ```bash
>    git init
>    git add .
>    git commit -m "Initial project structure"
>    git branch -M main
>    git remote add origin https://github.com/YOUR_USERNAME/project-beacon.git
>    git push -u origin main
>    ```

> **✅ Verify**: Open your GitHub repo URL in a browser — you should see all the folders and files.

---

### Phase 2: Backend API (Node.js + Express + MongoDB)

**What this does**: Builds the REST API that handles emergency incidents and resources.

| Step | Who | Action |
|---|---|---|
| 2.1 | 🤖 | Create database config (`src/config/db.js`) |
| 2.2 | 🤖 | Create data models — Incident & Resource schemas |
| 2.3 | 🤖 | Create services — business logic for CRUD operations |
| 2.4 | 🤖 | Create controllers — request/response handlers |
| 2.5 | 🤖 | Create routes — API endpoint definitions |
| 2.6 | 🤖 | Create middleware — error handling & request logging |
| 2.7 | 🤖 | Wire everything together in `app.js` and `server.js` |
| 2.8 | 🧑‍💻 | **You**: Install & start MongoDB locally |
| 2.9 | 🧑‍💻 | **You**: Create a `.env` file with your settings |
| 2.10 | 🧑‍💻 | **You**: Start the server and test the API |

#### API Endpoints That Will Be Created

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/incidents` | List all incidents |
| `POST` | `/api/incidents` | Create a new incident |
| `GET` | `/api/incidents/:id` | Get single incident |
| `PUT` | `/api/incidents/:id` | Update an incident |
| `DELETE` | `/api/incidents/:id` | Delete an incident |
| `GET` | `/api/resources` | List all resources |
| `POST` | `/api/resources` | Create a new resource |
| `PUT` | `/api/resources/:id` | Update a resource |
| `GET` | `/api/health` | Health check endpoint (for monitoring) |

> **🧑‍💻 Baby Steps for 2.8 — Install MongoDB:**
> 1. Open Terminal
> 2. If you have Homebrew: `brew tap mongodb/brew && brew install mongodb-community`
> 3. Start MongoDB: `brew services start mongodb-community`
> 4. Verify: `mongosh` — if you see a `>` prompt, it's working. Type `exit` to leave.
>
> **Alternative (No Install Needed)**: Use free cloud MongoDB:
> 1. Go to https://www.mongodb.com/atlas → Sign up for free
> 2. Create a free cluster → Click "Connect" → "Connect your application"
> 3. Copy the connection string (looks like `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/beacon`)

> **🧑‍💻 Baby Steps for 2.9 — Create `.env` file:**
> 1. In the project root folder, create a file called `.env`
> 2. Add these lines:
>    ```
>    PORT=3000
>    MONGODB_URI=mongodb://localhost:27017/beacon
>    NODE_ENV=development
>    ```
>    (If using Atlas, replace the `MONGODB_URI` with your Atlas connection string)

> **🧑‍💻 Baby Steps for 2.10 — Start & Test:**
> 1. In Terminal, navigate to the project folder
> 2. Run: `npm run dev`
> 3. You should see: `Server running on port 3000` and `MongoDB connected`

> **✅ Verify Backend API is Working** (run these in a NEW Terminal tab):
> ```bash
> # 1. Health check
> curl http://localhost:3000/api/health
> # Expected: {"status":"ok","timestamp":"..."}
>
> # 2. Create an incident
> curl -X POST http://localhost:3000/api/incidents \
>   -H "Content-Type: application/json" \
>   -d '{"title":"Flood in Zone A","type":"flood","severity":"critical","location":{"address":"Zone A, City Center"},"description":"Major flooding reported"}'
> # Expected: JSON with the created incident
>
> # 3. List all incidents
> curl http://localhost:3000/api/incidents
> # Expected: Array with the incident you just created
>
> # 4. Create a resource
> curl -X POST http://localhost:3000/api/resources \
>   -H "Content-Type: application/json" \
>   -d '{"name":"Ambulance Unit 1","type":"ambulance","status":"available","agency":"City Hospital"}'
> # Expected: JSON with the created resource
>
> # 5. List all resources
> curl http://localhost:3000/api/resources
> # Expected: Array with the resource you just created
> ```

---

### Phase 3: Frontend Dashboard

**What this does**: Builds a beautiful web dashboard to visualize and manage incidents.

| Step | Who | Action |
|---|---|---|
| 3.1 | 🤖 | Create `index.html` — dashboard layout |
| 3.2 | 🤖 | Create `style.css` — modern dark-theme styling |
| 3.3 | 🤖 | Create `app.js` — frontend logic to call the API |
| 3.4 | 🧑‍💻 | **You**: Open browser to see the dashboard |

> **✅ Verify**: Open `http://localhost:3000` in your browser. You should see:
> - A dark-themed dashboard with the "Project Beacon" header
> - An incident list (showing the one you created via curl)
> - Buttons to create new incidents and resources
> - Real-time status indicators

---

### Phase 4: Docker Containerization

**What this does**: Packages your app so it can run identically on ANY computer.

| Step | Who | Action |
|---|---|---|
| 4.1 | 🤖 | Create `Dockerfile` (multi-stage build) |
| 4.2 | 🤖 | Create `docker-compose.yml` (app + MongoDB together) |
| 4.3 | 🧑‍💻 | **You**: Install Docker Desktop |
| 4.4 | 🧑‍💻 | **You**: Build and run with Docker Compose |

> **🧑‍💻 Baby Steps for 4.3 — Install Docker:**
> 1. Go to https://www.docker.com/products/docker-desktop/
> 2. Download Docker Desktop for Mac
> 3. Install it (drag to Applications)
> 4. Open Docker Desktop — wait for the whale icon in the top menu bar to stop animating
> 5. In Terminal: `docker --version` — should show a version number

> **🧑‍💻 Baby Steps for 4.4 — Build & Run:**
> ```bash
> # Navigate to the project folder
> cd /Users/shivammishra/Desktop/Sem04/DEVOPS/project-beacon
>
> # Build and start everything
> docker-compose -f docker/docker-compose.yml up --build
>
> # Wait for "Server running on port 3000" message
> ```

> **✅ Verify**:
> ```bash
> # In a new Terminal tab:
> curl http://localhost:3000/api/health
> # Expected: {"status":"ok",...}
>
> # Check running containers:
> docker ps
> # Expected: Two containers — beacon-app and beacon-mongodb
> ```

---

### Phase 5: Jenkins CI/CD Pipeline

**What this does**: Automatically builds, tests, and deploys your app whenever you push code.

| Step | Who | Action |
|---|---|---|
| 5.1 | 🤖 | Create `Jenkinsfile` with pipeline stages |
| 5.2 | 🧑‍💻 | **You**: Install and start Jenkins |
| 5.3 | 🧑‍💻 | **You**: Configure Jenkins with your GitHub repo |
| 5.4 | 🧑‍💻 | **You**: Run the pipeline and take screenshots |

#### Pipeline Stages

```mermaid
graph LR
    A["1. Checkout<br/>Code"] --> B["2. Install<br/>Dependencies"]
    B --> C["3. Run<br/>Tests"]
    C --> D["4. Build<br/>Docker Image"]
    D --> E["5. Push to<br/>Registry"]
    E --> F["6. Deploy to<br/>Kubernetes"]

    style A fill:#4CAF50,color:#fff
    style B fill:#2196F3,color:#fff
    style C fill:#FF9800,color:#fff
    style D fill:#00BCD4,color:#fff
    style E fill:#9C27B0,color:#fff
    style F fill:#F44336,color:#fff
```

> **🧑‍💻 Baby Steps for 5.2 — Install Jenkins:**
> ```bash
> # Using Docker (easiest way):
> docker run -d --name jenkins \
>   -p 8080:8080 -p 50000:50000 \
>   -v jenkins_data:/var/jenkins_home \
>   jenkins/jenkins:lts
>
> # Get the initial admin password:
> docker logs jenkins 2>&1 | grep -A 5 "initialAdminPassword"
> ```

> **🧑‍💻 Baby Steps for 5.3 — Configure Jenkins:**
> 1. Open `http://localhost:8080` in browser
> 2. Paste the admin password from the previous step
> 3. Click "Install suggested plugins" — wait for installation
> 4. Create an admin user (remember your password!)
> 5. Click "New Item" → Name it `project-beacon` → Select "Pipeline" → OK
> 6. Under "Pipeline" section → Select "Pipeline script from SCM"
> 7. SCM: Git → Repo URL: your GitHub URL
> 8. Script Path: `jenkins/Jenkinsfile`
> 9. Save → Click "Build Now"

> **✅ Verify**: In Jenkins dashboard, you should see a green checkmark (✓) for each pipeline stage. Take a screenshot!

---

### Phase 6: Terraform Infrastructure as Code

**What this does**: Defines your cloud infrastructure in code files (instead of clicking buttons in a cloud console).

| Step | Who | Action |
|---|---|---|
| 6.1 | 🤖 | Create Terraform files (main.tf, variables.tf, outputs.tf, provider.tf) |
| 6.2 | 🧑‍💻 | **You**: Install Terraform CLI |
| 6.3 | 🧑‍💻 | **You**: Run `terraform init` and `terraform plan` |

> [!NOTE]
> For a college project, you do NOT need an actual cloud account. We will write the Terraform code and demonstrate it with `terraform plan` (dry run) to show what **would** be created. This proves you understand IaC without spending money.

> **🧑‍💻 Baby Steps for 6.2 — Install Terraform:**
> ```bash
> brew install terraform
> terraform --version
> # Expected: Terraform v1.x.x
> ```

> **🧑‍💻 Baby Steps for 6.3 — Run Terraform:**
> ```bash
> cd terraform/
> terraform init        # Downloads provider plugins
> terraform plan        # Shows what would be created (dry run)
> # Take a screenshot of the plan output!
> ```

> **✅ Verify**: `terraform plan` runs without errors and shows resources that would be created (VPC, subnets, EKS cluster, etc.)

---

### Phase 7: Kubernetes Deployment

**What this does**: Deploys your containerized app to Kubernetes with auto-scaling and self-healing.

| Step | Who | Action |
|---|---|---|
| 7.1 | 🤖 | Create all K8s manifest YAML files |
| 7.2 | 🧑‍💻 | **You**: Start a local Kubernetes cluster (Minikube) |
| 7.3 | 🧑‍💻 | **You**: Deploy the application |

> **🧑‍💻 Baby Steps for 7.2 — Install & Start Minikube:**
> ```bash
> # Install minikube
> brew install minikube
>
> # Start a local cluster
> minikube start --driver=docker
>
> # Verify
> kubectl get nodes
> # Expected: One node in "Ready" status
> ```

> **🧑‍💻 Baby Steps for 7.3 — Deploy:**
> ```bash
> cd k8s/
> kubectl apply -f namespace.yaml
> kubectl apply -f configmap.yaml
> kubectl apply -f deployment.yaml
> kubectl apply -f service.yaml
> kubectl apply -f hpa.yaml
>
> # Check everything is running
> kubectl get all -n beacon
> ```

> **✅ Verify**:
> ```bash
> # All pods should show "Running"
> kubectl get pods -n beacon
>
> # Access the app through Minikube
> minikube service beacon-service -n beacon
> # This opens your app in the browser!
>
> # Test the API
> curl $(minikube service beacon-service -n beacon --url)/api/health
> ```

---

### Phase 8: Monitoring with Prometheus & Grafana

**What this does**: Monitors your app's health, response times, and resource usage with dashboards.

| Step | Who | Action |
|---|---|---|
| 8.1 | 🤖 | Add metrics endpoint to the app (`/metrics`) |
| 8.2 | 🤖 | Create Prometheus config & Grafana dashboard JSON |
| 8.3 | 🧑‍💻 | **You**: Deploy Prometheus & Grafana to Kubernetes |

> **🧑‍💻 Baby Steps for 8.3 — Deploy Monitoring:**
> ```bash
> # Add the Helm repo (Helm is a K8s package manager)
> brew install helm
> helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
> helm repo update
>
> # Install Prometheus + Grafana stack
> helm install monitoring prometheus-community/kube-prometheus-stack \
>   --namespace monitoring --create-namespace
>
> # Access Grafana dashboard
> kubectl port-forward svc/monitoring-grafana 3001:80 -n monitoring
> # Open http://localhost:3001 in browser
> # Default login: admin / prom-operator
> ```

> **✅ Verify**:
> - Grafana dashboard loads at `http://localhost:3001`
> - Navigate to Dashboards → you see pre-built Kubernetes dashboards
> - Import our custom dashboard JSON for app-specific metrics
> - Take screenshots of the dashboards!

---

### Phase 9: Logging with ELK Stack

**What this does**: Collects all application logs into a searchable, visual interface.

| Step | Who | Action |
|---|---|---|
| 9.1 | 🤖 | Create ELK Kubernetes manifests |
| 9.2 | 🤖 | Create Filebeat config to ship logs |
| 9.3 | 🧑‍💻 | **You**: Deploy ELK stack to Kubernetes |

> **🧑‍💻 Baby Steps for 9.3 — Deploy ELK:**
> ```bash
> # Add Elastic Helm repo
> helm repo add elastic https://helm.elastic.co
> helm repo update
>
> # Install Elasticsearch
> helm install elasticsearch elastic/elasticsearch \
>   --namespace logging --create-namespace \
>   --set replicas=1 --set resources.requests.memory=512Mi
>
> # Install Kibana
> helm install kibana elastic/kibana \
>   --namespace logging
>
> # Deploy Filebeat (log shipper)
> kubectl apply -f logging/filebeat.yaml
>
> # Access Kibana
> kubectl port-forward svc/kibana-kibana 5601:5601 -n logging
> # Open http://localhost:5601 in browser
> ```

> **✅ Verify**:
> - Kibana loads at `http://localhost:5601`
> - Create an index pattern: `filebeat-*`
> - You see logs from your application in the Discover tab
> - Take screenshots!

---

### Phase 10: Secret Management with Vault

**What this does**: Securely stores and injects passwords, API keys, and other secrets.

| Step | Who | Action |
|---|---|---|
| 10.1 | 🤖 | Create Vault configs and policies |
| 10.2 | 🧑‍💻 | **You**: Deploy Vault to Kubernetes |
| 10.3 | 🧑‍💻 | **You**: Store secrets and verify injection |

> **🧑‍💻 Baby Steps for 10.2 — Deploy Vault:**
> ```bash
> # Add HashiCorp Helm repo
> helm repo add hashicorp https://helm.releases.hashicorp.com
> helm repo update
>
> # Install Vault in dev mode (fine for college project)
> helm install vault hashicorp/vault \
>   --namespace vault --create-namespace \
>   --set "server.dev.enabled=true"
>
> # Access Vault UI
> kubectl port-forward svc/vault 8200:8200 -n vault
> # Open http://localhost:8200 in browser
> # Dev mode root token: "root"
> ```

> **🧑‍💻 Baby Steps for 10.3 — Store Secrets:**
> ```bash
> # Enter the Vault pod
> kubectl exec -it vault-0 -n vault -- sh
>
> # Store app secrets
> vault kv put secret/beacon/config \
>   mongodb_uri="mongodb://mongo:27017/beacon" \
>   node_env="production" \
>   jwt_secret="super-secret-key"
>
> # Read them back
> vault kv get secret/beacon/config
> # You should see your secrets listed
>
> exit
> ```

> **✅ Verify**:
> - Vault UI loads at `http://localhost:8200`
> - You can see stored secrets under `secret/beacon/config`
> - Take screenshots!

---

### Phase 11: Documentation & Diagrams

| Step | Who | Action |
|---|---|---|
| 11.1 | 🤖 | Generate architecture diagram |
| 11.2 | 🤖 | Generate deployment diagram |
| 11.3 | 🤖 | Write disaster recovery plan |
| 11.4 | 🤖 | Write comprehensive README.md |
| 11.5 | 🧑‍💻 | **You**: Collect screenshots at each phase into `docs/screenshots/` |

---

## Deliverables Checklist (Final Mapping)

| # | Deliverable | Phase | Status |
|---|---|---|---|
| 1 | Working Application (Web App / Dashboard / API) | 2 & 3 | ⬜ |
| 2 | Source Code Repository (GitHub) | 1 | ⬜ |
| 3 | Dockerfile and Docker Images | 4 | ⬜ |
| 4 | Jenkins CI/CD Pipeline | 5 | ⬜ |
| 5 | Terraform Infrastructure Scripts | 6 | ⬜ |
| 6 | Kubernetes Deployment Files | 7 | ⬜ |
| 7 | Monitoring using Prometheus and Grafana | 8 | ⬜ |
| 8 | Logging using ELK Stack | 9 | ⬜ |
| 9 | Secret Management using Vault | 10 | ⬜ |
| 10 | Architecture Diagram | 11 | ⬜ |
| 11 | Deployment Diagram | 11 | ⬜ |
| 12 | Disaster Recovery Plan | 11 | ⬜ |
| 13 | Demonstration Screenshots | All Phases | ⬜ |
| 14 | Project Documentation | 11 | ⬜ |

---

## Pre-Deployment API Verification Checklist

> [!IMPORTANT]
> Before moving to Docker/K8s (Phase 4+), **ALL** of these must pass:

```bash
# Run all these commands and confirm expected output:

# 1. Server starts without errors
npm run dev
# ✅ "Server running on port 3000"
# ✅ "MongoDB connected"

# 2. Health check
curl http://localhost:3000/api/health
# ✅ Returns {"status":"ok"}

# 3. CRUD - Create incident
curl -X POST http://localhost:3000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Fire","type":"fire","severity":"high","location":{"address":"123 Main St"},"description":"Test"}'
# ✅ Returns created incident with _id

# 4. CRUD - Read incidents
curl http://localhost:3000/api/incidents
# ✅ Returns array with your incident

# 5. CRUD - Update incident
curl -X PUT http://localhost:3000/api/incidents/INCIDENT_ID_HERE \
  -H "Content-Type: application/json" \
  -d '{"status":"responding"}'
# ✅ Returns updated incident

# 6. CRUD - Delete incident
curl -X DELETE http://localhost:3000/api/incidents/INCIDENT_ID_HERE
# ✅ Returns success message

# 7. Resources
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{"name":"Fire Truck 1","type":"fire_truck","status":"available","agency":"Fire Dept"}'
# ✅ Returns created resource

# 8. Frontend loads
# Open http://localhost:3000 in browser
# ✅ Dashboard renders correctly
```

---

## Prerequisites Summary (What You Need Installed)

| Tool | Install Command | When Needed |
|---|---|---|
| **Node.js** | Download from nodejs.org | Phase 1 |
| **MongoDB** | `brew install mongodb-community` (or use Atlas) | Phase 2 |
| **Git** | `brew install git` (usually pre-installed on Mac) | Phase 1 |
| **Docker Desktop** | Download from docker.com | Phase 4 |
| **Terraform** | `brew install terraform` | Phase 6 |
| **Minikube** | `brew install minikube` | Phase 7 |
| **kubectl** | `brew install kubectl` | Phase 7 |
| **Helm** | `brew install helm` | Phase 8 |

> [!TIP]
> Install these **as you reach each phase**, not all at once. This avoids confusion.

---

## Open Questions

> [!IMPORTANT]
> Please clarify the following before I start building:

1. **MongoDB preference**: Do you want to install MongoDB locally (`brew install`) or use the **free cloud version** (MongoDB Atlas — no local install needed)?
2. **Cloud provider for Terraform**: Should the Terraform scripts target **AWS**, **Azure**, or **GCP**? (This is just for the code — you won't actually need a cloud account since we'll use `terraform plan` dry-run only.)
3. **Shall I start building Phase 1–3 now?** I can create the entire application (backend + frontend) in one go, and then you just need to install prerequisites and test it.
