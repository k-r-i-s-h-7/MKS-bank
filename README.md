# 🏦 MKS-Bank — DevOps Engineering Roadmap

> A full-cycle DevOps implementation plan for the MKS-Bank application — a **Spring Boot** backend, **React/Vite** frontend, **PostgreSQL** database, and **Redis** cache — deployed on a production-grade, cloud-native infrastructure.

---

## 📋 Table of Contents

Test
- [Project Overview](#-project-overview)
- [Current Architecture](#-current-architecture)
- [Target Architecture](#-target-architecture)
- [Technology Stack](#-technology-stack)
- [Phase-by-Phase Roadmap](#-phase-by-phase-roadmap)
  - [Phase 1 — Kubernetes Migration](#phase-1--kubernetes-migration-k8s)
  - [Phase 2 — CI/CD with Jenkins](#phase-2--cicd-pipeline-with-jenkins)
  - [Phase 3 — Code Quality with SonarQube](#phase-3--code-quality-with-sonarqube)
  - [Phase 4 — Cloud Infrastructure with Terraform](#phase-4--cloud-infrastructure-with-terraform)
  - [Phase 5 — Server Config with Ansible](#phase-5--server-configuration-with-ansible)
  - [Phase 6 — Observability Stack](#phase-6--observability-stack-prometheus--grafana--loki)
- [Directory Structure (Target)](#-target-directory-structure)
- [Progress Tracker](#-progress-tracker)

---

## 🏗 Project Overview

**MKS-Bank** is a full-stack banking application. The goal of this DevOps project is to take the existing Docker Compose-based local setup and evolve it into a fully automated, observable, and cloud-deployed system using industry-standard DevOps tooling.

| Layer | Technology |
|---|---|
| Backend | Java Spring Boot (Maven, JDK 17) |
| Frontend | React + TypeScript (Vite, Nginx) |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Containerization | Docker (already complete) |

---

## 📦 Current Architecture

```
[Local Machine]
      │
      └── docker-compose.yml
            ├── backend  (Spring Boot → port 8080)
            ├── frontend (Nginx + React → port 3000)
            ├── postgres (port 5480)
            └── redis    (port 6379)
```

**Status:** ✅ Dockerized, runs locally with `docker-compose up`.

---

## 🎯 Target Architecture

```
[Developer Laptop]
    │
    ├── git push → GitHub
    │
    ▼
[Jenkins CI Server]
    ├── SonarQube Analysis (Quality Gate)
    ├── Maven Build + Tests
    ├── Docker Build & Push → Docker Hub / ECR
    │
    ▼
[Kubernetes Cluster] ← Provisioned by Terraform + Ansible
    ├── Namespace: mks-bank
    │     ├── Deployment: backend  (3 replicas)
    │     ├── Deployment: frontend (2 replicas)
    │     ├── StatefulSet: postgres
    │     ├── Deployment: redis
    │     └── Ingress: exposes frontend + backend API
    │
    └── Namespace: monitoring
          ├── Prometheus  (metrics scraping)
          ├── Grafana     (dashboards)
          └── Loki        (log aggregation via Promtail)
```

---

## 🛠 Technology Stack

| Tool | Role | Phase |
|---|---|---|
| **Docker** | Containerization (already done) | ✅ Done |
| **Kubernetes (K8s)** | Container orchestration & scaling | Phase 1 |
| **Jenkins** | CI/CD pipeline automation | Phase 2 |
| **SonarQube** | Static code analysis & quality gates | Phase 3 |
| **Terraform** | Cloud infrastructure provisioning (IaC) | Phase 4 |
| **Ansible** | Server configuration management | Phase 5 |
| **Prometheus** | Metrics collection & alerting | Phase 6 |
| **Grafana** | Metrics & logs visualization dashboards | Phase 6 |
| **Loki** | Log aggregation (the "Prometheus for logs") | Phase 6 |

---

## 🗺 Phase-by-Phase Roadmap

---

### Phase 1 — Kubernetes Migration (`k8s/`)

> **Goal:** Replace `docker-compose.yml` with Kubernetes manifests. This is the most foundational step — everything else builds on top of K8s.

**What to build:**
- `k8s/backend/deployment.yaml` — 3-replica Spring Boot deployment
- `k8s/backend/service.yaml` — ClusterIP service for internal communication
- `k8s/frontend/deployment.yaml` — 2-replica Nginx/React deployment
- `k8s/frontend/service.yaml` + `ingress.yaml` — Exposed to the internet
- `k8s/postgres/statefulset.yaml` — Stateful database with persistent storage
- `k8s/redis/deployment.yaml` — Redis cache
- `k8s/secrets.yaml` — Kubernetes Secrets for DB credentials (base64 encoded)
- `k8s/configmap.yaml` — Non-sensitive env vars (DB URL, etc.)

**Key concepts to learn:**
- `Deployment` vs `StatefulSet` (why Postgres needs StatefulSet)
- `PersistentVolumeClaims` (PVC) to keep your database data on disk
- `Services` (ClusterIP, NodePort, LoadBalancer)
- `Ingress` controllers (NGINX Ingress)
- `Secrets` and `ConfigMaps`

**Local testing tool:** [Minikube](https://minikube.sigs.k8s.io/) or Docker Desktop's built-in Kubernetes.

```bash
# Test locally before cloud deployment
minikube start
kubectl apply -f k8s/
kubectl get pods -n mks-bank
```

**Milestone ✅:** `kubectl get pods` shows all services running in a `mks-bank` namespace.

---

### Phase 2 — CI/CD Pipeline with Jenkins

> **Goal:** Every `git push` to `main` automatically builds, tests, containerizes, and deploys the application — zero manual steps.

**What to build:**
- A `Jenkinsfile` in the project root.
- A Jenkins server (can run locally in Docker first, then on a cloud VM).

**Pipeline Stages:**

```
Stage 1: Checkout
  └─ Pull code from GitHub

Stage 2: Test
  └─ mvn test (backend unit tests)
  └─ npm test (frontend tests)

Stage 3: SonarQube Analysis  ← (see Phase 3)
  └─ sonar-scanner

Stage 4: Build
  └─ mvn clean package -DskipTests
  └─ npm run build

Stage 5: Docker Build & Push
  └─ docker build -t mks-bank/backend:$BUILD_ID .
  └─ docker push → Docker Hub or AWS ECR

Stage 6: Deploy to Kubernetes
  └─ kubectl set image deployment/backend backend=mks-bank/backend:$BUILD_ID
  └─ kubectl rollout status deployment/backend
```

**Jenkins Plugins needed:**
- `Git Plugin`
- `Maven Integration`
- `Docker Pipeline`
- `Kubernetes CLI`
- `SonarQube Scanner`
- `Blue Ocean` (for a modern pipeline UI)

**Milestone ✅:** A push to `main` triggers Jenkins, and the new image is live in Kubernetes without any manual command.

---

### Phase 3 — Code Quality with SonarQube

> **Goal:** Automatically gate deployments based on code quality. If the code has critical security vulnerabilities or drops below a quality threshold, the Jenkins build fails.

**What to build:**
- A running SonarQube server (can run in Docker).
- `sonar-project.properties` in the backend root.
- A Quality Gate configured in the SonarQube UI.

**Backend setup (`sonar-project.properties`):**
```properties
sonar.projectKey=mks-bank-backend
sonar.projectName=MKS Bank Backend
sonar.sources=src/main/java
sonar.tests=src/test/java
sonar.java.binaries=target/classes
sonar.language=java
```

**What SonarQube checks:**
- 🐛 **Bugs** — Code that is likely broken.
- 🔒 **Vulnerabilities** — Security issues (SQL injection, XSS, etc.).
- 🧪 **Coverage** — What % of code is covered by tests.
- 🧹 **Code Smells** — Maintainability issues.

**Milestone ✅:** A PR with a critical SQL injection vulnerability is automatically rejected by the Jenkins Quality Gate.

---

### Phase 4 — Cloud Infrastructure with Terraform

> **Goal:** Provision your entire cloud environment (VPC, Kubernetes cluster, databases) with a single `terraform apply` command. Infrastructure is code — versioned, reviewable, reproducible.

**What to build (`terraform/`):**
- `terraform/main.tf` — Core resource definitions
- `terraform/variables.tf` — Parameterized inputs (region, instance size)
- `terraform/outputs.tf` — Expose important values (cluster endpoint, IPs)
- `terraform/provider.tf` — AWS (or Azure/GCP) provider config

**Resources to provision (AWS example):**
```hcl
# Suggested resources
- aws_vpc                     (Isolated network)
- aws_subnet (public/private) (Network segmentation)
- aws_eks_cluster             (Managed Kubernetes)
- aws_eks_node_group          (Worker nodes — e.g., t3.medium)
- aws_db_instance             (Managed RDS PostgreSQL — production-grade)
- aws_elasticache_cluster     (Managed Redis — optional)
- aws_ecr_repository          (Private Docker image registry)
```

**Workflow:**
```bash
cd terraform/
terraform init          # Download providers
terraform plan          # Preview what will be created
terraform apply         # Provision everything
terraform destroy       # Tear down when done (saves $$)
```

> ⚠️ **Important:** Store your Terraform state remotely in an **S3 bucket + DynamoDB lock** to prevent conflicts if multiple people run it.

**Milestone ✅:** `terraform apply` creates a working EKS cluster. `kubectl get nodes` shows live cloud worker nodes.

---

### Phase 5 — Server Configuration with Ansible

> **Goal:** If you use raw VMs (e.g., for Jenkins server or self-managed K8s nodes), Ansible automates turning a blank Ubuntu server into a fully configured machine — no SSH-and-manually-type needed.

**What to build (`ansible/`):**
- `ansible/inventory.ini` — List of your server IP addresses
- `ansible/site.yml` — Master playbook that imports all roles
- `ansible/roles/common/` — Install base packages, set up firewall
- `ansible/roles/docker/` — Install Docker Engine
- `ansible/roles/kubernetes/` — Install `kubeadm`, `kubelet`, `kubectl`
- `ansible/roles/jenkins/` — Install Jenkins + Java
- `ansible/roles/monitoring/` — Install Prometheus/Grafana

**Example playbook snippet:**
```yaml
# ansible/roles/docker/tasks/main.yml
- name: Install Docker
  apt:
    name: docker.io
    state: present
    update_cache: yes

- name: Start Docker service
  service:
    name: docker
    state: started
    enabled: yes
```

**Workflow:**
```bash
# After Terraform creates the VMs, Ansible configures them
ansible-playbook -i ansible/inventory.ini ansible/site.yml
```

**Milestone ✅:** A fresh VM goes from blank Ubuntu to a fully configured Jenkins + Docker host with a single command.

---

### Phase 6 — Observability Stack (Prometheus + Grafana + Loki)

> **Goal:** Full observability — metrics, logs, and alerts — all centralized. When something breaks at 3 AM, you find the root cause in Grafana, not by SSH-ing into pods.

**What to build (`k8s/monitoring/`):**
- Deploy the full stack using **Helm** (the Kubernetes package manager).

**Step 1: Enable Spring Boot Metrics**

Add to `backend/pom.xml`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
```

Add to `application.properties`:
```properties
management.endpoints.web.exposure.include=health,info,prometheus
management.endpoint.prometheus.enabled=true
```

**Step 2: Deploy with Helm**
```bash
# Add the Helm repos
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts

# Install Prometheus + Grafana (kube-prometheus-stack includes both)
helm install monitoring prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace

# Install Loki + Promtail
helm install loki grafana/loki-stack \
  --namespace monitoring \
  --set promtail.enabled=true
```

**What you get out of the box:**

| Tool | What it shows |
|---|---|
| **Prometheus** | HTTP request rates, error rates, JVM heap, pod CPU/memory |
| **Grafana** | Pre-built K8s cluster dashboards, custom MKS-Bank dashboards |
| **Loki** | All logs from all pods, searchable by label (`pod`, `namespace`) |
| **Alertmanager** | Sends a Slack/email alert if error rate spikes above 5% |

**Suggested Grafana Dashboards to import:**
- `ID: 315` — Kubernetes cluster monitoring
- `ID: 12900` — Spring Boot 3 Statistics
- `ID: 13639` — Loki logs dashboard

**Milestone ✅:** A Grafana dashboard shows live HTTP request rates for the MKS-Bank backend. When you kill a pod, an alert fires in Slack within 60 seconds.

---

## 📁 Target Directory Structure

```
DevOps/
│
├── README.md                    ← This file
├── docker-compose.yml           ← Legacy local dev (keep for reference)
│
├── backend/                     ← Spring Boot app (existing)
│   ├── Dockerfile               ← ✅ Already done
│   ├── pom.xml                  ← Add actuator + micrometer deps (Phase 6)
│   └── src/
│
├── frontend/                    ← React/Vite app (existing)
│   └── DockerFile               ← ✅ Already done
│
├── k8s/                         ← Phase 1
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── backend/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   ├── frontend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   ├── postgres/
│   │   ├── statefulset.yaml
│   │   ├── service.yaml
│   │   └── pvc.yaml
│   ├── redis/
│   │   ├── deployment.yaml
│   │   └── service.yaml
│   └── monitoring/
│       └── helm-values.yaml     ← Prometheus/Grafana/Loki config
│
├── Jenkinsfile                  ← Phase 2
│
├── sonar-project.properties     ← Phase 3
│
├── terraform/                   ← Phase 4
│   ├── provider.tf
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
│
└── ansible/                     ← Phase 5
    ├── inventory.ini
    ├── site.yml
    └── roles/
        ├── common/
        ├── docker/
        ├── kubernetes/
        └── jenkins/
```

---

## ✅ Progress Tracker

| Phase | Description | Status |
|---|---|---|
| 0 | Dockerize application (Backend + Frontend + DB) | ✅ Complete |
| 1 | Write Kubernetes manifests, test with Minikube | ⬜ Not Started |
| 2 | Create Jenkinsfile, set up Jenkins server | ⬜ Not Started |
| 3 | Configure SonarQube, add quality gate to pipeline | ⬜ Not Started |
| 4 | Write Terraform scripts, provision cloud K8s cluster | ⬜ Not Started |
| 5 | Write Ansible playbooks for server configuration | ⬜ Not Started |
| 6 | Deploy Prometheus, Grafana, Loki with Helm | ⬜ Not Started |

---

## 🚀 Recommended Learning Order

If you're learning these tools while building, follow this order:

```
Week 1-2:  Kubernetes fundamentals → write k8s/ manifests → test locally
Week 3:    Jenkins pipeline → automate Docker build + push
Week 4:    SonarQube → integrate into Jenkins pipeline
Week 5-6:  Terraform → provision AWS/Azure infrastructure
Week 7:    Ansible → automate server setup
Week 8:    Prometheus + Grafana + Loki → add full observability
```

---

## 📚 Key Resources

| Topic | Resource |
|---|---|
| Kubernetes | [kubernetes.io/docs](https://kubernetes.io/docs/home/) |
| Jenkins | [jenkins.io/doc](https://www.jenkins.io/doc/) |
| SonarQube | [docs.sonarqube.org](https://docs.sonarqube.org/) |
| Terraform (AWS) | [registry.terraform.io](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) |
| Ansible | [docs.ansible.com](https://docs.ansible.com/) |
| Prometheus | [prometheus.io/docs](https://prometheus.io/docs/) |
| Grafana + Loki | [grafana.com/docs](https://grafana.com/docs/) |
| Helm | [helm.sh/docs](https://helm.sh/docs/) |

---

*Generated as part of MKS-Bank DevOps Engineering Project — `k-r-i-s-h-7/MKS-bank`*
