resource "azurerm_resource_group" "tfbackend" {
  name     = "rg-tfbackend"
  location = var.location

  tags = {
    environment = var.stage
  }
}

resource "azurerm_resource_group" "main" {
  name     = module.naming.resource_group.name
  location = var.location

  tags = {
    environment = var.stage
  }

}

resource "azurerm_user_assigned_identity" "main" {
  location            = azurerm_resource_group.main.location
  name                = "subneter-main"
  resource_group_name = azurerm_resource_group.main.name
}


