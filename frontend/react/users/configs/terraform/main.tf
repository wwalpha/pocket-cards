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
