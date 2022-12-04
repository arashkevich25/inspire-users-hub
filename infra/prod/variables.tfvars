name         = "hub"
account_name = "prod"
tags = {
  "Env"       = "prod",
  "Service"   = "hub",
  "ManagedBy" = "terraform"
}
role_arn   = ""
image_name = "inspire-users-hub"
isFrontend = true

environment_variables = [
  {
    "name" : "DB_NAME",
    "value" : ""
  },
  {
    "name" : "INFRA",
    "value" : ""
  },
  {
    "name" : "AUTH_SECRET_KEY",
    "value" : ""
  },
  {
    "name" : "API_KEY",
    "value" : ""
  },
  {
    "name" : "APP_PORT",
    "value" : ""
  },
  {
    "name" : "GRPC_ENDPOINT",
    "value" : ""
  }
]