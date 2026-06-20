# Project Beacon — Setup & Presentation Guide

This document is divided into two parts:
1. **First-Time Setup**: The commands you need to run *once* to get everything initialized and working.
2. **Presentation Flow**: The exact script and commands you should use *during* your live presentation to your professor/examiner.

> **Note:** Run all commands from the root of the project directory (`project-beacon`).

---

## PART A: First-Time Setup (Do this before your presentation)

You only need to do this once to ensure your environment is fully provisioned.

### 1. Test Application Locally
```bash
npm install
npm run dev
# Open http://localhost:3000 to verify the UI connects to MongoDB
```

### 2. Verify Jenkins
- Open `http://localhost:8080`.
- Ensure the `project-beacon` pipeline exists and runs successfully at least once.

### 3. Provision AWS Infrastructure (Terraform)
```bash
cd terraform
terraform init
terraform plan
terraform apply -auto-approve
cd ..
```

### 4. Start Local Kubernetes & Deploy (Minikube)
```bash
# Start Minikube cluster
minikube start --driver=docker

# Apply all manifests
kubectl apply -f k8s/
kubectl apply -f monitoring/
kubectl apply -f logging/
kubectl apply -f vault/

# Verify pods are running
kubectl get pods -A
```

---

## PART B: Presentation Flow (Do this during your live presentation)

Use this exact flow when demonstrating your project to the examiner. It proves you have implemented the complete DevOps lifecycle.

### Step 1: The Code & Source Control
* **Action:** Open GitHub in your browser.
* **Talking Point:** "Here is the source code for Project Beacon. We are using Git for version control. The code is structured as a Node.js API with a vanilla JS frontend, using a multi-stage Dockerfile."

### Step 2: Continuous Integration (Jenkins)
* **Action:** Open Jenkins (`http://localhost:8080`) and click **Build Now**.
* **Talking Point:** "I have a Jenkins CI/CD pipeline configured. When code is pushed, Jenkins automatically checks out the code, installs dependencies, builds a Docker image, and pushes it to a registry. You can see the stages executing now."

### Step 3: Infrastructure as Code (Terraform)
* **Action:** Open your terminal, go to the `terraform` folder, and run:
  ```bash
  cd terraform
  terraform plan
  ```
* **Talking Point:** "To provision the cloud infrastructure, I used Terraform. Here is the output showing how it defines our AWS VPC, subnets, and EKS Cluster. Because of IaC, our infrastructure is reproducible."

### Step 4: Container Orchestration & Scaling (Kubernetes)
* **Action:** In your terminal, run:
  ```bash
  kubectl get pods -n beacon
  kubectl get hpa -n beacon
  ```
* **Talking Point:** "The application is deployed on Kubernetes. We have multiple replicas for high availability. I've also configured a Horizontal Pod Autoscaler (HPA) which you can see here; it will automatically spin up more pods if CPU usage spikes during an emergency."

### Step 5: The Working Application
* **Action:** Run this command to expose the app, then open the URL in your browser:
  ```bash
  minikube service beacon-service -n beacon
  ```
* **Talking Point:** "This is the live application running inside our cluster. It's a highly accessible government portal. I can report a new emergency incident here, and it will instantly update the active dashboard via our REST API."

### Step 6: Observability & Security
* **Action:** Open the YAML files in your IDE (`monitoring/grafana-dashboard.json`, `logging/filebeat.yaml`, `vault/vault-config.yaml`).
* **Talking Point:** "To complete the DevOps loop, the cluster includes Prometheus and Grafana for monitoring system health, an ELK stack via Filebeat for centralized logging, and HashiCorp Vault for secure secret management."

---
*End of Presentation*
