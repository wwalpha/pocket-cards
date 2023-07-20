# ----------------------------------------------------------------------------------------------
# AWS Provider
# ----------------------------------------------------------------------------------------------
provider "aws" {}

# ----------------------------------------------------------------------------------------------
# Terraform Settings
# ----------------------------------------------------------------------------------------------
terraform {
  backend "s3" {
    bucket = "terraform-state-202106"
    key    = "pkc/backend.state"
    region = "us-east-1"
  }

  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Remote state - Setup
# ----------------------------------------------------------------------------------------------
data "terraform_remote_state" "setup" {
  backend   = "s3"
  workspace = terraform.workspace

  config = {
    bucket = "terraform-state-202106"
    key    = "pkc/setup.state"
    region = "us-east-1"
  }
}

# ----------------------------------------------------------------------------------------------
# Remote state - Services
# ----------------------------------------------------------------------------------------------
data "terraform_remote_state" "services" {
  backend   = "s3"
  workspace = terraform.workspace

  config = {
    bucket = "terraform-state-202106"
    key    = "pkc/services.state"
    region = "us-east-1"
  }
}
