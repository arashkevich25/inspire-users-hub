name         = "hub"
account_name = "nonprod"
tags = {
  "Env"       = "nonprod",
  "Service"   = "hub",
  "ManagedBy" = "terraform"
}
role_arn   = ""
image_name = "inspire-users-hub-beta"
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