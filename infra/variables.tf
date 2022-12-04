variable "tags" {}
variable "region" {
  default = "eu-north-1"
}
variable "role_arn" {}
variable "isFrontend" {
  default = false
}
variable "account_name" {}
variable "base_image" {
  default = ""
}
variable "image_name" {
  description = "Image name"
}
variable "image_tag" {}

variable "environment_variables" {
  default = []
}

variable "name" {}