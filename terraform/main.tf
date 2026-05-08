# 1. Manage the Kubernetes Namespace
resource "kubernetes_namespace" "mks_bank" {
  metadata {
    name = "mks-bank-tf"
    labels = {
      environment = "dev"
      managed_by  = "terraform"
    }
  }
}

# 2. ConfigMap
resource "kubernetes_config_map" "app_config" {
  metadata {
    name      = "mks-bank-config"
    namespace = kubernetes_namespace.mks_bank.metadata[0].name
  }

  data = {
    SPRING_PROFILES_ACTIVE = "prod"
    SPRING_DATASOURCE_URL  = "jdbc:postgresql://postgres-service:5432/bankdb?options=-c%20TimeZone=UTC"
    SPRING_JPA_HIBERNATE_DDL_AUTO = "update"
    REDIS_HOST = "redis-service"
    REDIS_PORT = "6379"
  }
}

# 3. Secrets
resource "kubernetes_secret" "mks_bank_secrets" {
  metadata {
    name      = "mks-bank-secrets"
    namespace = kubernetes_namespace.mks_bank.metadata[0].name
  }

  type = "Opaque"

  data = {
    POSTGRES_USER              = "postgres"
    POSTGRES_PASSWORD          = "postgres"
    POSTGRES_DB                = "bankdb"
    SPRING_DATASOURCE_USERNAME = "postgres"
    SPRING_DATASOURCE_PASSWORD = "postgres"
  }
}

# 4. Postgres Deployment & Service
resource "kubernetes_deployment" "postgres" {
  metadata {
    name      = "postgres"
    namespace = kubernetes_namespace.mks_bank.metadata[0].name
  }
  spec {
    replicas = 1
    selector {
      match_labels = { app = "postgres" }
    }
    template {
      metadata {
        labels = { app = "postgres" }
      }
      spec {
        container {
          name  = "postgres"
          image = "postgres:15-alpine"
          port { container_port = 5432 }
          env_from {
            secret_ref { name = kubernetes_secret.mks_bank_secrets.metadata[0].name }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "postgres_service" {
  metadata {
    name      = "postgres-service"
    namespace = kubernetes_namespace.mks_bank.metadata[0].name
  }
  spec {
    selector = { app = "postgres" }
    port {
      port        = 5432
      target_port = 5432
    }
  }
}

# 5. Redis Deployment & Service
resource "kubernetes_deployment" "redis" {
  metadata {
    name      = "redis"
    namespace = kubernetes_namespace.mks_bank.metadata[0].name
  }
  spec {
    replicas = 1
    selector {
      match_labels = { app = "redis" }
    }
    template {
      metadata {
        labels = { app = "redis" }
      }
      spec {
        container {
          name  = "redis"
          image = "redis:alpine"
          port { container_port = 6379 }
        }
      }
    }
  }
}

resource "kubernetes_service" "redis_service" {
  metadata {
    name      = "redis-service"
    namespace = kubernetes_namespace.mks_bank.metadata[0].name
  }
  spec {
    selector = { app = "redis" }
    port {
      port        = 6379
      target_port = 6379
    }
  }
}

# 6. Backend Deployment & Service
resource "kubernetes_deployment" "backend" {
  metadata {
    name      = "backend"
    namespace = kubernetes_namespace.mks_bank.metadata[0].name
  }
  spec {
    replicas = 2
    selector {
      match_labels = { app = "backend" }
    }
    template {
      metadata {
        labels = { app = "backend" }
      }
      spec {
        container {
          name  = "backend"
          image = "mks-bank/backend:latest"
          image_pull_policy = "Never"
          port { container_port = 9090 }
          
          env_from {
            config_map_ref { name = kubernetes_config_map.app_config.metadata[0].name }
          }

          env {
            name = "SPRING_DATASOURCE_USERNAME"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.mks_bank_secrets.metadata[0].name
                key  = "SPRING_DATASOURCE_USERNAME"
              }
            }
          }
          env {
            name = "SPRING_DATASOURCE_PASSWORD"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.mks_bank_secrets.metadata[0].name
                key  = "SPRING_DATASOURCE_PASSWORD"
              }
            }
          }

          readiness_probe {
            http_get {
              path = "/actuator/health"
              port = 9090
            }
            initial_delay_seconds = 45
            period_seconds        = 10
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "backend_service" {
  metadata {
    name      = "backend-service"
    namespace = kubernetes_namespace.mks_bank.metadata[0].name
  }
  spec {
    type     = "NodePort"
    selector = { app = "backend" }
    port {
      port        = 9090
      target_port = 9090
      node_port   = 30080
    }
  }
}

# 7. Frontend Deployment & Service
resource "kubernetes_deployment" "frontend" {
  metadata {
    name      = "frontend"
    namespace = kubernetes_namespace.mks_bank.metadata[0].name
  }
  spec {
    replicas = 1
    selector {
      match_labels = { app = "frontend" }
    }
    template {
      metadata {
        labels = { app = "frontend" }
      }
      spec {
        container {
          name  = "frontend"
          image = "mks-bank/frontend:latest"
          image_pull_policy = "Never"
          port { container_port = 80 }
        }
      }
    }
  }
}

resource "kubernetes_service" "frontend_service" {
  metadata {
    name      = "frontend-service"
    namespace = kubernetes_namespace.mks_bank.metadata[0].name
  }
  spec {
    type     = "NodePort"
    selector = { app = "frontend" }
    port {
      port        = 80
      target_port = 80
      node_port   = 30000
    }
  }
}
