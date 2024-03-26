terraform {
  backend "azurerm" {
    resource_group_name  = "rg-tfbackend"
    storage_account_name = "sttfbackendsubneter"
    container_name       = "terraform-state"
    key                  = "terraform.tfstate"
  }
}
