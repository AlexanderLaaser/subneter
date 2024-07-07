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

variable "DB_NAME" {
  type = string
}

variable "DB_USER" {
  type = string
}

variable "DB_PASSWORD" {
  type = string
}

variable "DB_HOST" {
  type = string
}

variable "DB_PORT" {
  type = string
}

variable "FRONTEND_URL" {
  type = string
}

variable "BACKEND_URL" {
  type = string
}
