data "aws_ssm_parameter" "db_password" {
  name = "/${var.account_name}/infra/database/password"
}

data "aws_ssm_parameter" "db_username" {
  name = "/${var.account_name}/infra/database/username"
}

data "aws_ssm_parameter" "db_endpoint" {
  name = "/${var.account_name}/infra/database/endpoint"
}
