# =============================================================
# MKS-Bank — Kubernetes Deployment Script for Windows
# Docker Desktop Kubernetes Driver
# Run from the project root: .\k8s\deploy.ps1
# =============================================================

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  MKS-Bank Kubernetes Deployment" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Verify kubectl is connected to Docker Desktop ────────────────────
Write-Host "[1/6] Checking kubectl context..." -ForegroundColor Yellow
$context = kubectl config current-context
if ($context -ne "docker-desktop") {
    Write-Host "  Switching context to docker-desktop..." -ForegroundColor Gray
    kubectl config use-context docker-desktop
}
else {
    Write-Host "  ✅ Already on docker-desktop context." -ForegroundColor Green
}
Write-Host ""

# ── Step 2: Build Docker images (using local Docker daemon) ─────────────────
Write-Host "[2/6] Building Docker images locally..." -ForegroundColor Yellow
Write-Host "  Building backend image..." -ForegroundColor Gray
docker build -t mks-bank/backend:latest -f ./backend/Dockerfile ./backend
if ($LASTEXITCODE -ne 0) { Write-Host "  ❌ Backend build failed!" -ForegroundColor Red; exit 1 }

Write-Host "  Building frontend image..." -ForegroundColor Gray
docker build -t mks-bank/frontend:latest -f ./frontend/Dockerfile ./frontend
if ($LASTEXITCODE -ne 0) { Write-Host "  ❌ Frontend build failed!" -ForegroundColor Red; exit 1 }
Write-Host "  ✅ Images built successfully." -ForegroundColor Green
Write-Host ""

# ── Step 3: Apply namespace ─────────────────────────────────────────────────
Write-Host "[3/6] Creating namespace..." -ForegroundColor Yellow
kubectl apply -f k8s/namespace.yaml
Write-Host ""

# ── Step 4: Apply config and secrets ────────────────────────────────────────
Write-Host "[4/6] Applying ConfigMap and Secrets..." -ForegroundColor Yellow
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
Write-Host ""

# ── Step 5: Deploy all services (order matters — DB first!) ─────────────────
Write-Host "[5/6] Deploying services..." -ForegroundColor Yellow

Write-Host "  Deploying PostgreSQL..." -ForegroundColor Gray
kubectl apply -f k8s/postgres/pvc.yaml
kubectl apply -f k8s/postgres/statefulset.yaml
kubectl apply -f k8s/postgres/service.yaml

Write-Host "  Deploying Redis..." -ForegroundColor Gray
kubectl apply -f k8s/redis/deployment.yaml
kubectl apply -f k8s/redis/service.yaml

Write-Host "  Waiting 15s for database to initialize before deploying backend..." -ForegroundColor Gray
Start-Sleep -Seconds 15

Write-Host "  Deploying Backend..." -ForegroundColor Gray
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml

Write-Host "  Deploying Frontend..." -ForegroundColor Gray
kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/service.yaml
Write-Host ""

# ── Step 6: Wait and show status ─────────────────────────────────────────────
Write-Host "[6/6] Waiting for pods to be ready..." -ForegroundColor Yellow
kubectl rollout status deployment/frontend -n mks-bank --timeout=120s
kubectl rollout status deployment/redis -n mks-bank --timeout=60s
kubectl rollout status statefulset/postgres -n mks-bank --timeout=120s

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Deployment Complete! Current Status:" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
kubectl get pods -n mks-bank
Write-Host ""
kubectl get services -n mks-bank
Write-Host ""
Write-Host "🌐 Access Points:" -ForegroundColor Green
Write-Host "   Frontend  → http://localhost:30000" -ForegroundColor White
Write-Host "   Backend   → http://localhost:30080" -ForegroundColor White
Write-Host "   Health    → http://localhost:30080/actuator/health" -ForegroundColor White
Write-Host ""
