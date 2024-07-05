resource "azurerm_postgresql_flexible_server" "example" {
  name                          = "subneter-psql-flex"
  resource_group_name           = azurerm_resource_group.main.name
  location                      = "Germany West Central"
  version                       = "16"
  public_network_access_enabled = true
  administrator_login           = "psqladmin"
  administrator_password        = "H@Sh1CoR3!"
  zone                          = "1"
  storage_mb                    = 32768
  storage_tier                  = "P15"
  sku_name                      = "Standard_B2s"

}
