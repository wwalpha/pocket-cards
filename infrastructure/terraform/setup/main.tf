# -----------------------------------------------
# AWS Provider
# -----------------------------------------------
provider "aws" {
  region = "ap-northeast-1"
}

# -----------------------------------------------
# Terraform Settings
# -----------------------------------------------
terraform {
  backend "s3" {
    bucket = "terraform-workspaces-0506"
    region = "ap-northeast-1"
    key    = "pocket-cards/setup.tfstate"
  }

  required_version = ">= 0.15"
}

# -----------------------------------------------
# Remote state - Initialize
# -----------------------------------------------
# data "terraform_remote_state" "initialize" {
#   backend   = "s3"
#   workspace = "${terraform.workspace}"

#   config = {
#     bucket = "terraform-workspaces"
#     region = "ap-northeast-1"
#     key    = "pocket-cards/initialize.tfstate"
#   }
# }
