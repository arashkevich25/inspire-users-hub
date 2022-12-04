locals {
  db_environments = [{
    "name" : "DB_ENDPOINT",
    "value" : data.aws_ssm_parameter.db_endpoint.value
    },
    {
      "name" : "DB_PASSWORD",
      "value" : data.aws_ssm_parameter.db_password.value
    },
    {
      "name" : "DB_USER",
      "value" : data.aws_ssm_parameter.db_username.value
  }]
  environments = concat(
    local.db_environments,
  var.environment_variables)
}

module "service" {
  source = ""

  account_name = var.account_name
  role_arn     = var.role_arn
  isFrontend   = true

  tags = var.tags

  desired_count = 1
  max_count     = 5
  min_count     = 1

  container_definition = {
    ports = [
      { protocol = "TCP", port = 80 },
      { protocol = "TCP", port = 3000 },
      { protocol = "TCP", port = 50051 }
    ]
    service   = var.name
    image     = "${var.base_image}/${var.image_name}:${var.image_tag}"
    essential = true
    portMappings = [
      {
        containerPort = 50051
        hostPort      = 50051
      },
      {
        containerPort = 3000
        hostPort      = 3000
      },
      {
        containerPort = 80
        hostPort      = 80
      }
    ]
    target_group_port = 80
    lb_container_port = 3000
    health_check_path = "/monitoring/check"
    cpu               = 512
    memory            = 1024
    environment       = local.environments
  }
  cpu    = 512
  memory = 1024
}
