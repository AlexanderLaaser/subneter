resource "azurerm_log_analytics_workspace" "this" {
  name                = "subneter-workspace"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_container_app_environment" "main" {
  name                       = "subneter-env"
  location                   = var.location
  resource_group_name        = azurerm_resource_group.main.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.this.id

  depends_on = [azurerm_role_assignment.containerappsacrpull]
}

resource "azurerm_container_app" "react" {
  name                         = "subneter-react"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  registry {
    server   = "acrsubneterdev.azurecr.io"
    identity = azurerm_user_assigned_identity.main.id
  }

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.main.id]
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 5173
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    container {
      name   = "react"
      image  = "acrsubneterdev.azurecr.io/react:latest"
      cpu    = 1.0
      memory = "2Gi"

      env {
        name  = "DJANGO_API_URL"
        value = var.VITE_API_SERVER_URL
      }
    }
  }
  depends_on = [azurerm_role_assignment.containerappsacrpull]
}

resource "azurerm_container_app" "django" {
  name                         = "subneter-django"
  container_app_environment_id = azurerm_container_app_environment.main.id
  resource_group_name          = azurerm_resource_group.main.name
  revision_mode                = "Single"

  registry {
    server   = "acrsubneterdev.azurecr.io"
    identity = azurerm_user_assigned_identity.main.id
  }

  identity {
    type         = "UserAssigned"
    identity_ids = [azurerm_user_assigned_identity.main.id]
  }

  ingress {
    allow_insecure_connections = false
    external_enabled           = true
    target_port                = 8000
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }

  template {
    container {
      name   = "django"
      image  = "acrsubneterdev.azurecr.io/django:latest"
      cpu    = 1.0
      memory = "2Gi"

      env {
        name  = "DB_NAME"
        value = var.DB_NAME
      }

      env {
        name  = "DB_USER"
        value = var.DB_USER
      }

      env {
        name  = "DB_PASSWORD"
        value = var.DB_PASSWORD
      }

      env {
        name  = "DB_HOST"
        value = var.DB_HOST
      }

      env {
        name  = "DB_PORT"
        value = var.DB_PORT
      }
    }
  }

  depends_on = [azurerm_role_assignment.containerappsacrpull]
}
