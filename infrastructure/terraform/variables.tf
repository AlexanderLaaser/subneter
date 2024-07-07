variable "stage" {
  type    = string
  default = "dev"
}

variable "location" {
  type    = string
  default = "West Europe"
}

variable "clientid" {
  type = string
}

variable "objectid" {
  type = string
}

variable "http_application_routing_enabled" {
  default = false
}

variable "VITE_API_SERVER_URL" {
  type = string
}
