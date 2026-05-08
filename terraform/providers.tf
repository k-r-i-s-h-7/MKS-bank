terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23.0"
    }
  }
}

provider "kubernetes" {
  # This tells Terraform to use your local Docker Desktop Kubernetes config
  config_path    = "~/.kube/config"
  config_context = "docker-desktop"
}
