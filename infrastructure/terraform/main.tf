provider "azurerm" {
  features {

  }
}

module "naming" {
  source = "Azure/naming/azurerm"
  suffix = ["subneter${var.stage}"]
}

