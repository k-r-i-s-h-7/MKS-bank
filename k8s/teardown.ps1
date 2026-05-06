# MKS-Bank — Teardown Script
# Removes all resources from the mks-bank namespace
# Run from project root: .\k8s\teardown.ps1

Write-Host "🗑  Tearing down MKS-Bank from Kubernetes..." -ForegroundColor Red
kubectl delete namespace mks-bank
Write-Host "✅ All resources deleted. PVC data is also removed." -ForegroundColor Green
