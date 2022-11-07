# ----------------------------------------------------------------------------------------------
# AWS Provider
# ----------------------------------------------------------------------------------------------
provider "aws" {}

# ----------------------------------------------------------------------------------------------
# AWS Provider - US
# ----------------------------------------------------------------------------------------------
provider "aws" {
  region = local.region_us
  alias  = "global"
}

# ----------------------------------------------------------------------------------------------
# Terraform Settings
# ----------------------------------------------------------------------------------------------
terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "wwalpha"

    workspaces {
      prefix = "pocket-cards-services-"
    }
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
  backend   = "remote"
  workspace = terraform.workspace

  config = {
    organization = "wwalpha"

    workspaces = {
      prefix = "pocket-cards-setup-"
    }
  }
}
