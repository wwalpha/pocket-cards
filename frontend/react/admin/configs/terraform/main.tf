provider "aws" {}

# ----------------------------------------------------------------------------------------------
# Terraform Settings
# ----------------------------------------------------------------------------------------------
terraform {
  backend "s3" {
    bucket = "terraform-state-202106"
    key    = "pkc/outputs.state"
    region = "us-east-1"
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

locals {
  remote_setup = data.terraform_remote_state.setup.outputs
}

# ----------------------------------------------------------------------------------------------
# Outputs
# ----------------------------------------------------------------------------------------------
output "bucket_name_archive" {
  value = local.remote_setup.bucket_name_archive
}

output "bucket_name_frontend" {
  value = local.remote_setup.bucket_name_frontend
}
