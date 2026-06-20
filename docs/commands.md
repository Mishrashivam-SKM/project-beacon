# Project Beacon — Demonstration Commands

Use these commands to showcase every stage of the DevOps lifecycle for your project presentation.

> **Note:** Run all commands from the root of the project directory (`project-beacon`).

---

## 1. Run the Application Locally (Without Docker)
Showcase the Node.js application running directly on your machine connected to MongoDB Atlas.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
- **Showcase:** Open `http://localhost:3000` in the browser to show the Dashboard.

---

## 2. Docker Containerization
Showcase that the application can be built and run identically in a Docker container.

```bash
# Build the Docker image and start the container in the background
docker-compose -f docker/docker-compose.yml up --build -d

# Show that the container is running
docker ps

# Check the logs to show it connected to MongoDB Atlas
docker logs beacon-app
```
- **Showcase:** Open `http://localhost:3000` in the browser. It is now being served by Docker!
- **Teardown:** `docker-compose -f docker/docker-compose.yml down`

---

## 3. Jenkins CI/CD Pipeline
Showcase automated testing and deployment pipelines.

```bash
# 1. Start Jenkins locally (if not already running)
brew services start jenkins-lts

# 2. Get your admin password (if logging in for the first time)
cat ~/.jenkins/secrets/initialAdminPassword
```
- **Showcase:** 
  1. Open `http://localhost:8080`.
  2. Show your configured **project-beacon** pipeline.
  3. Click **Build Now**.
  4. Show the visual pipeline executing (Checkout → Install Dependencies → Run Tests → Build Docker Image).

---

## 4. Terraform (Infrastructure as Code)
Showcase how you provision AWS cloud infrastructure (VPC, EKS Cluster, Subnets) using code.

```bash
# Change to the terraform directory
cd terraform/

# Initialize Terraform (downloads AWS provider)
terraform init

# Show the execution plan (Dry Run - shows what WOULD be built without costing money)
terraform plan
```
- **Showcase:** Scroll through the green `+ create` output to show the AWS resources (VPC, EKS Cluster, IAM roles) that Terraform generates automatically.

---

## 5. Kubernetes Deployment (Minikube)
Showcase container orchestration, scaling, and self-healing.

```bash
# 1. Start your local Kubernetes cluster
minikube start --driver=docker

# 2. Deploy all Kubernetes manifests
cd k8s/
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f hpa.yaml

# 3. Verify everything is running
kubectl get all -n beacon
```
- **Showcase:** 
  1. Show the output of `kubectl get pods -n beacon`.
  2. Open the app running in Kubernetes: `minikube service beacon-service -n beacon`

---

## 6. Testing the Backend API via Terminal
If the evaluator wants to see backend API requests working without the UI, use these `curl` commands:

```bash
# 1. Check API Health
curl -s http://localhost:3000/api/health

# 2. List all Incidents
curl -s http://localhost:3000/api/incidents

# 3. Create a Test Incident
curl -s -X POST http://localhost:3000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{"title":"Demo Fire","type":"fire","severity":"high","location":{"address":"Demo Street"},"description":"Showcase"}'
```
