provider "aws" {}

# ----------------------------------------------------------------------------------------------
# Terraform Settings
# ----------------------------------------------------------------------------------------------
terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "wwalpha"

    workspaces {
      prefix = "pocket-cards-outputs-"
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Remote state - Setup
# ----------------------------------------------------------------------------------------------
data "terraform_remote_state" "setup" {
  backend   = "remote"
  workspace = terraform.workspace

  config = {
    organization = "wwalpha"

    workspaces = {
      prefix = "pocket-cards-setup-"
    }
  }
}

# ----------------------------------------------------------------------------------------------
# Remote state - Services
# ----------------------------------------------------------------------------------------------
data "terraform_remote_state" "services" {
  backend   = "remote"
  workspace = terraform.workspace

  config = {
    organization = "wwalpha"

    workspaces = {
      prefix = "pocket-cards-services-"
    }
  }
}

locals {
  remote_setup    = data.terraform_remote_state.setup.outputs
  remote_services = data.terraform_remote_state.remote_services.outputs
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

output "cognito_user_pool_id" {
  value = local.remote_setup.cognito_user_pool_id
}

output "cognito_user_pool_client_id" {
  value = local.remote_setup.cognito_user_pool_client_id
}

output "cognito_identity_pool_id" {
  value = local.remote_setup.cognito_identity_pool_id
}
